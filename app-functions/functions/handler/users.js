const Busboy = require("busboy");
const { db, admin } = require("../util/admin");
const { validateUserDetails } = require('../util/validation');
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const os = require("os");
const fs = require("fs");
const path = require("path");

exports.getAuthenticUserData = (req, res) => {
  let userData = {
    credentials: req.userData,
  };
  db.collection('notifications')
    .where('postUserHandle', '==', req.userData.userHandle)
    .orderBy('createdAt', 'desc')
    .limit(10).get().then(querySnapshot => {
      let notifications = [];
      querySnapshot.forEach(doc => {
        notifications.push({ ...doc.data(), notificationId: doc.id })
      })
      userData.notifications = notifications;
      return db.collection('likes').where('userHandle', '==', req.userData.userHandle).get()
    }).then(querySnapshot => {
      let likes = [];
      querySnapshot.forEach(doc => {
        likes.push({ ...doc.data(), likeId: doc.id })
      })
      return res.json({ ...userData, likes })
    }).catch(err => res.status(500).json({ errorMessage: err.message, errorCode: err.code, err }))
}

exports.getUserData = (req, res) => {
  const userHandle = req.params.userHandle;
  let userData = {};
  db.doc(`users/${userHandle}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ message: 'no such user found' })
      } else {
        userData.credentials = doc.data();
        return db.collection('posts').where('userHandle', '==', userHandle).get()
      }
    })
    .then((querySnapshot) => {
      userData.posts = [];
      querySnapshot.forEach(doc => {
        userData.posts.push({ ...doc.data(), id: doc.id })
      });
      return res.json(userData)
    })
    .catch(err => { res.json({ errMessage: err.message, err }) })
}

exports.addUserDetails = (req, res) => {
  // console.log(req.body)
  let userDetails = validateUserDetails(req.body);
  db.collection('users').doc(`${req.userData.userHandle}`).update(userDetails).then((snapshot) => {
    return res.status(200).json({
      message: `user details added successfully`
    });
  }).catch((err) => {
    return res.status(500).json({
      message: "adding user details fail",
      errMessage: err.message,
      errorCode: err.code,
      error: err
    });
  })
}

exports.uploadImage = (req, res) => {
  let busboy = new Busboy({ headers: req.headers });
  let imageData = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      res.status(400).json({ error: 'wrong file type' })
    }
    let imageExtension = filename.split(".")[filename.split(".").length - 1];
    let imageFileName = `${crypto
      .randomBytes(11)
      .toString("hex")}${new Date().valueOf()}.${imageExtension}`;
    let filepath = path.join(os.tmpdir(), imageFileName);
    file.pipe(fs.createWriteStream(filepath));
    imageData = {
      imageFileName,
      filepath,
      mimetype
    };
    file.resume();
  });
  busboy.on("finish", function () {
    let uuid = uuidv4();
    admin
      .storage()
      .bucket()
      .upload(imageData.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .then(() => {
        const profilePictureUrl = `https://firebasestorage.googleapis.com/v0/b/socialmedia-76e8b.appspot.com/o/${imageData.imageFileName}?alt=media&token=${uuid}`;
        db.collection("users")
          .doc(req.userData.userHandle)
          .update({ profilePictureUrl })
          .then(() => {
            // console.log(profilePictureUrl);
            return res.json({ message: "image successfuly uploaded" });
          })
          .catch(err => {
            return res.status(500).json({
              message:
                "uploading user profile picture, adding url to database fail",
              errMessage: err.message,
              errorCode: err.code
            });
          });
      })
      .catch(err => {
        return res.status(500).json({
          message: "uploading user profile picture to storage fail",
          errMessage: err.message,
          errorCode: err.code
        });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationRead = (req, res) => {
  let userHandle = req.userData.userHandle;
  let batch = db.batch();
  db.collection('notifications')
    .where('postUserHandle', '==', userHandle)
    .where('read', '==', false)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        res.status(404).json({ message: 'no notification found' })
      } else {
        querySnapshot.forEach(doc => {
          batch.update(db.doc(`notifications/${doc.id}`), { read: true })
        })
        batch.commit().then(() => {
          res.json({ message: 'notification marked read' })
        }).catch(err => { res.status(500).json({ errMessage: err.message, err }) });
      }
    })
    .catch(err => { res.status(500).json({ errMessage: err.message, err }) })
}

exports.addFriend = (req, res) => {
  let updatedfriendRequests1 = [];
  let updatedfriendRequests2 = [];
  const toUserHandle = req.params.userHandle;

  if (toUserHandle === req.userData.userHandle) {
    return res.json({ meassage: 'can not send freind request to own' })
  }
  db.doc(`users/${req.userData.userHandle}`).get().then(doc1 => {
    if (!doc1.exists) {
      return res.status(404).json({ other: { message: 'no such user found' } })
    } else {
      let friends = doc1.data().friends;
      let friendRequests = doc1.data().friendRequests;

      let alredyFriends = false;
      let alreadyFriendRequest = false;

      if (friends) {
        alredyFriends = friends.some(friend => friend.userHandle == toUserHandle);
      }
      if (friendRequests) {
        alreadyFriendRequest = friendRequests.some(request => request.userHandle == toUserHandle);
      }

      if (alredyFriends) {
        return res.status(400).json({ message: 'already friends' })
      } else if (alreadyFriendRequest) {
        return res.status(400).json({ message: 'already friend request sended' })
      } else {
        updatedfriendRequests1 = friendRequests;
        return db.doc(`users/${toUserHandle}`).get()
      }
    }

  }).then((doc2) => {
    if (!doc2.exists) {
      return res.status(404).json({ other: { message: 'no such user found' } })
    } else {
      let friends = doc2.data().friends;
      let friendRequests = doc2.data().friendRequests;

      let alredyFriends = false;
      let alreadyFriendRequest = false;

      if (friends) {
        alredyFriends = friends.some(friend => friend.userHandle == req.userData.userHandle);
      }
      if (friendRequests) {
        alreadyFriendRequest = friendRequests.some(request => request.userHandle == req.userData.userHandle);
      }

      if (!friendRequests) {
        friendRequests = [];
      }

      if (alredyFriends) {
        return res.status(400).json({ message: 'already friends' })
      } else if (alreadyFriendRequest) {
        return res.status(400).json({ message: 'already friend request sended' })
      } else {
        friendRequests.push({
          userHandle: req.userData.userHandle,
          profilePictureUrl: req.userData.profilePictureUrl,
          createdAt: req.userData.createdAt,
        })
        updatedfriendRequests1.push({
          userHandle: doc2.data().userHandle,
          profilePictureUrl: doc2.data().profilePictureUrl,
          createdAt: doc2.data().createdAt,
        })
        updatedfriendRequests2 = friendRequests;

        let batch = db.batch();

        batch.update(db.doc(`users/${toUserHandle}`), { friendRequests: updatedfriendRequests2 })
        batch.update(db.doc(`users/${req.userData.userHandle}`), { friendRequests: updatedfriendRequests1 })
        return batch.commit();
      }
    }

  }).then((doc) => {
    return res.status(200).json({ message: 'friend request sent' })
  }).catch(err => res.status(500).json({
    message: 'finding user for friend request fail',
    errMessage: err.message,
    errCode: err.code,
    err,
  }))
}

exports.getFriendRequests = (req, res) => {
  let userHandle = req.userData.userHandle;
  db.doc(`users/${userHandle}`).get().then(doc => {
    if (!doc.exists) {
      res.status(404).json({ other: { message: 'no such user found' } })
    } else {
      let friendRequests = doc.data().friendRequests;
      if (friendRequests) {
        res.status(200).json({ requests: friendRequests })
      } else {
        res.status(200).json({ requests: null })
      }
    }
  }).catch(err => res.status(500).json({
    message: 'finding user for friend request fail',
    errMessage: err.message,
    errCode: err.code,
    err,
  }))
}

exports.confirmRequest = (req, res) => {
  let userHandle = req.userData.userHandle;
  let confirmUserHandle = req.params.userHandle;

  db.doc(`users/${confirmUserHandle}`).get().then(doc => {
    if (!doc.exists) {
      res.status(404).json({ other: { message: 'no such user found' } })
    } else {
      let userRequests = req.userData.friendRequests;
      let userFriends = req.userData.friends;
      let confirmUserFriends = doc.data().friends;

      if (!userRequests) {
        res.status(404).json({ message: 'request not found' })
      }

      let confirmUserRequestData = userRequests.filter(request => request.userHandle == confirmUserHandle);
      let remainUserRequests = userRequests.filter(request => request.userHandle != confirmUserHandle);

      if (!confirmUserRequestData || confirmUserRequestData.length <= 0) {
        res.status(404).json({ message: 'request not found' })
      }

      if (!userFriends) {
        userFriends = [];
      }

      if (!confirmUserFriends) {
        confirmUserFriends = [];
      }

      userFriends.push(confirmUserRequestData[0]);
      confirmUserFriends.push({
        createdAt: req.userData.createdAt,
        profilePictureUrl: req.userData.profilePictureUrl,
        userHandle: req.userData.userHandle,
      });

      let batch = db.batch();

      batch.update(db.doc(`users/${userHandle}`), {
        friendRequests: remainUserRequests,
        friends: userFriends,

      })
      batch.update(db.doc(`users/${confirmUserHandle}`), {
        friends: confirmUserFriends,
      })
      batch.commit().then(() => {
        res.json({ message: 'request confirmed' })
      }).catch(err => res.status(500).json({
        message: 'updating user for friend request fail',
        errMessage: err.message,
        errCode: err.code,
        err,
      }))
    }
  }).catch(err => res.status(500).json({
    message: 'finding user for friend request fail',
    errMessage: err.message,
    errCode: err.code,
    err,
  }))
}

exports.deleteRequest = (req, res) => {
  let userHandle = req.userData.userHandle;
  let deleteUserHandle = req.params.userHandle;
  let batch = db.batch();

  let requests = req.userData.friendRequests;
  // let request = requests.some(request => request.userHandle === deleteUserHandle);

  // if (!requests || !request) {
  //   return res.status(404).json({ message: 'request not found' })
  // }

  if (!requests) {
    requests = [];
  }

  let remainRequestData = requests.filter(request => request.userHandle != deleteUserHandle);

  if (!remainRequestData || remainRequestData.length <= 0) {
    remainRequestData = []
  }

  batch.update(db.doc(`users/${userHandle}`), { friendRequests: remainRequestData, })

  db.doc(`users/${deleteUserHandle}`).get().then(doc => {
    let requests = doc.data().friendRequests;

    if (!requests) {
      requests = [];
    }

    let remainRequestData = requests.filter(request => request.userHandle != userHandle);

    if (!remainRequestData || remainRequestData.length <= 0) {
      remainRequestData = []
    }
    batch.update(db.doc(`users/${deleteUserHandle}`), { friendRequests: remainRequestData, })
    return batch.commit()
  }).then(() => {
    res.json({ message: 'request deleted' })
  }).catch(err => res.status(500).json({
    message: 'deleting user request fail',
    errMessage: err.message,
    errCode: err.code,
    err,
  }))
}

exports.unFriend = (req, res) => {
  let unFriendUserHandle = req.params.userHandle;
  let batch = db.batch();
  db.doc(`users/${unFriendUserHandle}`).get().then(doc => {
    if (!doc.exists) {
      let friends1 = req.userData.friends;
      let filterfriends1;
      if (!friends1) {
        filterfriends1 = []
      } else {
        filterfriends1 = friends1.filter(friend => friend.userHandle != unFriendUserHandle)
      }
      batch.update(db.doc(`users/${req.userData.userHandle}`), { friends: filterfriends1 })
    } else {
      let friends1 = req.userData.friends;
      let friends2 = doc.data().friends;
      let filterfriends1;
      let filterfriends2;

      if (!friends1) {
        filterfriends1 = []
      } else {
        filterfriends1 = friends1.filter(friend => friend.userHandle != unFriendUserHandle)
      }

      if (!friends2) {
        filterfriends2 = []
      } else {
        filterfriends2 = friends2.filter(friend => friend.userHandle != req.userData.userHandle)
      }

      batch.update(db.doc(`users/${req.userData.userHandle}`), { friends: filterfriends1 })
      batch.update(db.doc(`users/${unFriendUserHandle}`), { friends: filterfriends2 })
    }
    return batch.commit()
  }).then(() => {
    res.json({ message: 'friend removed' })
  }).catch(err => res.status(500).json({
    message: 'removing friend fail',
    errMessage: err.message,
    errCode: err.code,
    err: err,
  }))
}

// exports.nextFriends = (req, res) => {
//   let previousDoc = req.body.previousDoc;
//   db.collection("users")
//     .orderBy('createdAt')
//     .startAfter(previousDoc)
//     .limit(1)
//     .get().then((querySnapshot) => {
//       if (!querySnapshot.empty) {
//         let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
//         let friends = [];
//         querySnapshot.forEach(doc => {
//           if (doc.data().userHandle != req.userData.userHandle) {
//             friends.push(...doc.data())
//           }
//         })
//         return res.json({ previousDoc: lastVisible, friends })
//       } else {
//         return res.json(null)
//       }
//     }).catch(err => res.status(500).json({
//       message: 'getting next friend sugestions failed',
//       errMessage: err.message,
//       errCode: err.code,
//       err: err,
//     }));
// }

exports.sugestedFriends = (req, res) => {
  let friends = req.userData.friends;
  let requests = req.userData.friendRequests;

  let noFreiends = () => {
    db.collection('users')
      .orderBy('createdAt')
      .get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let sugestedFriends = [];
          querySnapshot.forEach(doc => {
            sugestedFriends.push({
              userHandle: doc.data().userHandle,
              createdAt: doc.data().createdAt,
              profilePictureUrl: doc.data().profilePictureUrl,
            })
          })
          if (!friends) friends = [];
          if (!requests) requests = [];

          let filteredSugestedFriends = sugestedFriends.filter(friend => {
            if (friend.userHandle !== req.userData.userHandle &&
              !friends.some(item => item.userHandle === friend.userHandle) &&
              !requests.some(item => item.userHandle === friend.userHandle)
            ) {
              return true
            } else {
              return false
            }
          })

          return res.json(filteredSugestedFriends)
        } else {
          return res.json([])
        }
      }).catch(err => res.status(500).json({
        message: 'getting next friend sugestions failed',
        errMessage: err.message,
        errCode: err.code,
        err: err,
      }));;
  }

  if (friends) {
    if (friends.length > 0) {
      let promises = [];
      friends.forEach(friend => {
        if (friend.userHandle != req.userData.userHandle) {
          let promise = db.doc(`users/${friend.userHandle}`).get();
          promises.push(promise);
        }
      })
      Promise.all(promises).then((querySnapshot => {
        let sugestedFriends = []
        querySnapshot.forEach(doc => {
          sugestedFriends.push(...doc.data().friends)
        })
        if (sugestedFriends.length > 0) {
          if (sugestedFriends.length > 20) {
            if (!requests) requests = [];

            let filteredSugestedFriends = sugestedFriends.filter(friend => {
              if (friend.userHandle !== req.userData.userHandle &&
                !friends.some(item => item.userHandle === friend.userHandle) &&
                !requests.some(item => item.userHandle === friend.userHandle)
              ) {
                return true
              } else {
                return false
              }
            })

            return res.json(filteredSugestedFriends)
          } else {
            noFreiends()
          }
        } else {
          noFreiends()
        }
      })).catch(err => res.status(500).json({
        message: 'getting next friend sugestions failed',
        errMessage: err.message,
        errCode: err.code,
        err: err,
      }));
    } else {
      noFreiends()
    }
  } else {
    noFreiends()
  }
}

exports.searchFriend = (req, res) => {
  db.collection('users')
    .where('searchUserHanlde', '>=', req.params.text.toLowerCase())
    .get().then(querySnapshot => {
      if (querySnapshot.empty) {
        res.json('nothing')
      } else {
        let data = []
        querySnapshot.forEach(doc => {
          data.push(doc.data())
        })
        res.json(data)
      }
    }).catch(err => {
      res.json({ message: err.message })
    })
}