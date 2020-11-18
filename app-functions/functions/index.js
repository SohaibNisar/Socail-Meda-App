const functions = require("firebase-functions");
const { getAllPost, uploadOnePost,commentPost,getComments,likePost,unlikePost } = require("./handler/posts");
const { signup, login, } = require("./handler/auth");
const { getUserData, uploadImage, addUserDetails } = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");
const { checkImage } = require("./util/checkImage");
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.get("/posts", FBAuth, getAllPost);
app.get("/authenticUser", FBAuth, getUserData);
app.get("/post/get/comments", FBAuth, getComments);

app.post("/posts", [checkImage, FBAuth], uploadOnePost);
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/uploadImage", FBAuth, uploadImage);
app.post("/user/addUserDetails", FBAuth, addUserDetails);
app.post("/post/:postId/comment", FBAuth, commentPost);
app.post("/post/:postId/like", FBAuth, likePost);
app.post("/post/:postId/unlike", FBAuth, unlikePost);

exports.api = functions.https.onRequest(app);
