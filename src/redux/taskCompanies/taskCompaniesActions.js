import {GET_COMPANIES} from './taskCompaniesTypes';

export const getCompanies = (info) => {
    return{
        type:GET_COMPANIES,
        payload:info
    }
}