import {GET_TASK_USER_PHOTOS} from './taskUsersPhotosTypes';


export const getUsersPhotos = (info) => {
    return {
        type:GET_TASK_USER_PHOTOS,
        info: info
    }
}


