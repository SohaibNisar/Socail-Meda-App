const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./socialmedia-76e8b-firebase-adminsdk-3hprt-332f08b52d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialmedia-76e8b.firebaseio.com",
});

const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyA0GXe6hxCvBxVz3V4x0X6aZhs9DyXcJn8",
  authDomain: "socialmedia-76e8b.firebaseapp.com",
  databaseURL: "https://socialmedia-76e8b.firebaseio.com",
  projectId: "socialmedia-76e8b",
  storageBucket: "socialmedia-76e8b.appspot.com",
  messagingSenderId: "1039962419648",
  appId: "1:1039962419648:web:8f54cc4adca068ac89d825",
};
firebase.initializeApp(firebaseConfig);

const express = require("express");
const app = express();

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      let screams = [];
      snapshot.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.status(200).json(screams);
    })
    .catch((err) => {
      return res.status(500).json({
        message: "geting screams fail",
        errMessage: err.message,
        errorCode: err.code,
      });
    });
});

let FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      let id = decodedToken.uid;
      admin
        .firestore()
        .collection("users")
        .where("userId", "==", id)
        .limit(1)
        .get()
        .then((snapshot) => {
          let doc = snapshot.docs[0];
          let data = doc.data();
          req.userData = data;
          return next();
        });
    })
    .catch((err) => {
      return res.status(403).json({
        message: "verifying token fail",
        errMessage: err.message,
        errorCode: err.code,
      });
    });
};

app.post("/screams", FBAuth, (req, res) => {
  let newScream = {
    body: req.body.body,
    userHandle: req.userData.userHandle,
    createdAt: new Date().toISOString(),
  };

  let errors = {};

  if (isEmpty(newScream.body)) errors.screamBody = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((snapshot) => {
      return res.status(200).json({
        message: `scream added with id ${snapshot.id} `,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "adding scream fail",
        errMessage: err.message,
        errorCode: err.code,
      });
    });
});

let isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

let isEmail = (email) => {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regex)) return true;
  else return false;
};

// signup route
app.post("/signup", (req, res) => {
  let newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email";
  }

  if (isEmpty(newUser.password)) errors.password = "Must not be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(newUser.userHandle)) errors.userHandle = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  admin
    .firestore()
    .collection("users")
    .doc(newUser.userHandle)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({
          message: "signing up user fail",
          errMessage: "userhandle already taken",
        });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then((usersnapshot) => {
            let newUserDatabaseCredentials = {
              email: newUser.email,
              userHandle: newUser.userHandle,
              createdAt: new Date().toISOString(),
              userId: usersnapshot.user.uid,
            };

            admin
              .firestore()
              .collection("users")
              .doc(newUser.userHandle)
              .set(newUserDatabaseCredentials)
              .then((snapshot) => {
                res.status(201).json({
                  message: `user signed up successfuly with id ${usersnapshot.user.uid} `,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  message: "signing up user, adding data to database fail",
                  errMessage: err.message,
                  errorCode: err.code,
                });
              });
          })
          .catch((err) => {
            return res.status(500).json({
              message: "signing up user fail",
              errMessage: err.message,
              errorCode: err.code,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "signing up user, checking availability for userHandle fail",
        errMessage: err.message,
        errorCode: err.code,
      });
    });
});

app.post("/login", (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((snapshot) => {
      return snapshot.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "loging user fail",
        errMessage: err.message,
        errorCode: err.code,
      });
    });
});

exports.api = functions.https.onRequest(app);
