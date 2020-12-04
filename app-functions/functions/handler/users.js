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
        userData.posts.push({ ...doc.data(), postId: doc.id })
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
  const toUserHandle = req.params.userHandle;

  if (toUserHandle === req.userData.userHandle) {
    res.json({ meassage: 'can not send freind request to own' })
  }

  db.doc(`users/${req.userData.userHandle}`).get().then(doc1 => {
    if (!doc1.exists) {
      res.status(404).json({ other: { message: 'no such user found' } })
    } else {
      console.log('doc1')
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
        return res.status(200).json({ message: 'already friends' })
      } else if (alreadyFriendRequest) {
        return res.status(200).json({ message: 'already friend request sended' })
      } else {
        return db.doc(`users/${toUserHandle}`).get()
      }
    }
  }).then((doc2) => {
    if (!doc2.exists) {
      res.status(404).json({ other: { message: 'no such user found' } })
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
        res.status(200).json({ message: 'already friends' })
      } else if (alreadyFriendRequest) {
        res.status(200).json({ message: 'already friend request sended' })
      } else {
        friendRequests.push({
          userHandle: req.userData.userHandle,
          profilePictureUrl: req.userData.profilePictureUrl,
          createdAt: req.userData.createdAt,
        })
        db.doc(`users/${toUserHandle}`).update({ friendRequests })
          .then((doc) => {
            res.status(200).json({ message: 'friend request sent' })
          }).catch(err => res.status(500).json({
            message: 'add friend reques',
            errMessage: err.message,
            errCode: err.code,
            err,
          }))
      }
    }

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

  let requests = req.userData.friendRequests;
  let request = requests.some(request => request.userHandle == deleteUserHandle);

  if (!requests || !request) {
    return res.status(404).json({ message: 'request not found' })
  }

  let remainRequestData = requests.filter(request => request.userHandle != deleteUserHandle);

  if (!remainRequestData || remainRequestData.length <= 0) {
    remainRequestData = []
  }
  db.doc(`users/${userHandle}`).update({
    friendRequests: remainRequestData,
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
      batch.update(db.doc(`users/${req.userData.userHandle}`, {
        friends: req.userData.friends.filter(friend => friend.userHandle != unFriendUserHandle)
      }))
    } else {
      batch.update(db.doc(`users/${req.userData.userHandle}`, {
        friends: req.userData.friends.filter(friend => friend.userHandle != unFriendUserHandle)
      }))
      batch.update(db.doc(`users/${unFriendUserHandle}`, {
        friends: doc.data().friends.filter(friend => friend.userHandle != req.userData.userHandle)
      }))
    }
  })
}