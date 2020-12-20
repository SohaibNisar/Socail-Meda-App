import {
    SET_FRIENDS_ERRORS,
    CLEAR_FRIENDS_ERRORS,
    SET_SUGGESTED_FRIENDS,
    LOADING_SUGGESTED_FRIENDS,
    STOP_LOADING_SUGGESTED_FRIENDS,
} from '../types';

const initialState = {
    suggestedFriends: [],
    loadingFriends: false,
    errors: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_FRIENDS_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        case CLEAR_FRIENDS_ERRORS:
            return {
                ...state,
                errors: null,
            }
        case LOADING_SUGGESTED_FRIENDS:
            return {
                ...state,
                loadingFriends: true,
            }
        case STOP_LOADING_SUGGESTED_FRIENDS:
            return {
                ...state,
                loadingFriends: false,
            }
        case SET_SUGGESTED_FRIENDS:
            return {
                ...state,
                suggestedFriends: action.payload,
            }

        default:
            return state
    }
}