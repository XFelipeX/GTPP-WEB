import {GET_TASK_CSDS} from './taskCsdsTypes';

export const getTaskCsds = (taskCsds) => {
    return {
        type:GET_TASK_CSDS,
        taskCsds:taskCsds
    }
}