import {GET_COMPANY} from './taskCompanyTypes';

export const getCompany = info => {
    return{
        type:GET_COMPANY,
        payload:info
    }
}