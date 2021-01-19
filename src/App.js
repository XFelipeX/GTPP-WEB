import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import { Provider } from "react-redux";
//history precisa ficar antes da store
import { store, persistor } from "./redux/store";

export default function src() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <ReactNotification/>
          <Routes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
