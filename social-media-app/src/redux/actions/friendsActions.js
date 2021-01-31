import {
    SET_FRIENDS_ERRORS,
    CLEAR_FRIENDS_ERRORS,
    SET_SUGGESTED_FRIENDS,
    LOADING_SUGGESTED_FRIENDS,
    STOP_LOADING_SUGGESTED_FRIENDS,
    ADD_FRIEND,
    CANCEL_REQUEST,
    UNFRIEND,
    CONFIRM_FRIEND,
} from '../types';
import axios from 'axios';

export const getSuggestedFriends = () => (dispatch) => {
    dispatch({ type: LOADING_SUGGESTED_FRIENDS })
    axios.get('/sugestedFriends').then(res => {
        dispatch({ type: CLEAR_FRIENDS_ERRORS })
        dispatch({
            type: SET_SUGGESTED_FRIENDS,
            payload: res.data
        })
        dispatch({ type: STOP_LOADING_SUGGESTED_FRIENDS })
    }).catch(err => {
        setError(err)
        dispatch({ type: STOP_LOADING_SUGGESTED_FRIENDS })
    })
}

export const addFriend = (userHandle) => (dispatch) => {
    axios.post(`/friendRequest/${userHandle}`).then(res => {
        dispatch({ type: CLEAR_FRIENDS_ERRORS })
        dispatch({
            type: ADD_FRIEND,
            payload: { userHandle },
        });
    }).catch(err => {
        console.log(err)
        setError(err)
    })
}

export const cancelRequest = (userHandle) => (dispatch) => {
    axios.delete(`/friendRequest/${userHandle}`).then(res => {
        dispatch({ type: CLEAR_FRIENDS_ERRORS })
        dispatch({
            type: CANCEL_REQUEST,
            payload: { userHandle },
        });
    }).catch(err => {
        setError(err)
    })
}

export const unfirend = (userHandle) => (dispatch) => {
    axios.delete(`/unFriend/${userHandle}`).then(res => {
        dispatch({ type: CLEAR_FRIENDS_ERRORS })
        dispatch({
            type: UNFRIEND,
            payload: { userHandle },
        });
    }).catch(err => {
        setError(err)
    })
}

export const confirmRequest = (userHandle) => (dispatch) => {
    axios.post(`/confirmFriendRequest/${userHandle}`).then(res => {
        dispatch({ type: CLEAR_FRIENDS_ERRORS })
        dispatch({
            type: CONFIRM_FRIEND,
            payload: { userHandle },
        });
    }).catch(err => {
        setError(err)
    })
}

const setError = (err) => (dispatch) => {
    if (err.response) {
        if (err.response.data) {
            dispatch({
                type: SET_FRIENDS_ERRORS,
                payload: err.response.data
            })
        }
    } else if (err.request) {
        if (err.toJSON().message === 'Network Error') {
            dispatch({
                type: SET_FRIENDS_ERRORS,
                payload: {
                    other: {
                        message: "network related issue by axios",
                        errMessage: "network error"
                    }
                }
            })
        } else {
            dispatch({
                type: SET_FRIENDS_ERRORS,
                payload: err
            })
        }
    } else {
        dispatch({
            type: SET_FRIENDS_ERRORS,
            payload: err
        })
    }
    console.log(err)
}