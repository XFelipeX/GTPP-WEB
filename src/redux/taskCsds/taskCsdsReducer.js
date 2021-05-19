import { GET_TASK_CSDS } from './taskCsdsTypes';

const initialState = false;

const taskCsdsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASK_CSDS:
      return action.taskCsds;
    default:
      return state;
  }
};

export default taskCsdsReducer;
