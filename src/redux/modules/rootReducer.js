import { combineReducers} from 'redux';
import userLoginReducer from './login/userLoginReducer';
import visionMenuReducer from './visionMenu/visionMenuReducer'
import stateUpdateReducer from './stateUpdate/stateUpdateReducer';

export default combineReducers({
    permissions:userLoginReducer,
    visionMenu:visionMenuReducer,
    stateUpdate:stateUpdateReducer
})