import { SET_ALERT, REMOVE_ALERT } from './types';
import uuid from 'uuid'

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid.v4();
    dispatch({
        //This will go to the reducer and will satify switch case
        type: SET_ALERT,
        //This is the remaining infor required by reducer code
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({
        type: REMOVE_ALERT,
        payload: id
    }), timeout);
};