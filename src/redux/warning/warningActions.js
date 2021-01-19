import {GET_WARNING} from './warningTypes';
import { CHANGE } from "./warningTypes";

export const getWarning = (info) => {
    return{
        type:GET_WARNING,
        payload:info
    }
}

export const change = (info) => {
    return{
        type:CHANGE,
        payload:info
    }
}