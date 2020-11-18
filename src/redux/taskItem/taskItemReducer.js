import { SET_ITEM_CHECK } from "./taskItemTypes";

const initialState = {
  check: false,
};

const taskItemReducer = (state = initialState, action) => {
  // console.log(action)
  switch (action.type) {
    case SET_ITEM_CHECK:
      return {
        ...state,
        check: action.payload,
      };

    default:
      return state;
  }
};

export default taskItemReducer;
