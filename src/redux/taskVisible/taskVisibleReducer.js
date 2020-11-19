import { TASKVISIBLE } from './taskVisibleTypes';
import {TASKINFO} from './taskVisibleTypes';
import {TASKPROGRESS} from './taskVisibleTypes';

const initialState = false;



const taskVisibleReducer = (state = initialState, action) => {
  console.log(action.info);
  switch (action.type) {
    case TASKVISIBLE:
      return !state 
    case TASKINFO:
      return{
          id:action.info.id,
          description:action.info.description, 
          full_description:action.info.full_description,
          initial_date:action.info.initial_date,
          final_date:action.info.final_date,
          state_id:action.info.state_id,
          priority:action.info.priority,
          user_id:action.info.user_name,
          comshopdepsub_id:action.info.comshopdepsub_id,
          state_description:action.info.state_description,
          progress:action.info.progress,
          expire:action.info.expire 
      }  
    case TASKPROGRESS:
      return {
        ...state,
        progress: action.progress
      }
    default:
      return state
  }
}

export default taskVisibleReducer;