const { db, admin } = require("../util/admin");
const { firebase } = require("../util/firebaseConfig");
const { validateSignupData, validateLoginData } = require("../util/validation");
const { v4: uuidv4 } = require("uuid");
const Busboy = require("busboy");
const crypto = require("crypto");
const os = require("os");
const fs = require("fs");
const path = require("path");

exports.signup = (req, res) => {
  let newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle
  };

  let { errors, valid } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  db.collection("users")
    .doc(newUser.userHandle)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          message: "signing up user fail",
          errMessage: "userhandle already taken"
        });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then(usersnapshot => {
            let newUserDatabaseCredentials = {
              email: newUser.email,
              userHandle: newUser.userHandle,
              createdAt: new Date().toISOString(),
              userId: usersnapshot.user.uid,
              profilePicture: `https://firebasestorage.googleapis.com/v0/b/socialmedia-76e8b.appspot.com/o/no-profile-picture.png?alt=media`
            };

            db.collection("users")
              .doc(newUser.userHandle)
              .set(newUserDatabaseCredentials)
              .then(snapshot => {
                res.status(201).json({
                  message: `user signed up successfuly with id ${usersnapshot.user.uid} `
                });
              })
              .catch(err => {
                return res.status(500).json({
                  message: "signing up user, adding data to database fail",
                  errMessage: err.message,
                  errorCode: err.code
                });
              });
          })
          .catch(err => {
            return res.status(500).json({
              message: "signing up user fail",
              errMessage: err.message,
              errorCode: err.code
            });
          });
      }
    })
    .catch(err => {
      return res.status(500).json({
        message: "signing up user, checking availability for userHandle fail",
        errMessage: err.message,
        errorCode: err.code
      });
    });
};

exports.login = (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  };

  let { errors, valid } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(snapshot => {
      return snapshot.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      return res.status(500).json({
        message: "loging user fail",
        errMessage: err.message,
        errorCode: err.code
      });
    });
};

exports.uploadImage = (req, res) => {
  let busboy = new Busboy({ headers: req.headers });
  let imageData = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
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
            console.log(profilePictureUrl);
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
