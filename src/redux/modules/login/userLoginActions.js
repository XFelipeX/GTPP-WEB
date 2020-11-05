export function loginRequest(info){
    return {
      type: 'LOGIN_REQUEST',
      payload: info
    }
  }
  export function loginSuccess(info){
    return {
      type: 'LOGIN_SUCCESS',
      payload: info
    }
  }
  
  export function logoffRequest(){
    return {
      type: 'LOGOFF_REQUEST'
    }
  }
