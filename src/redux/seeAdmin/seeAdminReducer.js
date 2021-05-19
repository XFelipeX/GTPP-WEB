import { SEEADMIN } from './seeAdminTypes';

const initialState = false;

const seeAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEEADMIN:
      return !state;
    default:
      return state;
  }
};

export default seeAdminReducer;
