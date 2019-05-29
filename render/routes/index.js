import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '$views/Home';
import Page2 from '$views/Page2';

export default class RouteContent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/Home" component={Home} />
        <Route path="/Page2" component={Page2} />
        <Redirect path="/" to={{ pathname: '/Home' }} />
      </Switch>
    );
  }
}
