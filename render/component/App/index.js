import React, { Component } from 'react';
import { Layout, LocaleProvider } from 'antd';
import 'antd/dist/antd.less';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from '../Header';
import Nav from '../Nav';
import RouteContent from '$routes/index';
import './index.css';
var { ipcRenderer } = require('electron');


export default class App extends Component {

  componentDidMount() {
    ipcRenderer.send('window-inited', {
      userAgent: navigator.userAgent,
    });
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <Layout className="container">
          <Header />
          <Nav />
          <Layout style={{ position: 'absolute', left: 220, top: 64, height: '100%', width: '100%' }}>
            <RouteContent />
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}
