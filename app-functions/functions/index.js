const functions = require("firebase-functions");
const { getAllScreams, postOneScream } = require("./handler/screams");
const { signup, login, uploadImage } = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");
const express = require("express");
const app = express();

app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/uploadImage", FBAuth, uploadImage);
exports.api = functions.https.onRequest(app);
