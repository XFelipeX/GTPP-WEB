import { TASKVISIBLE } from './taskVisibleTypes';
import {TASKINFO} from './taskVisibleTypes'

const initialState = false;



const taskVisibleReducer = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case TASKVISIBLE:
      return !state 
    case TASKINFO:
      return{
          ...state,
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
    default:
      return state
  }
}

export default taskVisibleReducer;