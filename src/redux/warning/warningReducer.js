import { GET_WARNING } from "./warningTypes";
import { REMOVE_ITEM } from "./warningTypes";

const initialState = {
  warning: [],
};

const warningReducer = (state = initialState, action) => {
  // console.log(state);
  switch (action.type) {
    case GET_WARNING:
      const task = action.payload;

      const search = state.warning.filter(warning => warning.task_id !== task.task_id);

      if(search){
        state.warning = [...search];
      }

      return {
        ...state,
        warning: [...state.warning, action.payload],
      };
    case REMOVE_ITEM:
      return {
        ...state,
        warning: [...state.warning.filter(warning => warning.task_id!== action.payload.task_id)]
      };

    default:
      return state;
  }
};

export default warningReducer;
