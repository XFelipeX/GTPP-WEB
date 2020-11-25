import { SETPHOTOS } from './userPhotosTypes'

const initialState = [
]

const userAuthReducer = (state = initialState, action) => {
  console.log(state)
  switch (action.type) {
    case SETPHOTOS:
      return {
       items:[action.payload]
      }
    default:
      return state
  }
}

export default userAuthReducer;