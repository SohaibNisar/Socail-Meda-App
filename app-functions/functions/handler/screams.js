const { db } = require("../util/admin");
const { validateScreamBody } = require("../util/validation");

exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      let screams = [];
      snapshot.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.status(200).json(screams);
    })
    .catch(err => {
      return res.status(500).json({
        message: "geting screams fail",
        errMessage: err.message,
        errorCode: err.code
      });
    });
};

exports.postOneScream = (req, res) => {
  let newScream = {
    body: req.body.body,
    userHandle: req.userData.userHandle,
    createdAt: new Date().toISOString()
  };

  let { errors, valid } = validateScreamBody(newScream);

  if (!valid) return res.status(400).json(errors);

  db.collection("screams")
    .add(newScream)
    .then(snapshot => {
      return res.status(200).json({
        message: `scream added with id ${snapshot.id} `
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: "adding scream fail",
        errMessage: err.message,
        errorCode: err.code
      });
    });
};
