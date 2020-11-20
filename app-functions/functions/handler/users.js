const Busboy = require("busboy");
const { db, admin } = require("../util/admin");
const { validateUserDetails } = require('../util/validation');
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const os = require("os");
const fs = require("fs");
const path = require("path");

exports.getAuthenticUserData = (req, res) => {
  db.collection('notifications')
    .where('postUserHandle', '==', req.userData.userHandle)
    .orderBy('createdAt', 'desc')
    .limit(10).get().then(querySnapshot => {
      let notifications = [];
      querySnapshot.forEach(doc => {
        notifications.push({ ...doc.data(), notificationId: doc.id })
      })
      return res.json({ notifications, credentials: req.userData })
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