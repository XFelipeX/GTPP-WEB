import {GET_VINCULATED_USERS} from './vinculatedUsersTypes';

const initialState = [{}]

const vinculatedUsersReducer = (state = initialState, action) => {
    // console.log(action.info);
  switch (action.type) {
    case GET_VINCULATED_USERS:
      return action.info
    default:
      return state
  }
}

export default vinculatedUsersReducer;