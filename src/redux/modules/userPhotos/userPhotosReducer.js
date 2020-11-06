const initialState = {

}

const userPhotosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETPHOTOS':
      return action.payload
    default:
      return state
  }
}

export default userPhotosReducer;