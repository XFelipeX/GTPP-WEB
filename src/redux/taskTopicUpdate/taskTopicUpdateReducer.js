import { UPDATE_TOPIC } from './taskTopicUpdateTypes';

const initialState = false;



const updateTopic = (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case UPDATE_TOPIC:
      return !state 
    default:
      return state
  }
}

export default updateTopic;