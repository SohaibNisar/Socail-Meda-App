const { db } = require("../util/admin");
const { firebase } = require("../util/firebaseConfig");
const { validateSignupData, validateLoginData } = require("../util/validation");

exports.signup = (req, res) => {
  let newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  let { errors, valid } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  db.collection("users")
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

            db.collection("users")
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
};

exports.login = (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password,
  };

  let { errors, valid } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

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
};
