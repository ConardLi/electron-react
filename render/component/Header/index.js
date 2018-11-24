import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import icon from '$public/image/icon.png';
import './index.css';

const { Header } = Layout;
const { Item } = Menu;

class HeaderComponent extends Component {

  componentDidMount() {
    // location.hash = '/Page1';
    // document.getElementById('Page1').click();
  }

  render() {
    return (
      <Header className='header'>
        <img src={icon} className='icon' />
        <Menu
          key="headerMenu"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['Page1']}
        >
          <Item key='Page1' id="Page1">
            <Link to='/Page1'>Page1</Link>
          </Item>
          <Item key='Page2' id="Page2">
            <Link to='/Page2'>Page2</Link>
          </Item>
        </Menu>
      </Header>
    );
  }
}

export default HeaderComponent;