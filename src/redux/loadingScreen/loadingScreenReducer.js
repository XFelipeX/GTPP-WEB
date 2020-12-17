import { GET_LOADING } from './loadingScreenTypes';

const initialState = false;



const loadingScreenReducer = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case GET_LOADING:
      return !state 
    default:
      return state
  }
}

export default loadingScreenReducer;