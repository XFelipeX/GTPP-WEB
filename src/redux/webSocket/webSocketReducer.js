import { WEB_SOCKET_STATE } from './webSocketTypes';
import { WEB_SOCKET_MESSAGE } from './webSocketTypes';
import { GET_WEB_SOCKET } from './webSocketTypes';
import { GET_WEB_SOCKET_HISTORIC } from './webSocketTypes';
import { GET_USERS_ONLINE } from './webSocketTypes';
import { REMOVE_USERS_ONLINE } from './webSocketTypes';
import { ADD_USERS_ONLINE } from './webSocketTypes';
import { REMOVE_USERS_LIST } from './webSocketTypes';
const initialState = {
  historic: [],
  users: [],
};

const webSocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEB_SOCKET_STATE:
      return {
        ...state,
        websocketState: action.payload,
      };
    case WEB_SOCKET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case GET_WEB_SOCKET:
      return {
        ...state,
        websocket: action.payload,
      };
    case GET_WEB_SOCKET_HISTORIC:
      return {
        ...state,
        historic: action.payload,
      };
    case GET_USERS_ONLINE:
      return {
        ...state,
        users: action.payload,
      };
    case ADD_USERS_ONLINE:
      return {
        ...state,
        users: state.users.concat(action.payload),
      };
    case REMOVE_USERS_ONLINE:
      return {
        ...state,
        users: state.users.filter((item) => item != action.payload),
      };
    case REMOVE_USERS_LIST:
      return {
        ...state,
        usersRemove: [state.usersRemove, action.payload],
      };
    default:
      return state;
  }
};

export default webSocketReducer;
