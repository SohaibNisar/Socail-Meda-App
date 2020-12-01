import {
    SET_POSTS,
    LOADING_DATA,
    STOP_LOADING_DATA,
    SET_DATA_ERRORS,
    CLEAR_DATA_ERRORS,
    LIKE_POST,
    UNLIKE_POST,
    DELETE_POST,
} from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    dispatch({ type: CLEAR_DATA_ERRORS })
    dispatch({ type: LOADING_DATA })
    axios.get('/posts').then((res) => {
        dispatch({
            type: SET_POSTS,
            payload: res.data
        })
        dispatch({ type: STOP_LOADING_DATA })
    }).catch(error => {
        setError(error)
    })
}

export const likePost = (postId) => (dispatch) => {
    axios.post(`/post/${postId}/like`).then(res => {
        dispatch({
            type: LIKE_POST,
            payload: {
                id: postId
            }
        })
    }).catch(err => {
        setError(err)
    })
}

export const unlikePost = (postId) => (dispatch) => {
    axios.post(`/post/${postId}/unlike`).then(res => {
        dispatch({
            type: UNLIKE_POST,
            payload: {
                id: postId
            }
        })
    }).catch(err => {
        setError(err)
    })
}

export const deletePost = (postId) => (dispatch) => {
    axios.delete(`/post/${postId}`).then((res) => {
        dispatch({
            type: DELETE_POST,
            payload: { id: postId }
        })
    }).catch((err => {
        setError(err)
    }))
}

const setError = (err) => (dispatch) => {
    dispatch({ type: CLEAR_DATA_ERRORS })
    if (err.response) {
        dispatch({
            type: SET_DATA_ERRORS,
            payload: err.response.data
        })
    } else if (err.request) {
        if (err.toJSON().message === 'Network Error') {
            dispatch({
                type: SET_DATA_ERRORS,
                payload: {
                    other: {
                        message: "network related issue by axios",
                        errMessage: "network error"
                    }
                }
            })
        } else {
            dispatch({
                type: SET_DATA_ERRORS,
                payload: err
            })
        }
    } else {
        dispatch({
            type: SET_DATA_ERRORS,
            payload: err
        })
    }
    console.log(err)
}