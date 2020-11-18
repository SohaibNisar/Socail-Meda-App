import { SET_POSTS } from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    axios.get('/posts').then((res) => {
        dispatch({
            type: SET_POSTS,
            payload: res.data
        })
    }).catch(error => {
        console.log(error.response.data)
    })
}
