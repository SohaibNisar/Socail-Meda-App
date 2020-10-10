const functions = require("firebase-functions");
const { getAllPost, uploadOnePost } = require("./handler/posts");
const { signup, login, uploadImage } = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");
const express = require("express");
const app = express();

app.get("/posts", getAllPost);
app.post("/posts", FBAuth, uploadOnePost);
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/uploadImage", FBAuth, uploadImage);
exports.api = functions.https.onRequest(app);
