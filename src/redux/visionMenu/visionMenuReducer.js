import { SET_ORDER, SET_COL, SET_DATE_VISIBLE, SET_PRIORITY_VISIBLE, SET_STATE_VISIBLE, SET_VINC_VISIBLE, SET_COMPANY_VISIBLE } from './visionMenuTypes'

const initialState = {
  col: 'priority',
  order: 'desc',
  company: '',
  shop: '',
  priority: true,
  state: true,
  date: true,
  vinc: true
}

const visionMenuReducer = (state = initialState, action) => {
  // console.log(action)
  switch (action.type) {
    case SET_ORDER:
      return {
        ...state,
        order: action.payload
      }

    case SET_COL:
      return {
        ...state,
        col: action.payload
      }
    case SET_DATE_VISIBLE:
      return {
        ...state,
        date: action.payload
      }
    case SET_PRIORITY_VISIBLE:
      return{
        ...state,
        priority: action.payload
      }
    case SET_STATE_VISIBLE:
      return{
        ...state,
        state: action.payload
      }
    case SET_VINC_VISIBLE:
      return{
        ...state,
        vinc: action.payload
      }
    case SET_COMPANY_VISIBLE:
        return {
          ...state,
          company: action.payload
        }
        
    default:
      return state
  }
}

export default visionMenuReducer;