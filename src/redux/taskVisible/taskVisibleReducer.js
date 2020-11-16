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
          id:action.id,
          description:action.description, 
          full_description:action.full_description,
          initial_date:action.initial_date,
          final_date:action.final_date,
          state_id:action.state_id,
          priority:action.priority,
          user_id:action.user_name,
          comshopdepsub_id:action.comshopdepsub_id,
          state_description:action.state_description,
          progress:action.progress,
          expire:action.expire 
      }  
    default:
      return state
  }
}

export default taskVisibleReducer;