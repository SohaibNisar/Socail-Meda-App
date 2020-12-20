import {
    SET_STATIC_USER,
    LOADING_STATIC_USER,
    STOP_LOADING_STATIC_USER,
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
            payload: null,
        })
        dispatch({ type: STOP_LOADING_STATIC_USER });
        console.log(err);
    })
}