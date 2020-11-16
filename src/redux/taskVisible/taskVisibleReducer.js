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
          description:action.description  
      }  
    default:
      return state
  }
}

export default taskVisibleReducer;