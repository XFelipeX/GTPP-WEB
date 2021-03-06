import { LOGIN, LOGOFF } from './userAuthTypes'

const initialState = {
  id: 0,
  session: '',
  administrator: 0,
  user:''
}

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        id: action.payload.id,
        session: action.payload.session,
        administrator: action.payload.administrator,
        user:action.payload.user,
        token:action.payload.token
      }
    case LOGOFF:
      state = undefined
      return {
        id: 0,
        session: '',
        administrator: 0,
        user:'',
        token:null
      }
    default:
      return state
  }
}

export default userAuthReducer;