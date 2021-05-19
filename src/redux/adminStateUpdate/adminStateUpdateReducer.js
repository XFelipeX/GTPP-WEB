import { UPTATESTATEADMIN } from './adminStateUpdateTypes';

const initialState = true;

const adminStateUpdateReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPTATESTATEADMIN:
      return !state;
    default:
      return state;
  }
};

export default adminStateUpdateReducer;
