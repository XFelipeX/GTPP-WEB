import {
  TOTALADMIN,
  TOTALUSER,
  PAGEADMIN,
  PAGEUSER,
  SEARCH,
  PAGESEARCH,
  TOTALSEARCH,
} from './PaginationTypes';

const initialState = {
  pageAdmin: '0',
  pageUser: '1',
  pageSearch: '0',
  totalSearch: '1',
  totalAdmin: '1',
  totalUser: '1',
  search: false,
};

const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOTALADMIN:
      state.totalAdmin = action.value;
      return { ...state };
    case TOTALUSER:
      state.totalUser = action.value;
      return { ...state };
    case PAGEADMIN:
      state.pageAdmin = action.value;
      return { ...state };
    case PAGEUSER:
      state.pageUser = action.value;
      return { ...state };
    case PAGESEARCH:
      state.pageSearch = action.value;
      return { ...state };
    case TOTALSEARCH:
      state.totalSearch = action.value;
      return { ...state };
    case SEARCH:
      state.search = action.status;
      return { ...state };
    default:
      return state;
  }
};

export default paginationReducer;
