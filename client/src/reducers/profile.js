import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE } from '../actions/types';

const initialState = {
    profile: null, //profile will have everything
    loading: true,
    repos: [],        //these repos and profiles will automatically get populated by payload when population the  profile
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
        default:
            return state;
    }
}