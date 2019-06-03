import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '$views/Home';
import Antd from '$views/Antd';
import Protect from '$views/Protect';
import Window from '$views/Window';
import Dialog from '$views/Dialog'

export default class RouteContent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/Home" component={Home} />
        <Route path="/Protect" component={Protect} />
        <Route path="/Antd" component={Antd} />
        <Route path="/Window" component={Window} />
        <Route path="/Dialog" component={Dialog} />
        <Redirect path="/" to={{ pathname: '/Home' }} />
      </Switch>
    );
  }
}
