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
        id:task.id,
        description:task.description,
        full_description:task.full_description,
        initial_date:task.initial_date,
        final_date:task.final_date,
        state_id:task.state_id,
        priority:task.priority,
        user_id:task.user_name,
        comshopdepsub_id:task.comshopdepsub_id,
        state_description:task.state_description,
        progress:task.progress,
        expire:task.expire
    }
}