import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER } from '../types';
import axios from 'axios'

const initialState = {
    authenticated: false,
    credential: null,
    notifications: null,
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
            };
        case SET_UNAUTHENTICATED:
            localStorage.removeItem('FBIdToken');
            delete axios.defaults.headers.common['Authorization'];
            return {
                ...state,
                authenticated: false
            };
        default:
            return state
    }
}