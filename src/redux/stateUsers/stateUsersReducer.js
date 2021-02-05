import { UPDATEUSERS } from './stateUsersTypes';

const initialState = false;



const stateUsersReducer = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case UPDATEUSERS:
      return !state 
    default:
      return state
  }
}

export default stateUsersReducer;