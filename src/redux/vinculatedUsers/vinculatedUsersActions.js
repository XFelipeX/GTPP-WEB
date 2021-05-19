import {GET_VINCULATED_USERS} from './vinculatedUsersTypes';
import {GET_USER_PHOTOS} from './vinculatedUsersTypes';

export const getVinculatedUsers = (info) => {
    return {
        type:GET_VINCULATED_USERS,
        info: info
    }
}

export const getUserPhotos = (photo) => {
    return {
        type:GET_USER_PHOTOS,
        photo: photo
    }

}
