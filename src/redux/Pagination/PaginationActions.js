import {
  TOTALADMIN,
  TOTALUSER,
  PAGEADMIN,
  PAGEUSER,
  SEARCH,
  PAGESEARCH,
  TOTALSEARCH,
} from './PaginationTypes';

export const setPageUser = (value) => {
  return {
    type: PAGEUSER,
    value: value,
  };
};

export const setPageAdmin = (value) => {
  return {
    type: PAGEADMIN,
    value: value,
  };
};

export const setPageSearch = (value) => {
  return {
    type: PAGESEARCH,
    value: value,
  };
};

export const setTotalUser = (value) => {
  return {
    type: TOTALUSER,
    value: value,
  };
};

export const setTotalSearch = (value) => {
  return {
    type: TOTALSEARCH,
    value: value,
  };
};

export const setTotalAdmin = (value) => {
  return {
    type: TOTALADMIN,
    value: value,
  };
};

export const setStatusSearch = (status) => {
  return {
    type: SEARCH,
    status: status,
  };
};
