import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import icon from '$public/image/icon.png';
import './index.css';

const { Header } = Layout;
const { Item } = Menu;

class HeaderComponent extends Component {

  constructor(props) {
    super(props);
    const hash = location.hash.split('/')[1];
    this.state = { current: hash ? hash : 'Home' };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key
    });
  }

  render() {
    return (
      <Header className='header'>
        <img src={icon} className='icon' />
        <Menu
          key="headerMenu"
          theme="dark"
          mode="horizontal"
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}
        >
          <Item key='Home' id="Home">
            <Link to='/Home'>Home</Link>
          </Item>
          <Item key='Antd' id="Antd">
            <Link to='/Antd'>Antd</Link>
          </Item>
        </Menu>
      </Header>
    );
  }
}

export default HeaderComponent;