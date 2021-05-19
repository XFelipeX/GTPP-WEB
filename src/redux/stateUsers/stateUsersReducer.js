import { UPDATEUSERS } from './stateUsersTypes';

const initialState = false;

const stateUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATEUSERS:
      return !state;
    default:
      return state;
  }
};

export default stateUsersReducer;
