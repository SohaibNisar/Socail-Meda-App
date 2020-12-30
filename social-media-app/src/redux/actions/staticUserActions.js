import {
    SET_STATIC_USER,
    LOADING_STATIC_USER,
    STOP_LOADING_STATIC_USER,
    LIKE_STATIC_USER_POST,
    UNLIKE_STATIC_USER_POST,
} from '../types'
import axios from 'axios';

export const getStaticUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_STATIC_USER });
    axios.get(`/user/${userHandle}`).then((res) => {
        dispatch({
            type: SET_STATIC_USER,
            payload: res.data,
        })
        dispatch({ type: STOP_LOADING_STATIC_USER });
    }).catch(err => {
        dispatch({
            type: SET_STATIC_USER,
            payload: {
                credentials: null,
                posts: [],
            },
        })
        dispatch({ type: STOP_LOADING_STATIC_USER });
        console.log(err);
    })
}

export const likeStaticUserPost = (postId) => (dispatch) => {
    axios.post(`/post/${postId}/like`).then(res => {
        dispatch({
            type: LIKE_STATIC_USER_POST,
            payload: {
                id: postId
            }
        })
    }).catch(err => {
        console.log(err);
    })
}

export const unlikeStaticUserPost = (postId) => (dispatch) => {
    axios.post(`/post/${postId}/unlike`).then(res => {
        dispatch({
            type: UNLIKE_STATIC_USER_POST,
            payload: {
                id: postId
            }
        })
    }).catch(err => {
        console.log(err);
    })
}