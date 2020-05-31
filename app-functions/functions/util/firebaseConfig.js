const firebase = require("firebase");
const firebaseConfig = {
  // apiKey: "AIzaSyA0GXe6hxCvBxVz3V4x0X6aZhs9DyXcJn8",
  // authDomain: "socialmedia-76e8b.firebaseapp.com",
  // databaseURL: "https://socialmedia-76e8b.firebaseio.com",
  // projectId: "socialmedia-76e8b",
  // storageBucket: "socialmedia-76e8b.appspot.com",
  // messagingSenderId: "1039962419648",
  // appId: "1:1039962419648:web:8f54cc4adca068ac89d825",
};
firebase.initializeApp(firebaseConfig);
exports.firebase = firebase;
