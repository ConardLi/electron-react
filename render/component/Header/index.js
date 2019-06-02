import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import icon from '$public/image/icon.png';
import './index.css';

const { Header } = Layout;
const { Item, SubMenu } = Menu;

class HeaderComponent extends Component {
  render() {
    return (
      <Header className='header' >
        <img src={icon} className='icon' />
      </Header>
    );
  }
}

export default HeaderComponent;