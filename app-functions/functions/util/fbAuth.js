const { admin, db } = require("../util/admin");

exports.FBAuth = (req, res, next) => {
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
      db.collection("users")
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
