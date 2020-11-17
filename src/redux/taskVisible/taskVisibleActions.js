import {TASKVISIBLE} from './taskVisibleTypes';
import {TASKINFO} from './taskVisibleTypes';

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