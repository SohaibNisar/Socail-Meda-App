import { SET_POSTS, SET_ERRORS } from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    axios.get('/posts').then((res) => {
        dispatch({
            type: SET_POSTS,
            payload: res.data
        })
    }).catch(error => {
        if (error.response) {
            dispatch({
                type: SET_ERRORS,
                payload: error.response.data
            })
        } else if (error.request) {
            if (error.toJSON().message === 'Network Error') {
                dispatch({
                    type: SET_ERRORS,
                    payload: {
                        other: {
                            message: "network related issue by axios",
                            errMessage: "network error"
                        }
                    }
                })
            } else {
                dispatch({
                    type: SET_ERRORS,
                    payload: {
                        other: {
                            message: "issue by axios",
                            errMessage: "something went wrong"
                        }
                    }
                })
            }
        } else {
            dispatch({
                type: SET_ERRORS,
                payload: {
                    other: {
                        message: "issue by axios",
                        errMessage: "something went wrong"
                    }
                }
            })
        }
    })
}
