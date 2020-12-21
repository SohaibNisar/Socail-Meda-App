import {
    SET_STATIC_USER,
    LOADING_STATIC_USER,
    STOP_LOADING_STATIC_USER,
    LIKE_STATIC_USER_POST,
    UNLIKE_STATIC_USER_POST,
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
            }
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
        default:
            return state
    }
}