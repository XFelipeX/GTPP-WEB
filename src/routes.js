import React, { Component } from 'react';

import {Switch,  Route, Redirect} from "react-router-dom";

import Login from './pages/Login'
import Main from './pages/Main'


function takeToken(){
  let token = sessionStorage.getItem('token');
  return token;
}

const PrivateRoute = ({component:Component,...rest}) => (
  

  <Route
  {...rest}
  render={() => 
  
    takeToken() != '' ? (
      <Component/>
    ) : (
      <Redirect to={{pathname: "/"}}/>
    )
  }
  />
);


const routes = () => {
  return (
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/main" component={Main} />
      </Switch>
  );
}

export default routes;
