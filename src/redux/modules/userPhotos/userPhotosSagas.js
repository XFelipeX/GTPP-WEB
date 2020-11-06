import {all, takeLatest} from 'redux-saga/effects'

export const SetPhotos = () => {
  return {
    type: 'SETPHOTOS',
  }
}

export default all([
    takeLatest('SETPHOTOS', SetPhotos),
])