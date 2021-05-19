import {GET_SHOP} from './taskShopTypes';

const initialState = [{
    id:'',
    number:'',
    description:'',
    cnpj:''
}]

const taskShopReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_SHOP:
            return action.payload 
        default:
            return state
    }
}

export default taskShopReducer;