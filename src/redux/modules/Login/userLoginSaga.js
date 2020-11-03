import {select,all, call, put, takeLatest} from 'redux-saga/effects'


export const UserLogin = (info) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: info
  }
}


export default all([
    takeLatest('LOGIN_REQUEST', UserLogin),
    //  takeLatest('LOGOFF_REQUEST', UserLogoff),
])