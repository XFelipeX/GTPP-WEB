import {UPDATE_TASK_VISIBLE} from './taskVisibleUpdateTypes';

const initialState = false;

const updateTaskVisible = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case UPDATE_TASK_VISIBLE:
      return !state 
    default:
      return state
  }
}

export default updateTaskVisible;