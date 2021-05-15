export const actions = {
  LOGIN: {
    REQUEST: 'LOGIN_REQUEST',
  },
  SIGNOUT: {
    REQUEST: 'LOGOUT_REQUEST',
  },
  SYNC_USER: 'SYNC_USER',
  PUT: {
    USER: 'PUT_USER',
    USER_NAME: 'USER_NAME',
    USER_PHONE: 'USER_PHONE',
    USER_PROFILE: 'PUT_USER_PROFILE',
    UUID: 'PUT_UUID',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  UPDATE: {
    USER_PROFILE: 'UPDATE_USER_PROFILE',
  },
  RESET_USER: 'RESET_USER',
};

export const syncUser = () => ({
  type: actions.SYNC_USER,
});

export const login = (email, password) => ({
  type: actions.LOGIN.REQUEST,
  payload: { email, password },
});

export const signOut = () => ({
  type: actions.SIGNOUT.REQUEST,
});

export const resetUser = () => ({
  type: actions.RESET_USER,
});

export const putUserProfile = (profile) => ({
  type: actions.PUT.USER_PROFILE,
  profile,
});

export const updateUserProfile = (uuid, name, phone, units) => ({
  type: actions.UPDATE.USER_PROFILE,
  payload: { uuid, name, phone, units },
});

export const putUser = (user) => ({
  type: actions.PUT.USER,
  user,
});

export const putUserName = (name) => ({
  type: actions.PUT.USER_NAME,
  payload: name,
});

export const putUserPhone = (phone) => ({
  type: actions.PUT.USER_PHONE,
  payload: phone,
});

export const putUserUuid = (uuid) => ({
  type: actions.PUT.UUID,
  payload: uuid,
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
