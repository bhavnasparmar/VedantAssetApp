import { applyMiddleware, combineReducers, createStore } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import tokenReducer from './Reducer/TokenReducer';
import { thunk } from 'redux-thunk';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  //Persist reducers
  whitelist: ['tokenReducer', 'CartReducer', 'LabTestUserReducer'],
  blacklist: [],
};

const rootReducer = combineReducers({
  tokenReducer: tokenReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default createStore(rootReducer, applyMiddleware(thunk));

const store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);

// Exports
export { store, persistor };
