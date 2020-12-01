import { UPDATEMODAL } from './modalUpdateTypes';

const initialState = false;



const modalUpdateReducer = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case UPDATEMODAL:
      return !state 
    default:
      return state
  }
}

export default modalUpdateReducer;