import {GET_TASK} from './taskTypes';

export const getTask = info => {
  return{
    type: GET_TASK,
    payload: info
  }
}