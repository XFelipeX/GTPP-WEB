import { LOGIN, LOGOFF } from './userAuthTypes'

const initialState = {
  id: 0,
  session: '',
  administrator: 0
}

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        id: action.payload.id,
        session: action.payload.session,
        administrator: action.payload.administrator
      }
    case LOGOFF:
      return {
        id: 0,
        session: '',
        administrator: 0
      }
    default:
      return state
  }
}

export default userAuthReducer;