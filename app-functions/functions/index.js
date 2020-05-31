const functions = require("firebase-functions");
const { getAllScreams, postOneScream } = require("./handler/screams");
const { signup, login } = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");

const express = require("express");
const app = express();

app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
