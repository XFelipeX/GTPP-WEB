import { GET_TASK_USER_PHOTOS } from './taskUsersPhotosTypes';

const initialState = [];

const taskUsersPhotosReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASK_USER_PHOTOS:
      return action.info;
    default:
      return state;
  }
};

export default taskUsersPhotosReducer;
