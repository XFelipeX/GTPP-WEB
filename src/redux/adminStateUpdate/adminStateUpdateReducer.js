import { UPTATESTATEADMIN } from './adminStateUpdateTypes';

const initialState = true;



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