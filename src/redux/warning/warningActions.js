import {GET_WARNING} from './warningTypes';
import { REMOVE_ITEM } from "./warningTypes";

export const getWarning = (info) => {
    return{
        type:GET_WARNING,
        payload:info
    }
}

export const removeWarning = (info) => {
    return{
        type:REMOVE_ITEM,
        payload:info
    }
}