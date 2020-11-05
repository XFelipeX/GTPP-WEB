import {select,all, call, put, takeLatest} from 'redux-saga/effects'

export const UserLogin = (info) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: info
  }
}

export const SetVincVisi = (info) => {
    return{
        type: 'SET_VINC_VISIBLE',
        payload: info
    }
}

export const SetOrder = (info) => {
    return{
        type: 'SET_ORDER',
        payload: info
    }
}

export const SetCol = (info) => {
    return{
        type: 'SET_COL',
        payload: info
    }
}

export const SetDateVisi = (info) => {
    return{
        type: 'SET_DATE_VISIBLE',
        payload: info
    }
}

export const SetPriorityVisi = (info) => {
    return{
        type: 'SET_PRIORITY_VISIBLE',
        payload: info
    }
}

export const SetStateVisi = (info) => {
    return{
        type: 'SET_STATE_VISIBLE',
        payload: info
    }
}


export const SetCompanyVisi = (info) => {
    return{
        type: 'SET_COMPANY_VISIBLE',
        payload: info
    }
}

export default all([
     takeLatest('SET_VINC_VISIBLE', SetVincVisi),
     takeLatest('SET_ORDER', SetOrder),
     takeLatest('SET_COL', SetCol),
     takeLatest('SET_DATE_VISIBLE', SetDateVisi),
     takeLatest('SET_PRIORITY_VISIBLE', SetPriorityVisi),
     takeLatest('SET_STATE_VISIBLE',SetStateVisi ),
     takeLatest('SET_COMPANY_VISIBLE', SetCompanyVisi)
])