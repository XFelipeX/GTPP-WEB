import {all, takeLatest} from 'redux-saga/effects'

export const GetStates = () => {
  return {
    type: 'GET_STATES',
  }
}

export default all([
    takeLatest('GET_STATES', GetStates),
])