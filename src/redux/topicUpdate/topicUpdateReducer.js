import { UPDATETOPIC } from './topicUpdateTypes';

const initialState = false;

const modalUpdateReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATETOPIC:
      return !state;
    default:
      return state;
  }
};

export default modalUpdateReducer;
