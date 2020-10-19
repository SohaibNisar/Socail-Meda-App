const functions = require("firebase-functions");
const { getAllPost, uploadOnePost } = require("./handler/posts");
const { signup, login, } = require("./handler/auth");
const { uploadImage, addUserDetails } = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");
const { checkImage } = require("./util/checkImage");
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.get("/posts", getAllPost);
app.post("/posts", [checkImage, FBAuth], uploadOnePost);
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/uploadImage", FBAuth, uploadImage);
app.post("/user/addUserDetails", FBAuth, addUserDetails);
exports.api = functions.https.onRequest(app);
