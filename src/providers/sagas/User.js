/* eslint-disable no-console */
import {
  call,
  put,
  takeEvery,
  takeLatest,
  all,
  take,
} from 'redux-saga/effects';
import rsf, { auth, database } from '../firebaseConfig';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../../constants/routes';

import {
  actions,
  putUserProfile,
  putUserName,
  putUserPhone,
  putLoadingStatus,
  resetUser,
  putUserUuid,
} from '../actions/User';
import { history } from '../../history';

const loginRequest = ({ email, password }) =>
  auth.signInWithEmailAndPassword(email, password);

const logoutRequest = () => auth.signOut();

const onAuthStateChanged = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

function* syncUserSaga() {
  const user = yield call(onAuthStateChanged);

  if (user) {
    const dbUser = yield call(rsf.database.read, `users/${user.uid}`);

    console.log(dbUser);

    if (dbUser === null) {
      alert('Non authorized user!');
      yield put(putUserUuid(null));
      history.push(ROUTES.SIGN_IN);
      window.location.reload(false);

      return;
    }

    // default empty roles
    if (!dbUser.roles) {
      dbUser.roles = {};
    }

    // merge auth and db user
    let authUser = {
      uid: user.uid,
      email: user.email,
      ...dbUser,
    };

    if (authUser.roles[ROLES.ADMIN]) {
      authUser = {
        ...authUser,
        isAdmin: true,
        isAuthorized: true,
      };

      yield put(putUserProfile(authUser));
      history.push(ROUTES.HOME);
      window.location.reload(false);
    } else {
      alert('Non authorized user!');
      yield put(putUserUuid(null));
      history.push(ROUTES.SIGN_IN);
      window.location.reload(false);
    }
  } else {
    alert('Signed out');
    yield put(putUserUuid(null));
    history.push(ROUTES.SIGN_IN);
    window.location.reload(false);
  }
}

function* loginSaga({ payload }) {
  console.log('signing in');
  try {
    const { email, password } = payload;
    yield call(loginRequest, { email, password });
  } catch (error) {
    alert(error);
    return;
  }
  yield call(syncUserSaga);
}

function* signOutSaga() {
  try {
    yield call(rsf.auth.signOut);
  } catch (error) {
    alert('Sign out failure!');
  }
  yield call(syncUserSaga);
}

function* logoutSaga() {
  try {
    yield call(logoutRequest);
  } catch (error) {
    alert('Error!');
    return;
  }
  yield call(syncUserSaga);
  //   AsyncStorage.removeItem(Constants.login.tokenKey, () =>
  //     navigate(Constants.routes.Auth),
  //   );
}

function* updateProfileSaga({ payload }) {
  const { uuid, name, phone, units } = payload;
  yield put(putLoadingStatus(true));

  try {
    if (!units.includes('NONE')) {
      yield all(
        units.map(function* (unit) {
          yield call(rsf.database.patch, `units/${unit}/users/${uuid}`, {
            name,
            phone,
          });
        })
      );
    }

    yield call(rsf.database.patch, `users/${uuid}`, {
      name,
      phone,
    });

    yield put(putUserName(name));
    yield put(putUserPhone(phone));

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));

    alert(`Error updating user details! ${error}`);
  }
}

export default function* User() {
  yield all([
    takeLatest(actions.LOGIN.REQUEST, loginSaga),
    takeLatest(actions.SIGNOUT.REQUEST, signOutSaga),
    takeEvery(actions.SYNC_USER, syncUserSaga),
    takeLatest(actions.UPDATE.USER_PROFILE, updateProfileSaga),
    //   takeEvery(actions.PROFILE.UPDATE, updateProfileSaga),
  ]);
}
