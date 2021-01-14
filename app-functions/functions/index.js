const functions = require("firebase-functions");
const {
    getAllPost,
    uploadOnePost,
    commentPost,
    getComments,
    likePost,
    unlikePost,
    deletePost
} = require("./handler/posts");
const { signup, login, } = require("./handler/auth");
const {
    getAuthenticUserData,
    getUserData,
    sugestedFriends,
    searchFriend,
    editProfile,
    // addUserDetails,
    markNotificationRead,
    addFriend,
    // getFriendRequests,
    confirmRequest,
    deleteRequest,
    unFriend
} = require("./handler/users");
const { FBAuth } = require("./util/fbAuth");
const express = require("express");
const cors = require('cors');
const { admin, db } = require("./util/admin");


const app = express();
app.use(cors({ origin: true }));

// auth
app.post("/signup", signup);
app.post("/login", login);

// user
app.get("/authenticUser", FBAuth, getAuthenticUserData);
app.get("/user/:userHandle", getUserData);
app.get("/sugestedFriends", FBAuth, sugestedFriends);
app.get("/searchUser/:text", searchFriend);
// app.get("/friendRequests", FBAuth, getFriendRequests);
// app.post("/user/addUserDetails", FBAuth, addUserDetails);
app.post("/user/editProfile", FBAuth, editProfile);
app.post("/notifications", FBAuth, markNotificationRead);
app.post("/friendRequest/:userHandle", FBAuth, addFriend);
app.post("/confirmFriendRequest/:userHandle", FBAuth, confirmRequest);
app.delete("/friendRequest/:userHandle", FBAuth, deleteRequest);
app.delete("/unFriend/:userHandle", FBAuth, unFriend);

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
        }).catch(err => {
            console.log(err.message, err)
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
                })
        } else {
            console.log('like notification not found');
        }
    }).catch(err => {
        console.log(err.message, err)
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
        }).catch(err => {
            console.log(err.message, err)
        })
    } else {
        console.log('can not send notification to the same user')
        return true;
    }
})

exports.userFriendsUpdate = functions.firestore.document('users/{userHandle}').onUpdate((change, context) => {
    let beforeData = change.before.data();
    let afterData = change.after.data();
    let userHandle = context.params.userHandle;
    let ref = db.doc(`users/${userHandle}`);
    let batch = db.batch();

    if (beforeData.friends.length != afterData.friends.length) {
        let friends = afterData.friends;

        if (!friends) {
            friends = [];
        }

        let friendsObj = friends.reduce((acc, value) => {
            acc[value.userHandle] = true;
            return acc
        }, {});
        batch.update(ref, { friendsObj })
    }

    if (beforeData.friendRequestsRecieved.length != afterData.friendRequestsRecieved.length) {
        let friendRequestsRecieved = afterData.friendRequestsRecieved;

        if (!friendRequestsRecieved) {
            friendRequestsRecieved = [];
        }

        let friendRequestsRecievedObj = friendRequestsRecieved.reduce((acc, value) => {
            acc[value.userHandle] = true;
            return acc
        }, {});
        batch.update(ref, { friendRequestsRecievedObj })
    }

    if (beforeData.friendRequestsSent.length != afterData.friendRequestsSent.length) {
        let friendRequestsSent = afterData.friendRequestsSent;

        if (!friendRequestsSent) {
            friendRequestsSent = [];
        }

        let friendRequestsSentObj = friendRequestsSent.reduce((acc, value) => {
            acc[value.userHandle] = true;
            return acc
        }, {});
        batch.update(ref, { friendRequestsSentObj })
    }

    return batch.commit()
        .then(() => console.log("friends related objects updated"))
        .catch(err => console.log(err))
})

exports.userImageUpdate = functions.firestore.document('users/{userHandle}').onUpdate((change, context) => {
    let beforeData = change.before.data();
    let afterData = change.after.data();
    if (beforeData.profilePictureUrl != afterData.profilePictureUrl) {
        let imageName = beforeData.profilePictureUrlPath;
        let batch = db.batch();
        return db.collection('posts').where('userHandle', '==', context.params.userHandle).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('no posts')
                } else {
                    querySnapshot.forEach(doc => {
                        let postDocRef = db.doc(`posts/${doc.id}`)
                        batch.update(postDocRef, { profilePicture: afterData.profilePictureUrl })
                    })
                }
                return db.collection('comments').where('userHandle', '==', context.params.userHandle).get()
            }).then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('no comments')
                } else {
                    querySnapshot.forEach(doc => {
                        let commentDocRef = db.doc(`comments/${doc.id}`)
                        batch.update(commentDocRef, { profilePicture: afterData.profilePictureUrl })
                    })
                }

                let p1 = db.collection('users').where(`friendRequestsRecievedObj.${context.params.userHandle}`, '==', true).get();
                let p2 = db.collection('users').where(`friendsObj.${context.params.userHandle}`, '==', true).get();
                let p3 = db.collection('users').where(`friendRequestsSentObj.${context.params.userHandle}`, '==', true).get();

                return Promise.all([p1, p2, p3])
            }).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log('no friend requests recieved and no friends')
                } else {
                    querySnapshot.forEach(docs => {
                        docs.forEach(doc => {
                            let userDocRef = db.doc(`users/${doc.id}`);

                            let friendRequestsRecieved = doc.data().friendRequestsRecieved;
                            let friends = doc.data().friends;
                            let friendRequestsSent = doc.data().friendRequestsSent;

                            if (!friendRequestsRecieved) {
                                friendRequestsRecieved = [];
                            }
                            if (!friends) {
                                friends = [];
                            }
                            if (!friendRequestsSent) {
                                friendRequestsSent = [];
                            }

                            let updatedFriendRequestsRecieved = friendRequestsRecieved.map(request => {
                                request.userHandle == context.params.userHandle && (request.profilePictureUrl = afterData.profilePictureUrl);
                                return request;
                            })
                            let updatedFriends = friends.map(friend => {
                                friend.userHandle == context.params.userHandle && (friend.profilePictureUrl = afterData.profilePictureUrl);
                                return friend;
                            })
                            let updatedFriendRequestsSent = friendRequestsSent.map(request => {
                                request.userHandle == context.params.userHandle && (request.profilePictureUrl = afterData.profilePictureUrl);
                                return request;
                            })

                            batch.update(userDocRef, {
                                friendRequestsRecieved: updatedFriendRequestsRecieved,
                                friends: updatedFriends,
                                friendRequestsSent: updatedFriendRequestsSent
                            })
                        })
                    })
                }
                if (beforeData.profilePictureUrl == `https://firebasestorage.googleapis.com/v0/b/socialmedia-76e8b.appspot.com/o/no-profile-picture.png?alt=media`) {
                    console.log('default image')
                    return true
                } else {
                    return admin.storage().bucket().file(imageName).delete()
                }
            }).then(() => {
                return batch.commit()
            }).then(() => {
                console.log('images updated')
            }).catch(err => console.log(err.message, err))
    } else {
        console.log('same image url');
        return true;
    }
})

exports.postDelete = functions.firestore.document('posts/{postId}').onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    const postMedia = snapshot.data().postMedia;
    const postMediaPath = snapshot.data().postMediaPath;
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
                return admin.storage().bucket().file(postMediaPath).delete()
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
