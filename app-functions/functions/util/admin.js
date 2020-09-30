const admin = require("firebase-admin");

const serviceAccount = require("../socialmedia-76e8b-firebase-adminsdk-3hprt-332f08b52d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialmedia-76e8b.firebaseio.com",
  storageBucket: "socialmedia-76e8b.appspot.com",
});

const db = admin.firestore();

module.exports = { admin, db };
