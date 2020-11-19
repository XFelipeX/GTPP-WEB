import {TASKVISIBLE} from './taskVisibleTypes';
import {TASKINFO} from './taskVisibleTypes';
import {TASKPROGRESS} from './taskVisibleTypes';

export const taskVisibleUpdate = () => {
    return {
        type:TASKVISIBLE
    }
}

export const taskInfoShow = (task) => {
    return {
        type:TASKINFO,
        info: task
    }
}

export const taskProgress = (progress) => {
    return {
       type: TASKPROGRESS,
       progress: progress 
    }
}