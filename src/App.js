import React from 'react';
import { Provider } from 'react-redux'
import Routes from './routes';
import { store} from '../redux/store';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <Provider store={store}>
        <BrowserRouter>   
        <Routes />
        </BrowserRouter>
    </Provider>
  );
}


