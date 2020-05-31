const admin = require("firebase-admin");

const serviceAccount = require("../socialmedia-76e8b-firebase-adminsdk-3hprt-332f08b52d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

const db = admin.firestore();

module.exports = { admin, db };
