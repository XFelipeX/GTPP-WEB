import { GET_USER_INFO } from './userInfoTypes';

const initialState = [{}];

const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return action.info;
    default:
      return state;
  }
};

export default userInfoReducer;
