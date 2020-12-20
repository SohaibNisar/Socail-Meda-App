import {
    SET_FRIENDS_ERRORS,
    CLEAR_FRIENDS_ERRORS,
    SET_SUGGESTED_FRIENDS,
    LOADING_SUGGESTED_FRIENDS,
    STOP_LOADING_SUGGESTED_FRIENDS,
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