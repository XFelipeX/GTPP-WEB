import {GET_SHOP} from './taskShopTypes';

export const getShop = info => {
    return{
        type: GET_SHOP,
        payload:info
    }
}