  export const setOrder = (info) => {
    return {
      type: 'SET_ORDER',
      payload: info
    }
  }
  
  export const setCol = (info) => {
    return {
      type: 'SET_COL',
      payload: info
    }
  }
  
  export const setDateVisi = (value) => {
    return{
      type: 'SET_DATE_VISIBLE',
      payload: value
    }
  }
  
  export const setPriorityVisi = (value) => {
    return{
      type: 'SET_PRIORITY_VISIBLE',
      payload: value
    }
  }
  
  export const setStateVisi = (value) => {
    return{
      type: 'SET_STATE_VISIBLE',
      payload:value
    }
  }
  
  export const setVincVisi = (value) => {
    return{
      type: 'SET_VINC_VISIBLE',
      payload:value
    }
  }
  export const setCompanyVisi = (value) => {
    return {
      type: 'SET_COMPANY_VISIBLE',
      payload:value
    }
  }