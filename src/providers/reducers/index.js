import { combineReducers } from 'redux';
import userReducer from './User';
import usersReducer from './Users';

const rootReducer = combineReducers({
  userReducer,
  usersReducer,
});

export default rootReducer;
