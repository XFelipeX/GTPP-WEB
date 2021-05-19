import { TASKVISIBLE } from './taskVisibleTypes';
import { TASKINFO } from './taskVisibleTypes';
import { UPDATETASKVISIBLE } from './taskVisibleTypes';
import { SENDINFOMODAL } from './taskVisibleTypes';
import { TASKOWNER } from './taskVisibleTypes';

const initialState = [];

const taskVisibleReducer = (state = initialState, action) => {
  switch (action.type) {
    case TASKVISIBLE:
      return !state;
    case TASKINFO:
      return {
        ...state,
        task: action.task,
      };
    case TASKOWNER:
      return {
        ...state,
        owner: action.owner,
      };
    case SENDINFOMODAL:
      return {
        ...state,
        info: action.info,
      };
    case UPDATETASKVISIBLE:
      return {
        ...state,
        progress: action.progress,
      };
    default:
      return state;
  }
};

export default taskVisibleReducer;
