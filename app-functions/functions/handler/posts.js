const Busboy = require("busboy");
const { db, admin } = require("../util/admin");
const { validatePostBody } = require("../util/validation");
const { v4: uuidv4 } = require("uuid");
const cors = require('cors');
const corsHandler = cors({ origin: true });
const crypto = require("crypto");
const os = require("os");
const fs = require("fs");
const path = require("path");


exports.getAllPost = (req, res) => {
  corsHandler(req, res, () => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(doc => {
          posts.push({
            postId: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            profilePicture: doc.data().profilePicture
          });
        });
        return res.status(200).json(posts);
      })
      .catch(err => {
        return res.status(500).json({
          message: "geting posts fail",
          errMessage: err.message,
          errorCode: err.code
        });
      });
  })
};

exports.uploadOnePost = (req, res) => {
  let newPost = {
    // body: req.body.body,
    body: 'helo beautiful world',
    userHandle: req.userData.userHandle,
    createdAt: new Date().toISOString(),
    profilePicture: req.userData.profilePictureUrl,
    postMedia: ''
  };

  let { errors, valid } = validatePostBody(newPost);

  if (!valid) return res.status(400).json(errors);

  let busboy = new Busboy({ headers: req.headers });
  let imageData = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    file
      .on('data', function (data) {
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
      })
    file.resume();
  });
  busboy.on("finish", function () {
    if (Object.keys(imageData).length > 0) {
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
                message: `post added with id ${snapshot.id} `
              });
            })
            .catch(err => {
              return res.status(500).json({
                message: "adding post fail",
                errMessage: err.message,
                errorCode: err.code
              });
            });
        })
        .catch(err => {
          return res.status(500).json({
            message: "uploading post media to storage fail",
            errMessage: err.message,
            errorCode: err.code
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
            errorCode: err.code
          });
        });
    }
  });
  busboy.end(req.rawBody);
};
