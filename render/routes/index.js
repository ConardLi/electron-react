import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '$views/Home';
import Antd from '$views/Antd';
import Protect from '$views/Protect';
import Window from '$views/Window';
import Dialog from '$views/Dialog';
import System from '$views/System';
import Print from '$views/Print';

export default class RouteContent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/Home" component={Home} />
        <Route path="/Protect" component={Protect} />
        <Route path="/Antd" component={Antd} />
        <Route path="/Window" component={Window} />
        <Route path="/Dialog" component={Dialog} />
        <Route path="/System" component={System} />
        <Route path="/Print" component={Print} />
        <Redirect path="/" to={{ pathname: '/Home' }} />
      </Switch>
    );
  }
}
