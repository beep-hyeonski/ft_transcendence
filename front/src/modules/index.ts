import { combineReducers } from 'redux';
import userModule from './profile';

const rootReducer = combineReducers({
  userModule,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
