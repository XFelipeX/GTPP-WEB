import { WEB_SOCKET_STATE } from "./webSocketTypes";
import { WEB_SOCKET_MESSAGE } from "./webSocketTypes";
import { GET_WEB_SOCKET } from "./webSocketTypes";
import { GET_WEB_SOCKET_HISTORIC } from "./webSocketTypes";
import {GET_USERS_ONLINE} from './webSocketTypes';
import {REMOVE_USERS_ONLINE} from './webSocketTypes';
import {ADD_USERS_ONLINE} from './webSocketTypes';
import {REMOVE_USERS_LIST} from './webSocketTypes';

export const getWebSocketState = (info) => {
  return {
    type: WEB_SOCKET_STATE,
    payload: info,
  };
};

export const getWebSocketMessage = (info) => {
  return {
    type: WEB_SOCKET_MESSAGE,
    payload: info,
  };
};

export const getWebSocket = (info) => {
  return {
    type: GET_WEB_SOCKET,
    payload: info,
  };
};

export const getWebSocketHistoric = (info) => {
  return {
    type: GET_WEB_SOCKET_HISTORIC,
    payload: info,
  };
};

export const getUsersOnline = (info) => {
  return {
    type: GET_USERS_ONLINE,
    payload: info,
  };
};

export const addUsersOnline = (info) => {
  return {
    type: ADD_USERS_ONLINE,
    payload: info,
  };
};

export const removeUsersOnline = (info) => {
  return {
    type: REMOVE_USERS_ONLINE,
    payload: info,
  };
};

export const removeUsersList = (info) => {
  return {
    type: REMOVE_USERS_LIST,
    payload: info,
  };
};



