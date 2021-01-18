import {
    SET_STATIC_USER,
    UNSET_STATIC_USER,
    LOADING_STATIC_USER,
    STOP_LOADING_STATIC_USER,
    LIKE_STATIC_USER_POST,
    UNLIKE_STATIC_USER_POST,
    DELETE_POST,
    UPLOAD_POST,
} from '../types';

const initialState = {
    loadingStaticUser: false,
    credentials: null,
    posts: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_STATIC_USER:
            return {
                ...state,
                ...action.payload
            };
        case UNSET_STATIC_USER:
            return {
                loadingStaticUser: false,
                credentials: null,
                posts: [],
            };
        case LOADING_STATIC_USER:
            return {
                ...state,
                loadingStaticUser: true
            };
        case STOP_LOADING_STATIC_USER:
            return {
                ...state,
                loadingStaticUser: false
            };
        case LIKE_STATIC_USER_POST:
            if (state.posts) {
                let index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index >= 0) {
                    state.posts[index].likesCount++
                }
            }
            return {
                ...state,
            }
        case UNLIKE_STATIC_USER_POST:
            if (state.posts) {
                let index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index >= 0) {
                    state.posts[index].likesCount--
                }
            }
            return {
                ...state,
            }
        case DELETE_POST:
            if (state.posts) {
                let index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index >= 0) {
                    state.posts.splice(index, 1)
                }
            }
            return {
                ...state,
            }
        case UPLOAD_POST:
            let user = action.user;
            if (user.authenticated && user.credentials && state.credentials && user.credentials.userHandle === state.credentials.userHandle) {
                state.posts.unshift(action.payload)
            }
            return {
                ...state
            }
        default:
            return state
    }
}