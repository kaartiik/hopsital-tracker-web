export const actions = {
  CREATE: {
    USER: 'CREATE_USER',
  },
  LOGOUT: {
    REQUEST: 'LOGOUT_REQUEST',
  },
  GET: {
    ALL_USERS: 'GET_ALL_USERS',
    PATIENT_LOCATION: 'GET_PATIENT_LOCATION',
    UNIT_USERS: 'GET_UNIT_USERS',
    USERS_FOR_COMMITTEE: 'USERS_FOR_COMMITTEE',
    UNITS: 'GET_UNITS',
  },
  UPDATE: {
    ADD_UNITS: 'UPDATE_ADD_UNITS',
    REMOVE_UNITS: 'UPDATE_REMOVE_UNITS',
  },
  PUT: {
    LOADING_STATUS: 'PUT_LOADING_STATUS',
    PATIENT_LOCATION: 'PUT_PATIENT_LOCATION',
    ALL_USERS: 'PUT_ALL_USERS',
    UNIT_USERS: 'PUT_UNIT_USERS',
    UNITS: 'PUT_UNITS',
  },
  DELETE: {
    USER: 'DELETE_USER',
  },
};

export const createUser = (fullName, email, password, phone, units, roles) => ({
  type: actions.CREATE.USER,
  payload: { fullName, email, password, phone, units, roles },
});

export const deleteUser = (email, password, uuid, userUnits, userRoles) => ({
  type: actions.DELETE.USER,
  payload: { email, password, uuid, userUnits, userRoles },
});

export const logout = () => ({
  type: actions.LOGOUT.REQUEST,
});

export const getAllUsers = () => ({
  type: actions.GET.ALL_USERS,
});

export const putAllUsers = (users) => ({
  type: actions.PUT.ALL_USERS,
  users,
});

export const getPatientLocation = (patientUuid) => ({
  type: actions.GET.PATIENT_LOCATION,
  payload: patientUuid,
});

export const putPatientLocation = (location) => ({
  type: actions.PUT.PATIENT_LOCATION,
  payload: location,
});

export const getUnitUsers = () => ({
  type: actions.GET.UNIT_USERS,
});

export const getUsersForCommittee = () => ({
  type: actions.GET.USERS_FOR_COMMITTEE,
});

export const putUnitUsers = (users) => ({
  type: actions.PUT.UNIT_USERS,
  users,
});

export const addUserUnits = (uuid, fullName, email, phone, units, roles) => ({
  type: actions.UPDATE.ADD_UNITS,
  payload: { uuid, fullName, email, phone, units, roles },
});

export const removeUserUnits = (uuid, userUnit, userRoles) => ({
  type: actions.UPDATE.REMOVE_UNITS,
  payload: { uuid, userUnit, userRoles },
});

export const getUnits = () => ({
  type: actions.GET.UNITS,
});

export const putUnits = (units) => ({
  type: actions.PUT.UNITS,
  payload: units,
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
