import { GET_WARNING } from "./warningTypes";

const initialState = {
    warning:[]
};

const warningReducer = (state = initialState, action) => {
//   console.log(state);
  switch (action.type) {
    case GET_WARNING:
      return {
          ...state,
          warning:state.warning.concat(action.payload)
      };

    default:
      return state;
  }
};

export default warningReducer;
