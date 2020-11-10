import { SETPHOTOS } from './userPhotosTypes'

const initialState = {

}

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETPHOTOS:
      return action.payload
    default:
      return state
  }
}

export default userAuthReducer;