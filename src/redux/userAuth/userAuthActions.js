import { LOGIN, LOGOFF } from './userAuthTypes';

export const logIn = (info) => {
  return {
    type: LOGIN,
    payload: info
  }
}

export const logOff = () => {
  return {
    type: LOGOFF
  }
}