import {GET_VINCULATED_USERS} from './vinculatedUsersTypes';

export const getVinculatedUsers = (info) => {
    return {
        type:GET_VINCULATED_USERS,
        info: info
    }
}

