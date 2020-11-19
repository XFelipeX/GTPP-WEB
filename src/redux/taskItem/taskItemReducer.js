import { SET_ITEM_CHECK } from "./taskItemTypes";

const initialState = [{}];

const taskItemReducer = (state = initialState, action) => {
  // console.log(action)
  switch (action.type) {
    case SET_ITEM_CHECK:
      return action.payload;

    default:
      return state;
  }
};

export default taskItemReducer;
