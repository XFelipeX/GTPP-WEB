import { combineReducers} from 'redux';
import login from './login/userLoginReducer';
import visionMenu from './visionMenu/visionMenuReducer'

export default combineReducers({
    login,
    visionMenu
})