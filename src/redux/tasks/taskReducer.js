import { GET_TASK } from './taskTypes';

const initialState = [{}];

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASK:
      return action.payload;
    default:
      return state;
  }
};

export default taskReducer;
