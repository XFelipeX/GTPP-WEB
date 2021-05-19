import { GET_TASK_FILTER } from "./filterTasksTypes";
import { SET_DO_VISIBLE } from "./filterTasksTypes";
import { SET_DOING_VISIBLE } from "./filterTasksTypes";
import { SET_ANALYZE_VISIBLE } from "./filterTasksTypes";
import { SET_STOPPED_VISIBLE } from "./filterTasksTypes";
import { SET_BLOCKED_VISIBLE } from "./filterTasksTypes";
import { SET_DONE_VISIBLE } from "./filterTasksTypes";
import { SET_CANCELED_VISIBLE } from "./filterTasksTypes";

export const getTaskFilter = (info) => {
  return {
    type: GET_TASK_FILTER,
    payload: info,
  };
};

export const setDoVisi = (value) => {
  return {
    type: SET_DO_VISIBLE,
    payload:value
  }
}
export const setDoingVisi = (value) => {
  return {
    type: SET_DOING_VISIBLE,
    payload:value
  }
}
export const setAnalyzeVisi = (value) => {
  return {
    type: SET_ANALYZE_VISIBLE,
    payload:value
  }
}
export const setStoppedVisi = (value) => {
  return {
    type: SET_STOPPED_VISIBLE,
    payload:value
  }
}
export const setBlockedVisi = (value) => {
  return {
    type: SET_BLOCKED_VISIBLE,
    payload:value
  }
}
export const setDoneVisi = (value) => {
  return {
    type: SET_DONE_VISIBLE,
    payload:value
  }
}
export const setCanceledVisi = (value) => {
  return {
    type: SET_CANCELED_VISIBLE,
    payload:value
  }
}