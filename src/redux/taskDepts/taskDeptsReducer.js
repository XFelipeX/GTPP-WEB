import {GET_DEPTS} from './taskDeptsTypes';

const initialState = [{
  id:'',

}]

const taskDeptsReducer = (state = initialState, action) => {
    // console.log(action.info)
  switch (action.type) {
    case GET_DEPTS:
      return action.info
    default:
      return state
  }
}

export default taskDeptsReducer;