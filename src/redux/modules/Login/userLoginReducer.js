
const initialState = {
  id: 0,
  session: '',
  administrator: 0
}

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        id: action.payload.id,
        session: action.payload.session,
        administrator: action.payload.administrator
      }
    default:
      return state
  }
}

export default userAuthReducer;