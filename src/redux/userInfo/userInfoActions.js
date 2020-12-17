import { GET_USER_INFO } from "./userInfoTypes";

export const getUserInfo = (info) => {
  return {
    type: GET_USER_INFO,
    info: info,
  };
};
