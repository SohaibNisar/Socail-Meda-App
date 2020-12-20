import { SET_STATIC_USER, LOADING_STATIC_USER, STOP_LOADING_STATIC_USER } from '../types';

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
        default:
            return state
    }
}