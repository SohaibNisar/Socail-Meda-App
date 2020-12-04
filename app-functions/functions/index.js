const functions = require("firebase-functions");
const { getAllPost, uploadOnePost, commentPost, getComments, likePost, unlikePost, deletePost } = require("./handler/posts");
const { signup, login, } = require("./handler/auth");
const { getAuthenticUserData, getUserData, uploadImage, addUserDetails, markNotificationRead, addFriend, getFriendRequests, confirmRequest,deleteRequest } = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");
const express = require("express");
const cors = require('cors');
const { admin, db } = require("./util/admin");
// const { firestore } = require("firebase");
// const { admin } = require("./util/admin");

const app = express();
app.use(cors({ origin: true }));

// auth
app.post("/signup", signup);
app.post("/login", login);

// user
app.get("/authenticUser", FBAuth, getAuthenticUserData);
app.get("/user/:userHandle", getUserData);
app.get("/friendRequests", FBAuth, getFriendRequests);
app.post("/user/addUserDetails", FBAuth, addUserDetails);
app.post("/user/uploadImage", FBAuth, uploadImage);
app.post("/notifications", FBAuth, markNotificationRead);
app.post("/friendRequest/:userHandle", FBAuth, addFriend);
app.post("/confirmFriendRequest/:userHandle", FBAuth, confirmRequest);
app.delete("/friendRequest/:userHandle", FBAuth, deleteRequest);

// post
app.get("/posts", FBAuth, getAllPost);
app.get("/post/:postId/comments", FBAuth, getComments);
app.post("/posts", FBAuth, uploadOnePost);
app.post("/post/:postId/like", FBAuth, likePost);
app.post("/post/:postId/unlike", FBAuth, unlikePost);
app.post("/post/:postId/comment", FBAuth, commentPost);
app.delete("/post/:postId", FBAuth, deletePost);

exports.api = functions.https.onRequest(app);

exports.createLikeNotification = functions.firestore.document('likes/{docId}').onCreate(snapshot => {
    if (snapshot.data().postUserHandle != snapshot.data().userHandle) {
        return db.doc(`notifications/${snapshot.id}`).set({
            read: false,
            userHandle: snapshot.data().userHandle,
            postUserHandle: snapshot.data().postUserHandle,
            postId: snapshot.data().postId,
            likeId: snapshot.id,
            createdAt: new Date().toISOString(),
            type: 'like',
        }).then(docSnap => {
            console.log('like notification added');
            // return true;
        }).catch(err => {
            console.log(err.message, err)
            // return true;
        })
    } else {
        console.log('can not send notification to the same user')
        return true;
    }
})

exports.deleteLikeNotification = functions.firestore.document('likes/{docId}').onDelete(snapshot => {
    return db.doc(`notifications/${snapshot.id}`).get().then((doc) => {
        if (doc.exists) {
            db.doc(`notifications/${snapshot.id}`).delete()
                .then(() => {
                    console.log('like notification deleted');
                    // return true;
                }).catch(err => {
                    console.log(err.message, err)
                    // return true;
                })
        } else {
            console.log('like notification not found');
            // return true
        }
    }).catch(err => {
        console.log(err.message, err)
        // return true;
    })
})

exports.createCommentNotification = functions.firestore.document('comments/{docId}').onCreate(snapshot => {
    if (snapshot.data().postUserHandle != snapshot.data().userHandle) {
        return db.doc(`notifications/${snapshot.id}`).set({
            read: false,
            userHandle: snapshot.data().userHandle,
            postUserHandle: snapshot.data().postUserHandle,
            postId: snapshot.data().postId,
            commentId: snapshot.id,
            createdAt: new Date().toISOString(),
            type: 'comment',
        }).then(docSnap => {
            console.log('comment notification added');
            // return true;
        }).catch(err => {
            console.log(err.message, err)
            // return true;
        })
    } else {
        console.log('can not send notification to the same user')
        return true;
    }
})

exports.userImageUpdate = functions.firestore.document('users/{userHandle}').onUpdate((change, context) => {
    let beforeData = change.before.data();
    let afterData = change.after.data();
    if (beforeData.profilePictureUrl != afterData.profilePictureUrl) {
        let imageName = beforeData.profilePictureUrl.slice(76, 115);
        let batch = db.batch();
        return db.collection('posts')
            .where('userHandle', '==', context.params.userHandle)
            .get().then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('no posts')
                    return db.collection('comments').where('userHandle', '==', context.params.userHandle).get()
                } else {
                    querySnapshot.forEach(doc => {
                        let postDocRef = db.doc(`posts/${doc.id}`)
                        batch.update(postDocRef, { profilePicture: afterData.profilePictureUrl })
                    })
                    return db.collection('comments').where('userHandle', '==', context.params.userHandle).get()
                }
            }).then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('no comments')
                } else {
                    querySnapshot.forEach(doc => {
                        let commentDocRef = db.doc(`comments/${doc.id}`)
                        batch.update(commentDocRef, { profilePicture: afterData.profilePictureUrl })
                    })
                }
                if (imageName == 'no-profile-picture.png') {
                    console.log('default image')
                    return true
                } else {
                    return admin.storage().bucket().file(imageName).delete()
                }
            }).then(() => {
                return batch.commit()
            }).then(() => {
                console.log('post images updated')
                console.log('comment images updated')
                console.log('image deleted')
            }).catch(err => { console.log(err.message, err) })
    } else {
        console.log('same image url');
        return true;
    }
})

exports.postDelete = functions.firestore.document('posts/{postId}').onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    const postMedia = snapshot.data().postMedia;
    return db.collection('comments')
        .where('postId', '==', postId).get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    batch.delete(db.doc(`comments/${doc.id}`))
                })
            } else {
                console.log('no comments')
            }
            return db.collection('notifications').where('postId', '==', postId).get()
        }).then(querySnapshot => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    batch.delete(db.doc(`notifications/${doc.id}`))
                })
            } else {
                console.log('no notifications')
            }
            return db.collection('likes').where('postId', '==', postId).get()
        }).then(querySnapshot => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    batch.delete(db.doc(`likes/${doc.id}`))
                })
            } else {
                console.log('no likes')
            }
            if (postMedia) {
                let imageName = postMedia.slice(76, 115);
                return admin.storage().bucket().file(imageName).delete()
            } else {
                console.log('no post media')
                return true
            }
        }).then(() => {
            return batch.commit()
        }).then(() => {
            console.log('post data deleted')
        }).catch(err => {
            console.log(err.message)
            console.log(err)
        })
})




// exports.deleteCommentNotification = functions.firestore
//     .document('comments/{docId}')
//     .onDelete(snapshot => {
//         db.doc(`notifications/${snapshot.id}`).delete()
//             .then(() => {
//                 console.log('comment notification deleted');
//                 return true;
//             }).catch(err => {
//                 console.log(err.message, err)
//                 return true;
//             })
//     })

