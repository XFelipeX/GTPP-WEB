import React from 'react';

import Routes from './routes';
import {BrowserRouter} from 'react-router-dom';

import {Provider } from 'react-redux';
//history precisa ficar antes da store
import store from './redux/store';


export default function src() {
 return (
   <Provider store={store}>
   <BrowserRouter>
  <Routes/>
   </BrowserRouter>
   </Provider>
 );
}