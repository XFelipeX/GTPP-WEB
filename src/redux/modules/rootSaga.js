import {all} from 'redux-saga/effects'

import loginSaga from './login/userLoginSaga';
import visionMenu from './visionMenu/visionMenuSagas'
import stateUpdateSaga from './stateUpdate/stateUpdateSagas'

export default function* rootSaga(){
    return yield all([
        loginSaga,
        visionMenu,
        stateUpdateSaga
    ])
}