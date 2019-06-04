import React, { Component } from 'react';
import { Layout, Menu, Row } from 'antd';
import { Link } from 'react-router-dom';
import icon from '$public/image/icon.png';
import './index.css';

const { Header } = Layout;
const { Item, SubMenu } = Menu;

class Nav extends Component {

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
      <div style={{ width: 220, height: '100%', zIndex: 999 }}>
        <div className='iconContainer'>
          <img src={icon} className='icon' />
          <span className="titleText">electron-react</span>
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}
        >
          <Item key="Home">
            <Link to='/Home'>主页</Link>
          </Item>
          <Item key="Window">
            <Link to='/Window'>窗口</Link>
          </Item>
          <Item key="Dialog">
            <Link to='/Dialog'>弹框</Link>
          </Item>
          <Item key="System">
            <Link to='/System'>系统</Link>
          </Item>
          <Item key="Print">
            <Link to='/Print'>打印</Link>
          </Item>
          <Item key="Protect">
            <Link to='/Protect'>保护措施</Link>
          </Item>
          <Item key="Antd">
            <Link to='/Antd'>Antd</Link>
          </Item>
        </Menu>
      </div>
    );
  }
}

export default Nav;