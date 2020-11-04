import {all} from 'redux-saga/effects'

import loginSaga from './Login/userLoginSaga';

export default function* rootSaga(){
    return yield all([
        loginSaga,
    ])
}