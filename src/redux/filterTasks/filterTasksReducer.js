import { GET_TASK_FILTER } from './filterTasksTypes';
import { SET_DO_VISIBLE } from './filterTasksTypes';
import { SET_DOING_VISIBLE } from './filterTasksTypes';
import { SET_ANALYZE_VISIBLE } from './filterTasksTypes';
import { SET_STOPPED_VISIBLE } from './filterTasksTypes';
import { SET_BLOCKED_VISIBLE } from './filterTasksTypes';
import { SET_DONE_VISIBLE } from './filterTasksTypes';
import { SET_CANCELED_VISIBLE } from './filterTasksTypes';

const initialState = {
  do: true,
  doing: true,
  analyze: true,
  stopped: true,
  blocked: true,
  done: false,
  canceled: false,

  filter: [],
};
const filterTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASK_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case SET_DO_VISIBLE:
      return {
        ...state,
        do: action.payload,
      };
    case SET_DOING_VISIBLE:
      return {
        ...state,
        doing: action.payload,
      };
    case SET_ANALYZE_VISIBLE:
      return {
        ...state,
        analyze: action.payload,
      };
    case SET_STOPPED_VISIBLE:
      return {
        ...state,
        stopped: action.payload,
      };
    case SET_BLOCKED_VISIBLE:
      return {
        ...state,
        blocked: action.payload,
      };
    case SET_DONE_VISIBLE:
      return {
        ...state,
        done: action.payload,
      };
    case SET_CANCELED_VISIBLE:
      return {
        ...state,
        canceled: action.payload,
      };
    default:
      return state;
  }
};

export default filterTasksReducer;
