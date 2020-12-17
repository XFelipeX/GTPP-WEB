import { TASKVISIBLE } from './taskVisibleTypes';
import {TASKINFO} from './taskVisibleTypes';
import {UPDATETASKVISIBLE} from './taskVisibleTypes';
import {SENDINFOMODAL} from './taskVisibleTypes';

let info;

const initialState = [
  {info:{percent:"",description:"",initial_date:"",final_date:"",task_id:1,user_id:"",state_id:""}},
  {task:{csds:[{}],full_description:"",task_item:"",task_user:[]}}
];



const taskVisibleReducer = (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case TASKVISIBLE:
      return !state 
    case TASKINFO:
      return {
        ...state,
        // info:action.info,
        task:action.task
      }
      case SENDINFOMODAL:
        return {
          ...state,
          info:action.info,
          // task:action.task
        }
    case UPDATETASKVISIBLE:
        return {
          ...state,
          progress: action.progress
        }
    default:
      return state
  }
}

export default taskVisibleReducer;

// id:action.info.id,
          // description:action.info.description, 
          // full_description:action.info.full_description,
          // initial_date:action.info.initial_date,
          // final_date:action.info.final_date,
          // state_id:action.info.state_id,
          // priority:action.info.priority,
          // user_id:action.info.user_name,
          // comshopdepsub_id:action.info.comshopdepsub_id,
          // state_description:action.info.state_description,
          // progress:action.info.progress,
          // expire:action.info.expire 