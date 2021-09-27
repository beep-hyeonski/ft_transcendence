/* eslint-disable @typescript-eslint/no-unsafe-call */
import { combineReducers } from 'redux';
import profileModule from './profile';
import userModule from './user';
import sidebarModule from './sidebar';
import authModule from './auth';
import socketModule from './socket';
import chatModule from './chat';

const rootReducer = combineReducers({
  profileModule,
  userModule,
  sidebarModule,
  authModule,
  socketModule,
  chatModule,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
