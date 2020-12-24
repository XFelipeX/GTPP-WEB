import React from 'react';

import {Switch,  Route, Redirect,BrowserRouter} from "react-router-dom";

import Login from './pages/Login'
import Main from './pages/Main'
import Authenticated from './pages/Login/auth'

 


const PrivateRoute = ({component:Component,...rest}) => (
  

  <Route
  {...rest}
  render={() => 
  
    Authenticated() ? (
      <Component/>
    ) : (
      <Redirect to={{pathname: "/"}}/>
    )
  }
  />
);


const routes = () => {
  return (
    <BrowserRouter basename='GLOBAL/View/Task'>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/main" component={Main} />
      </Switch>
      </BrowserRouter>
  );
}

export default routes;
