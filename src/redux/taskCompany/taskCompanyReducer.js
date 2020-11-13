import {GET_COMPANY} from './taskCompanyTypes';

const initialState = [{
    id:'',
    description:''
}]

const taskCompanyReducer = (state = initialState, action) => {
    //console.log('redux aqui' + action.payload)
    switch(action.type){
        case GET_COMPANY:
            return action.payload
        default:
            return state
    }
}

export default taskCompanyReducer;