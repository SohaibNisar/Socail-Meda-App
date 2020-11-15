import { LOADING_UI, STOP_LOADING_UI, SET_ERRORS, CLEAR_ERRORS, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from '../types'
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
        .then((res) => {
            let FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch({ type: CLEAR_ERRORS });
            dispatch({ type: STOP_LOADING_UI });
            dispatch({ type: SET_AUTHENTICATED });
            history.push('/')
        })
        .catch(error => {
            dispatch({
                type: SET_ERRORS,
                payload: error.response.data
            })
            dispatch({ type: STOP_LOADING_UI });
        })
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
        .then((res) => {
            let FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch({ type: CLEAR_ERRORS });
            dispatch({ type: STOP_LOADING_UI });
            dispatch({ type: SET_AUTHENTICATED });
            history.push('/')
        })
        .catch(error => {
            dispatch({
                type: SET_ERRORS,
                payload: error.response.data
            })
            dispatch({ type: STOP_LOADING_UI });
        })
}

export const logout = ()=>(dispatch)=>{
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({type:SET_UNAUTHENTICATED})
}
