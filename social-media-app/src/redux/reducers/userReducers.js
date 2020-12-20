import {
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    SET_USER,
    LIKE_POST,
    UNLIKE_POST,
    UNFRIEND,
} from '../types';
import axios from 'axios'

const initialState = {
    authenticated: false,
    credentials: null,
    notifications: null,
    likes: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                // ...state,
                authenticated: true,
                ...action.payload,
            }
        case SET_AUTHENTICATED:
            axios.defaults.headers.common['Authorization'] = localStorage.FBIdToken;
            return {
                ...state,
                authenticated: true
            }
        case SET_UNAUTHENTICATED:
            localStorage.removeItem('FBIdToken');
            delete axios.defaults.headers.common['Authorization'];
            return {
                ...state,
                authenticated: false
            }
        case LIKE_POST:
            if (state.likes && state.credentials) {
                state.likes.push({
                    userHandle: state.credentials.userHandle,
                    postId: action.payload.id
                })
            }
            return {
                ...state
            }
        case UNLIKE_POST:
            if (state.likes && state.credentials) {
                let index = state.likes.findIndex(like => like.postId === action.payload.id)
                if (index >= 0) {
                    state.likes.splice(index, 1)
                }
            }
            return {
                ...state
            }
            // case UNFRIEND:
        default:
            return state
    }
}