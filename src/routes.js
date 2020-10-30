import React from 'react';

import {Switch,  Route} from "react-router-dom";

import Login from './pages/Login'
import Main from './pages/Main'

const routes = () => {
  return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/main" component={Main} />
      </Switch>
  );
}

export default routes;
