import {TASKVISIBLE} from './taskVisibleTypes';
import {TASKINFO} from './taskVisibleTypes';
import {SENDINFOMODAL} from './taskVisibleTypes';
import {TASKOWNER} from './taskVisibleTypes';

export const taskVisibleUpdate = () => {
    return {
        type:TASKVISIBLE
    }
}

export const taskInfoShow = (task) => {
    return {
        type:TASKINFO,
        task: task
    }
}

export const taskInfoOwner = (owner) => {
    return {
        type:TASKOWNER,
        owner: owner
    }
}

export const sendInfoModal = (taskId,percent,description,initial_date,final_date,state_id,user_id,priority) => {
    return {
        type:SENDINFOMODAL,
        info: {task_id:taskId,percent:percent,description:description,initial_date:initial_date,final_date:final_date,state_id:state_id,user_id:user_id,priority:priority}
    }
}   


