import { UPTATESTATEADMIN } from './adminStateUpdateTypes';

const initialState = false;



const adminStateUpdateReducer = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case UPTATESTATEADMIN:
      return !state 
    default:
      return state
  }
}

export default adminStateUpdateReducer;