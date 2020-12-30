import { GET_TASK_FILTER } from "./filterTasksTypes";

const initialState = [];

const filterTasksReducer = (state = initialState, action) => {
  // console.log(action)
  switch (action.type) {
    case GET_TASK_FILTER:
      return action.payload;
    default:
      return state;
  }
};

export default filterTasksReducer;
