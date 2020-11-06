import {select,all, call, put, takeLatest} from 'redux-saga/effects'


export const UserLogin = (info) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: info
  }
}

export const UserLogoff = () => {
  return (
    <div>
      {alert("vc esta saindo")}
    </div>
  )
}



export default all([
    takeLatest('LOGIN_REQUEST', UserLogin),
     takeLatest('LOGOFF_REQUEST', UserLogoff),
])