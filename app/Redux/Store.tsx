import { applyMiddleware, combineReducers, createStore } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import tokenReducer from './Reducer/TokenReducer';
import { thunk } from 'redux-thunk';
import userReducer from './Reducer/userReducer';
import kycReducer from './Reducer/KycReducer';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  //Persist reducers
  whitelist: ['tokenReducer', 'CartReducer', 'LabTestUserReducer', 'kycReducer'],
  blacklist: [],
};

const rootReducer = combineReducers({
  tokenReducer: tokenReducer,
  userReducer: userReducer,
  kycReducer: kycReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default createStore(rootReducer, applyMiddleware(thunk));

const store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);

// Exports
export { store, persistor };
