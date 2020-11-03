export function loginRequest(info){
    return {
      type: 'LOGIN_REQUEST',
      payload: info
    }
  }
  export function loginSuccess(info){
    return {
      type: 'LOGIN_REQUEST',
      payload: info
    }
  }
  
  export function logOffRequest(){
    return {
      type: 'LOGOFF_REQUEST'
    }
  }
  export function logOffSuccess(){
    return {
      type: 'LOGOFF_REQUEST'
    }
  }