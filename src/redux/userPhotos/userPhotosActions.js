import { SETPHOTOS } from './userPhotosTypes';

export const setPhotos = (info) => {
  return {
    type: SETPHOTOS,
    payload: info
  }
}