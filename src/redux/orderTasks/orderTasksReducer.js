import { ORDERTASKS } from './orderTasksTypes';

const initialState = false;

const orderTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDERTASKS:
      return !state;
    default:
      return state;
  }
};

export default orderTasksReducer;
