import {
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    STOP_LOADING_USER,
    SET_USER,
    LIKE_POST,
    UNLIKE_POST,
    LIKE_STATIC_USER_POST,
    UNLIKE_STATIC_USER_POST,
    ADD_FRIEND,
    CANCEL_REQUEST,
    UNFRIEND,
    CONFIRM_FRIEND,
} from '../types';
import axios from 'axios'

const initialState = {
    authenticated: false,
    credentials: null,
    notifications: null,
    likes: [],
    loading: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_USER:
            return {
                ...state,
                loading: true,
            }
        case STOP_LOADING_USER:
            return {
                ...state,
                loading: false,
            }
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
        case LIKE_STATIC_USER_POST:
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
        case UNLIKE_STATIC_USER_POST:
            if (state.likes && state.credentials) {
                let index = state.likes.findIndex(like => like.postId === action.payload.id)
                if (index >= 0) {
                    state.likes.splice(index, 1)
                }
            }
            return {
                ...state
            }
        case ADD_FRIEND:
            if (!state.credentials.friendRequestsSent) {
                state.credentials.friendRequestsSent = []
            }
            state.credentials.friendRequestsSent.push({ userHandle: action.payload.userHandle })
            return {
                ...state
            }
        case CANCEL_REQUEST:
            if (state.credentials) {
                let index = state.credentials.friendRequestsSent.findIndex(request => request.userHandle === action.payload.userHandle)
                if (index >= 0) {
                    state.credentials.friendRequestsSent.splice(index, 1)
                }
            }
            return {
                ...state
            }
        case CONFIRM_FRIEND:
            if (state.credentials) {
                let index1 = state.credentials.friendRequestsRecieved.findIndex(request => request.userHandle === action.payload.userHandle)
                let index2 = state.credentials.friendRequestsSent.findIndex(request => request.userHandle === action.payload.userHandle)
                if (index1 >= 0) {
                    state.credentials.friendRequestsRecieved.splice(index1, 1)
                }
                if (index2 >= 0) {
                    state.credentials.friendRequestsSent.splice(index2, 1)
                }
                state.credentials.friends.push({ userHandle: action.payload.userHandle })
            }
            return {
                ...state
            }
        case UNFRIEND:
            if (state.credentials) {
                let index = state.credentials.friends.findIndex(request => request.userHandle === action.payload.userHandle)
                if (index >= 0) {
                    state.credentials.friends.splice(index, 1)
                }
            }
            return {
                ...state
            }
        default:
            return state
    }
}