import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import userReducers from "./reducers/userReducers";
import uiReducers from "./reducers/uiReducers";
import dataReducers from "./reducers/dataReducers";

const initialState = {};

const reducers = combineReducers({
    data: dataReducers,
    UI: uiReducers,
    user: userReducers,
});

const store = createStore(
    reducers,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;