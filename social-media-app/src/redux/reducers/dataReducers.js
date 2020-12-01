import {
    SET_POSTS,
    LOADING_DATA,
    STOP_LOADING_DATA,
    SET_DATA_ERRORS,
    CLEAR_DATA_ERRORS,
    LIKE_POST,
    UNLIKE_POST,
    DELETE_POST
} from '../types';

const initialState = {
    posts: [],
    loadingData: false,
    errors: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload
            }
        case LOADING_DATA:
            return {
                ...state,
                loadingData: true,
            }
        case STOP_LOADING_DATA:
            return {
                ...state,
                loadingData: false,
            }
        case SET_DATA_ERRORS:
            return {
                ...state,
                errors: action.payload,
            }
        case CLEAR_DATA_ERRORS:
            return {
                ...state,
                errors: null,
            }
        case LIKE_POST:
            if (state.posts) {
                let index = state.posts.findIndex(post => post.id === action.payload.id)
                if (index >= 0) {
                    state.posts[index].likesCount++
                }
            }
            return {
                ...state,
            }
        case UNLIKE_POST:
            if (state.posts) {
                let index = state.posts.findIndex(post => post.id === action.payload.id)
                if (index >= 0) {
                    state.posts[index].likesCount--
                }
            }
            return {
                ...state,
            }
        case DELETE_POST:
            if (state.posts) {
                let index = state.posts.findIndex(post => post.id === action.payload.id)
                if (index >= 0) {
                    state.posts.splice(index, 1)
                }
            }
            return {
                ...state
            }
        default:
            return state
    }
}