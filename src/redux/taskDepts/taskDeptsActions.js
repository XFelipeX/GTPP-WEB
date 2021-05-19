import {GET_DEPTS} from './taskDeptsTypes';

export const getDepts = (info) => {
  return{
    type: GET_DEPTS,
    info: info
  }
}