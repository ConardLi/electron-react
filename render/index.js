import React from 'react';
import { render } from 'react-dom';
import App from '$component/App';
import { Router } from 'react-router-dom';
import createHistory from 'history/createHashHistory';

const history = createHistory();

render(
  <Router history={history}>
    <App />
  </Router>
  ,
  document.getElementById('root')
);
