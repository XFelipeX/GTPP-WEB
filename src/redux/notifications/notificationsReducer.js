import { GET_NOTIFICATIONS } from "./notificationsTypes";

const initialState = [];

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS: 
        return action.payload;
    default:
        return state;
}
};

export default notificationsReducer;
