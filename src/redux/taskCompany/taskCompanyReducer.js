import { GET_COMPANY } from './taskCompanyTypes';

const initialState = [
  {
    id: '',
    description: '',
  },
];

const taskCompanyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPANY:
      return action.payload;
    default:
      return state;
  }
};

export default taskCompanyReducer;
