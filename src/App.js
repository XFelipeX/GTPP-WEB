import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from './routes';
import {BrowserRouter} from 'react-router-dom';

import {Provider } from 'react-redux';
//history precisa ficar antes da store
import {store, persistor} from './redux/store';


export default function src() {
 return (
   <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
   <BrowserRouter>
  <Routes/>
   </BrowserRouter>
   </PersistGate>
   </Provider>
 );
}