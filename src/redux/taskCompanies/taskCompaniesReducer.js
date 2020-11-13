import {GET_COMPANIES} from './taskCompaniesTypes';

const initialState = [{
    id:'',
    description:''
}]

const taskCompaniesReducer = (state = initialState, action) => {
    //console.log('redux aqui' + action.payload)
    switch(action.type){
        case GET_COMPANIES:
            return action.payload
        default:
            return state
    }
}

export default taskCompaniesReducer;