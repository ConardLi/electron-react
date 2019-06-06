import React from 'react';
import { Button, Alert } from 'antd';
import styles from './index.css';
import { ipcRenderer, remote } from 'electron';

const { getGlobal } = remote;

class IPC extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      mainId: '',
      dirname: '',
      deviecMac: '',
      myField: null
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

  handleReadGlobal = () => {
    const mainId = getGlobal('mainId')
    const dirname = getGlobal('__dirname')
    const deviecMac = getGlobal('device').mac;
    const myField = getGlobal('myField');
    this.setState({ mainId, dirname, deviecMac, myField });
  }

  changeGloable = () => {
    getGlobal('myField').name = 'code秘密花园';
    this.setState({ myField: getGlobal('myField') });
  }


  render() {
    const { msg, mainId, dirname, deviecMac, myField } = this.state;
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
        <Alert className={styles.margin} message={`点击读取主进程存储的全局信息`} type="success" />
        {mainId && <Alert className={styles.margin} message={`主窗口ID【${mainId}】`} type="success" />}
        {dirname && <Alert className={styles.margin} message={`主进程入口目录【${dirname}】`} type="success" />}
        {deviecMac && <Alert className={styles.margin} message={`设备mac地址【${deviecMac}】`} type="success" />}
        {myField && <Alert className={styles.margin} message={`自定义属性【${myField.name}】`} type="success" />}
        <Button className={styles.margin} onClick={this.handleReadGlobal}>读取</Button>
        <Button className={styles.margin} onClick={this.changeGloable}>改变共享数据</Button>
      </div>
    );
  }
}

export default IPC;