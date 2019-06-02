import React, { Component } from 'react';
import { Layout } from 'antd';
import './index.css';

const { Header } = Layout;

class HeaderComponent extends Component {
  render() {
    return (
      <Header className='header' ></Header>
    );
  }
}

export default HeaderComponent;