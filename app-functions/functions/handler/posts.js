const Busboy = require("busboy");
const { db, admin } = require("../util/admin");
const { validatePostBody } = require("../util/validation");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const os = require("os");
const fs = require("fs");
const path = require("path");
// const { query } = require("express");


exports.getAllPost = (req, res) => {
  let friends = req.userData.friends;
  if (friends == undefined || friends == null) {
    return res.status(200).json({
      message: 'nothing to show no friends',
      code: 'friends'
    })
  } else if (friends.length > 0) {
    db.collection('posts')
      .where('userHandle', 'in', req.userData.friends)
      .orderBy('createdAt', 'desc')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return res.status(200).json({
            message: 'nothing to show',
            code: 'nothing'
          })
        } else {
          let posts = [];
          snapshot.forEach(doc => {
            posts.push(Object.assign(doc.data(), { id: doc.id }))
          })
          return res.status(200).json(posts)
        }
      }).catch(err => {
        return res.status(500).json({
          message: "getting post fail",
          errMessage: err.message,
          errorCode: err.code,
          err: err
        });
      })
  } else {
    return res.status(200).json({
      message: 'something went wrong',
      code: 'error'
    })
  }
};

exports.uploadOnePost = (req, res) => {
  let newPost = {
    // body: req.body.body,
    body: `helo beautiful world ${req.userData.userHandle}`,
    userHandle: req.userData.userHandle,
    createdAt: new Date().toISOString(),
    profilePicture: req.userData.profilePictureUrl,
    postMedia: null,
    likesCount: 0,
    commentsCount: 0,
  };

  let { errors, valid } = validatePostBody(newPost);

  if (!valid) return res.status(400).json(errors);

  let busboy = new Busboy({ headers: req.headers });
  let imageData = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (req.media == true) {
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
    }
    file.resume();
  });
  busboy.on("finish", function () {
    if (req.media == true) {
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
          const postMediaUrl = `https://firebasestorage.googleapis.com/v0/b/socialmedia-76e8b.appspot.com/o/${imageData.imageFileName}?alt=media&token=${uuid}`;
          newPost.postMedia = postMediaUrl;
          db.collection("posts")
            .add(newPost)
            .then(snapshot => {
              return res.status(200).json({
                message: `post(media) added with id ${snapshot.id} `
              });
            })
            .catch(err => {
              return res.status(500).json({
                message: "adding post fail",
                errMessage: err.message,
                errorCode: err.code,
                err
              });
            });
        })
        .catch(err => {
          return res.status(500).json({
            message: "uploading post media to storage fail",
            errMessage: err.message,
            errorCode: err.code,
            err
          });
        });
    } else {
      db.collection("posts")
        .add(newPost)
        .then(snapshot => {
          return res.status(200).json({
            message: `post added with id ${snapshot.id} `
          });
        })
        .catch(err => {
          return res.status(500).json({
            message: "adding post fail",
            errMessage: err.message,
            errorCode: err.code,
            err
          });
        });
    }
  });
  busboy.end(req.rawBody);
};

exports.commentPost = (req, res) => {
  if (req.body.body.trim() == '' || req.body.body == null) res.status(400).json({ error: 'Must not be empty' })

  const postId = req.params.postId;

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    userHandle: req.userData.userHandle,
    profilePictureUrl: req.userData.profilePictureUrl,
    postId: postId,
  }

  db.doc(`posts/${postId}`).get().then((doc) => {
    if (!doc.exists) {
      res.status(400).json({ message: 'post not found' })
    } else {
      db.collection('comments')
        .add({
          ...newComment,
          postUserHandle: doc.data().userHandle
        }).then(() => {
          return db.doc(`posts/${postId}`).update({
            commentsCount: admin.firestore.FieldValue.increment(1)
          })
        }).then(() => {
          res.status(200).json('comment added')
        }).catch(err => {
          return res.status(500).json({
            message: "adding comment fail",
            errMessage: err.message,
            errorCode: err.code,
            err: err
          });
        })
    }
  }).catch(err => {
    return res.status(500).json({
      message: "checking post fail",
      errMessage: err.message,
      errorCode: err.code,
      err: err
    });
  })
}

exports.getComments = (req, res) => {
  db.collection('comments')
    .where('postId', '==', req.params.postId)
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      let comments = [];
      snapshot.forEach(doc => [
        comments.push({ id: doc.id, ...doc.data() })
      ])
      res.json(comments)
    }).catch(err => {
      return res.status(500).json({
        message: "getting comment fail",
        errMessage: err.message,
        errorCode: err.code,
        err: err
      });
    })
}

exports.likePost = (req, res) => {
  let postId = req.params.postId;
  let userHandle = req.userData.userHandle;

  db.doc(`posts/${postId}`).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(400).json({ err: 'post not found' })
      } else {
        db.collection('likes')
          .where('userHandle', '==', userHandle)
          .where('postId', '==', postId).get()
          .then(snapshot => {
            if (!snapshot.empty) {
              res.json({ mesage: 'already liked' })
            } else {
              db.collection('likes').add({
                postId: postId,
                postUserHandle: doc.data().userHandle,
                userHandle: userHandle,
              }).then(() => {
                return db.doc(`posts/${postId}`).update({
                  likesCount: admin.firestore.FieldValue.increment(1),
                })
              }).then(() => {
                res.json({ message: 'post liked' })
              }).catch(err => {
                return res.status(500).json({
                  message: "adding like fail",
                  errMessage: err.message,
                  errorCode: err.code,
                  err: err
                });
              })
            }
          }).catch(err => {
            return res.status(500).json({
              message: "checking for like doc fail",
              errMessage: err.message,
              errorCode: err.code,
              err: err
            });
          })
      }
    }).catch(err => {
      return res.status(500).json({
        message: "checking for post to be liked fail",
        errMessage: err.message,
        errorCode: err.code,
        err: err
      });
    })
}

exports.unlikePost = (req, res) => {
  let postId = req.params.postId;
  let userHandle = req.userData.userHandle;

  db.doc(`posts/${postId}`).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(403).json({ err: 'post not found' })
      } else {
        db.collection('likes')
          .where('userHandle', '==', userHandle)
          .where('postId', '==', postId).limit(0).get()
          .then(snapshot => {
            if (snapshot.empty) {
              res.json({ mesage: 'already not liked' })
            } else {
              db.collection('likes').doc(snapshot.docs[0].id).delete()
                .then(() => {
                  return db.doc(`posts/${postId}`).update({
                    likesCount: admin.firestore.FieldValue.increment(-1),
                  })
                }).then(() => {
                  res.json({ message: 'post unliked' })
                }).catch(err => {
                  return res.status(500).json({
                    message: "unlikng post fail",
                    errMessage: err.message,
                    errorCode: err.code,
                    err: err
                  });
                })

            }
          }).catch(err => {
            return res.status(500).json({
              message: "checking for unlike doc fail",
              errMessage: err.message,
              errorCode: err.code,
              err: err
            });
          })
      }
    }).catch(err => {
      return res.status(500).json({
        message: "checking for post to be unliked fail",
        errMessage: err.message,
        errorCode: err.code,
        err: err
      });
    })
}

exports.deletePost = (req, res) => {
  let postId = req.params.postId;
  db.doc(`posts/${postId}`).get().then(doc => {
    if (!doc.exists) {
      res.status(404).json({ message: 'post not found' })
    } else {
      if (req.userData.userHandle === doc.data().userHandle) {
        db.doc(`posts/${postId}`).delete()
          .then(() => {
            res.json({ message: 'post deleted successfully' })
          }).catch(err => {
            res.status(500).json({
              message: 'deleting post failed',
              errMessage: err.message,
              errCode: err.code,
              err
            })
          })
      } else {
        res.status(405).json({
          message: 'deleting post failed',
          errMessage: 'can not delete others post'
        })
      }
    }
  }).catch(err => {
    res.status(500).json({
      message: 'checking for post to be deleted failed',
      errMessage: eerr.message,
      errCode: err.code,
      err
    })
  })
}