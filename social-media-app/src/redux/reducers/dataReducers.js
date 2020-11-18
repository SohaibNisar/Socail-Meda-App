import { SET_POSTS } from '../types';

const initialState = {
    posts: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_POSTS:
            return {
                posts: action.payload
            };
        default:
            return state
    }
}