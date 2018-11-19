import React, { Component } from 'react';
import { Layout, LocaleProvider } from 'antd';
import 'antd/dist/antd.less';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from '../Header';
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
          <Layout>
            <RouteContent />
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}
