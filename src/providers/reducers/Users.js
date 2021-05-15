import { actions } from '../actions/Users';

const initialState = {
  allUsers: [],
  unitUsers: [],
  units: [],
  patientLocation: null,
  isLoading: false,
};

export default function usersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.ALL_USERS:
      return {
        ...state,
        allUsers: action.users,
      };

    case actions.PUT.PATIENT_LOCATION:
      return {
        ...state,
        patientLocation: action.payload,
      };

    case actions.PUT.UNIT_USERS:
      return {
        ...state,
        allUsers: action.users,
      };

    case actions.PUT.UNITS:
      return {
        ...state,
        units: action.payload,
      };

    case actions.PUT.LOADING_STATUS:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}
