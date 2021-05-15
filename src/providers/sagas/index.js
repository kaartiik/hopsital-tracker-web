import { all } from 'redux-saga/effects';
import User from './User';
import Users from './Users';

export default function* rootSaga() {
  yield all([User(), Users()]);
}
