import {createStore} from "redux";
import rootReducer from "./reducers/rootReducer";
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'authType',
    storage: storage,
    // whitelist: ['authType'] // which reducer want to store
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(pReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

persistStore(store);

export default store;
