import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    NO_REPOS
} from '../actions/types';

const initialState = {
    profile: null,
    loading: true,
    repos: [],
    profiles: [],
    error: {}
}


export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                loading: false,
                profile: payload
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                loading: false,
                profile: null,
                repos: [],
            };
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            };
        case NO_REPOS:
            return {
                ...state,
                repos: []
            };
        default:
            return state;
    }
}