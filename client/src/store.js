//create store to maintain a connection to the server-side data 

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = [];

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    //take all middlewares otherwise error- middleware is not a function!
    composeWithDevTools(applyMiddleware(...middleware))
);


export default store;