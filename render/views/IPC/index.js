import React from 'react';
import { Button, Alert } from 'antd';
import styles from './index.css';
import { ipcRenderer, remote } from 'electron';

class IPC extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('main-msg', (event, msg) => {
      this.setState({ msg })
    })
  }

  handleSendSync = () => {
    ipcRenderer.send('sync-render', '我是来自渲染进程的异步消息');
  }

  handleSendAsync = () => {
    const msg = ipcRenderer.sendSync('async-render', '我是来自渲染进程的同步消息');
    this.setState({ msg })
  }

  handleStart = () => {
    ipcRenderer.send('start-msg');
  }

  handleEnd = () => {
    ipcRenderer.send('end-msg');
  }

  handleRemote = () => {
    remote.dialog.showErrorBox('主进程才有的dialog模块', '我是使用remote调用的')
  }


  render() {
    const { msg } = this.state;
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message="点击向主进程发送【异步】消息" type="info" />
        <Button className={styles.margin} onClick={this.handleSendSync}>发送</Button>
        <Alert className={styles.margin} message="点击向主进程发送【同步】消息" type="error" />
        <Button className={styles.margin} onClick={this.handleSendAsync}>发送</Button>
        <Alert className={styles.margin} message="点击告诉主进程，开始向渲染进程发消息吧！" type="error" />
        <Button className={styles.margin} onClick={this.handleStart}>开始发送</Button>
        <Button className={styles.margin} onClick={this.handleEnd}>结束发送</Button>
        <Alert className={styles.margin} message={"主进程的回应：" + msg} type="warning" />
        <Alert className={styles.margin} message="使用remote直接调用主进程模块" type="success" />
        <Button className={styles.margin} onClick={this.handleRemote}>调用</Button>
      </div>
    );
  }
}

export default IPC;