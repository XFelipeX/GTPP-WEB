import {GET_TASK_USER_PHOTOS} from './taskUsersPhotosTypes';

const initialState = [

]

const taskUsersPhotosReducer = (state = initialState, action) => {
    // console.log(action.info);
  switch (action.type) {
    case GET_TASK_USER_PHOTOS:
      return action.info
    default:
      return state
  }
}

export default taskUsersPhotosReducer;