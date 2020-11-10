import {GET_DEPTS} from './taskDeptsTypes';

const initialState = [{
  id:'',

}]

const taskDeptsReducer = (state = initialState, action) => {
    // console.log(action.payload)
  switch (action.type) {
    case GET_DEPTS:
      return action.payload
    default:
      return state
  }
}

export default taskDeptsReducer;