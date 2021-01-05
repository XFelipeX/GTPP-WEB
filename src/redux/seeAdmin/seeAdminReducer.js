import { SEEADMIN } from './seeAdminTypes';

const initialState = false;



const seeAdminReducer = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case SEEADMIN:
      return !state 
    default:
      return state
  }
}

export default seeAdminReducer;