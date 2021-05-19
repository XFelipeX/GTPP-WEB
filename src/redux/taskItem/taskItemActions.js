import {SET_ITEM_CHECK} from './taskItemTypes';

export const setItemCheck = (info) => {
    return {
        type:SET_ITEM_CHECK,
        payload: info
    }
}