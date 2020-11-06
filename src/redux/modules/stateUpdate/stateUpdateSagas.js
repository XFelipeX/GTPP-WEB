import {all, takeLatest} from 'redux-saga/effects'

export const UpdateTask = () => {
  return {
    type: 'UPDATETASK',
  }
}

export default all([
    takeLatest('UPDATETASK', UpdateTask),
])