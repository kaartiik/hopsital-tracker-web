/* eslint-disable no-console */
import {
  call,
  put,
  takeEvery,
  take,
  takeLatest,
  all,
  fork,
  select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Base64 } from 'js-base64';
import rsf, { rsf2, database } from '../firebaseConfig';
import {
  actions,
  putLoadingStatus,
  putAllUsers,
  putUnits,
  putPatientLocation,
} from '../actions/Users';

// const getUuidFromState = (state) => state.userReducer.uuid;
// const getUserRoleFromState = (state) => state.userReducer.roles;
const getUserUnitsFromState = (state) => state.userReducer.unitsArr;

function* getAllUsersSaga() {
  yield put(putLoadingStatus(true));

  try {
    const userObj = yield call(rsf.database.read, 'users');

    if (userObj !== null) {
      const usersArr = Object.values(userObj);
      yield put(putAllUsers(usersArr));
    } else {
      yield put(putAllUsers([]));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(error);
  }
}

function* deleteUserChats({ uuid }) {
  try {
    const userChats = yield call(rsf.database.read, `chats/${uuid}`);
    if (userChats !== null) {
      const recipientUidsArr = Object.keys(userChats);
      yield call(rsf.database.delete, `chats/${uuid}`);

      yield all(
        recipientUidsArr.map(function* (recipientUid) {
          yield call(rsf.database.delete, `chats/${recipientUid}/${uuid}`);
        })
      );
    }
  } catch (error) {
    alert(`Error deleting user chats! ${error}`);
  }
}

function* deleteUserUnitData({ uuid, userUnits, userRoles }) {
  const userUnitsArr = Object.keys(userUnits);
  try {
    yield all(
      userUnitsArr.map(function* (userUnit) {
        yield call(rsf.database.delete, `units/${userUnit}/users/${uuid}`);

        if (Object.prototype.hasOwnProperty.call(userRoles, 'owner')) {
          yield call(rsf.database.update, `units/${userUnit}/is_owned`, false);
        }
      })
    );
  } catch (error) {
    alert(`Error deleting user unit data! ${error}`);
  }
}

function* deleteUserSaga({ payload }) {
  const { email, password, uuid, userUnits, userRoles } = payload;
  yield put(putLoadingStatus(true));

  const decodedPw = Base64.decode(password);

  try {
    yield call(rsf2.auth.signInWithEmailAndPassword, email, decodedPw);
    yield call(rsf2.auth.deleteProfile);
    yield call(deleteUserChats, { uuid, userUnits, userRoles });
    yield call(deleteUserUnitData, { uuid, userUnits, userRoles });
    yield call(rsf.database.delete, `users/${uuid}`);

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(true));
    alert(`Error deleting user! ${error}`);
  }
}

function* removeUnitsFromUserSaga({ payload }) {
  const { uuid, userUnit, userRoles } = payload;
  const userUnits = { [`${userUnit}`]: userUnit };
  try {
    yield call(rsf.database.delete, `users/${uuid}/units/${userUnit}`);
    yield call(deleteUserUnitData, { uuid, userUnits, userRoles });
  } catch (error) {
    alert(`Error removing unit from user! ${error}`);
  }
}

function* addUserToDB({
  uuid,
  fullName,
  email,
  password,
  phone,
  units,
  roles,
}) {
  const encrypt = Base64.encode(password);
  const userObj = {
    avatar: 'noDP',
    email,
    key: encrypt,
    name: fullName,
    online_status: '',
    phone,
    typing_to: 'noOne',
    uuid,
    units,
    roles,
  };

  yield call(rsf.database.update, `users/${uuid}`, userObj);
}

function* addCommitteeMemberToDB({
  uuid,
  fullName,
  email,
  phone,
  units,
  roles,
}) {
  const userObj = {
    email,
    name: fullName,
    phone,
    uuid,
    units,
    roles,
  };

  yield call(rsf.database.update, `committee_members/${uuid}`, userObj);
}

function* addUnitWithUser({ uuid, fullName, email, phone, units, roles }) {
  const unitsArr = Object.keys(units);

  yield all(
    unitsArr.map(function* (unit) {
      const unitObj = {
        email,
        name: fullName,
        phone,
        uuid,
        units: { [`${unit}`]: unit },
        roles,
      };

      yield call(rsf.database.update, `units/${unit}/users/${uuid}`, unitObj);

      if (Object.prototype.hasOwnProperty.call(roles, 'owner')) {
        yield call(rsf.database.update, `units/${unit}/is_owned`, true);
      }
    })
  );
}

function* addUnitsToUserSaga({ payload }) {
  const { uuid, fullName, email, phone, units, roles } = payload;
  yield put(putLoadingStatus(true));
  try {
    yield call(rsf.database.patch, `users/${uuid}/units`, units);
    yield call(addUnitWithUser, { uuid, fullName, email, phone, units, roles });
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error adding unit(s) to user! ${error}`);
  }
}

function* addExistingUser({ fullName, email, phone, units }) {
  const existingUser = yield call(
    rsf.database.read,
    database.ref('users').orderByChild('email').equalTo(email)
  );

  const uuid = Object.keys(existingUser)[0];

  const { roles } = existingUser[uuid];

  const existingUnits = existingUser[uuid].units;

  const newUnits = { ...existingUnits, ...units };

  yield call(rsf.database.update, `users/${uuid}/units`, newUnits);

  yield call(addUnitWithUser, {
    uuid,
    fullName,
    email,
    phone,
    units,
    roles,
  });
}

function* createUserSaga({ payload }) {
  const { fullName, email, password, phone, units, roles } = payload;
  yield put(putLoadingStatus(true));

  try {
    const createdUser = yield call(
      rsf2.auth.createUserWithEmailAndPassword,
      email,
      password
    );

    const uuid = createdUser.user.uid;

    yield call(addUserToDB, {
      uuid,
      fullName,
      email,
      password,
      phone,
      units,
      roles,
    });

    if (!Object.prototype.hasOwnProperty.call(units, 'none')) {
      yield call(addUnitWithUser, {
        uuid,
        fullName,
        email,
        phone,
        units,
        roles,
      });
    }

    if (Object.prototype.hasOwnProperty.call(roles, 'committee_member')) {
      yield call(addCommitteeMemberToDB, {
        uuid,
        fullName,
        email,
        phone,
        units,
        roles,
      });
    }

    yield call(rsf2.auth.signOut);

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    if (
      error.code === 'auth/email-already-in-use' &&
      !Object.prototype.hasOwnProperty.call(units, 'none')
    ) {
      try {
        alert('existing user do soemthing');
      } catch (alertCancelled) {
        return;
      }

      try {
        yield call(addExistingUser, { fullName, email, phone, units, roles });
      } catch (mergingError) {
        alert(`Error merging with existing user! ${mergingError}`);
      }
    } else {
      alert(`Error creating user! ${error}`);
    }
  }
}

function* getUnitUsersSaga() {
  // For Owners, Users & Tenants
  // const uuid = yield select(getUuidFromState);
  // const userRoles = yield select(getUserRoleFromState);
  const userUnits = yield select(getUserUnitsFromState);
  const allViewableUsers = [];
  yield put(putLoadingStatus(true));

  try {
    yield all(
      userUnits.map(function* (unit) {
        const unitUsers = yield call(rsf.database.read, `units/${unit}/users`);
        if (unitUsers !== null) {
          const usersArr = Object.values(unitUsers);
          allViewableUsers.push(...usersArr);
        }
      })
    );
    const adminsObj = yield call(rsf.database.read, `admins`);
    if (adminsObj !== null) {
      const adminsArr = Object.values(adminsObj);
      allViewableUsers.push(...adminsArr);
    }
    yield put(putAllUsers(allViewableUsers));
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving user(s)! ${error}`);
  }
}

function* getUsersForCommitteeSaga() {
  // For Committee Members

  const userUnits = yield select(getUserUnitsFromState);
  const allViewableUsers = [];
  yield put(putLoadingStatus(true));

  try {
    yield all(
      userUnits.map(function* (unit) {
        const unitUsers = yield call(rsf.database.read, `units/${unit}/users`);
        if (unitUsers !== null) {
          const usersArr = Object.values(unitUsers);
          allViewableUsers.push(...usersArr);
        }
      })
    );

    const adminsObj = yield call(rsf.database.read, `admins`);
    if (adminsObj !== null) {
      const adminsArr = Object.values(adminsObj);
      allViewableUsers.push(...adminsArr);
    }

    const committeeObj = yield call(rsf.database.read, `committee_members`);
    if (committeeObj !== null) {
      const committeeArr = Object.values(committeeObj);
      allViewableUsers.push(...committeeArr);
    }

    yield put(putAllUsers(allViewableUsers));
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving user(s)! ${error}`);
  }
}

function* getUnitsSaga() {
  try {
    const units = yield call(rsf.database.read, `units`);

    if (units !== null && units !== undefined) {
      const unitsArr = Object.keys(units);
      const formattedArr = unitsArr.map((unit) => {
        return {
          label: unit,
          value: unit,
        };
      });

      yield put(putUnits(formattedArr));
    }
  } catch (error) {
    alert(`Failed to retrieve units. ${error}`);
  }
}

function* startLocationListener({ payload }) {
  // #1
  const patientUuid = payload;
  const channel = new eventChannel((emiter) => {
    const listener = database
      .ref(`users/${patientUuid}/location`)
      .on('value', (snapshot) => {
        emiter({ data: snapshot.val() || {} });
      });

    // #2
    return () => {
      listener.off();
    };
  });

  // #3
  while (true) {
    const { data } = yield take(channel);
    // #4
    if (data !== null && data !== undefined) {
      yield put(putPatientLocation(data));
    } else {
      yield put(putPatientLocation(null));
    }
  }
}

export default function* Users() {
  yield all([
    takeEvery(actions.GET.PATIENT_LOCATION, startLocationListener),
    takeLatest(actions.GET.ALL_USERS, getAllUsersSaga),
    takeLatest(actions.GET.UNIT_USERS, getUnitUsersSaga),
    takeLatest(actions.GET.USERS_FOR_COMMITTEE, getUsersForCommitteeSaga),
    takeLatest(actions.CREATE.USER, createUserSaga),
    takeLatest(actions.DELETE.USER, deleteUserSaga),
    takeLatest(actions.UPDATE.ADD_UNITS, addUnitsToUserSaga),
    takeLatest(actions.UPDATE.REMOVE_UNITS, removeUnitsFromUserSaga),
    takeLatest(actions.GET.UNITS, getUnitsSaga),
    //   takeEvery(actions.PROFILE.UPDATE, updateProfileSaga),
  ]);
}
