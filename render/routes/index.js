import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '$views/Home';
import Antd from '$views/Antd';
import Protect from '$views/Protect';

export default class RouteContent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/Home" component={Home} />
        <Route path="/Protect" component={Protect} />
        <Route path="/Antd" component={Antd} />
        <Redirect path="/" to={{ pathname: '/Home' }} />
      </Switch>
    );
  }
}
