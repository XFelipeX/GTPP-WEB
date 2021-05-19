import { UPDATETASK } from './stateUpdateTypes';

const initialState = false;

const stateUpdateReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATETASK:
      return !state;
    default:
      return state;
  }
};

export default stateUpdateReducer;
