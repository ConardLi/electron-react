import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Page1 from '$views/Page1';
import Page2 from '$views/Page2';

export default class RouteContent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/Page1" component={Page1} />
        <Route path="/Page2" component={Page2} />
        <Redirect path="/" to={{ pathname: '/Page1' }} />
      </Switch>
    );
  }
}
