import {all} from 'redux-saga/effects'

import loginSaga from './login/userLoginSaga';
import visionMenu from './visionMenu/visionMenuSagas'

export default function* rootSaga(){
    return yield all([
        loginSaga,
        visionMenu
    ])
}