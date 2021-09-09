/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  combineReducers,
  createStore,
  Store,
} from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import profileModule from './profile';
import usermeModule from './userme';
import sidebarModule from './sidebar';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  profileModule,
  usermeModule,
  sidebarModule,
});

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
  const store: Store = createStore(enhancedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
}

export type RootState = ReturnType<typeof rootReducer>;
