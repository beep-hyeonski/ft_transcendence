/* eslint-disable @typescript-eslint/no-unsafe-call */
import { combineReducers } from 'redux';
import profileModule from './profile';
import usermeModule from './userme';
import sidebarModule from './sidebar';
import loginModule from './login';

const rootReducer = combineReducers({
  profileModule,
  usermeModule,
  sidebarModule,
  loginModule,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
