import { GET_TASK_FILTER } from "./filterTasksTypes";

export const getTaskFilter = (info) => {
  return {
    type: GET_TASK_FILTER,
    payload: info,
  };
};
