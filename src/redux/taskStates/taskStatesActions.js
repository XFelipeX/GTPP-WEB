import {GET_STATES} from './taskStatesTypes';

export const getStates = info => {
  return{
    type: GET_STATES,
    payload: info
  }
}