/* eslint-disable @typescript-eslint/no-unsafe-call */
import { combineReducers } from 'redux';
import profileModule from './profile';
import userModule from './user';
import sidebarModule from './sidebar';
import authModule from './auth';
import socketModule from './socket';
import gameStateMoudle from './gamestate';
import gameDataMoudle from './gamedata';

const rootReducer = combineReducers({
  profileModule,
  userModule,
  sidebarModule,
  socketModule,
  authModule,
  gameStateMoudle,
  gameDataMoudle,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
