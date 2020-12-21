import {GET_VINCULATED_USERS} from './vinculatedUsersTypes';
import {GET_USER_PHOTOS} from './vinculatedUsersTypes';

const initialState = [
  {}
]

const vinculatedUsersReducer = (state = initialState, action) => {
    // console.log(action.info);
  switch (action.type) {
    case GET_VINCULATED_USERS:
      return action.info
    case GET_USER_PHOTOS:
      return action.photo
      
    default:
      return state
  }
}

export default vinculatedUsersReducer;