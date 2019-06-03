import React from 'react';
import { Button, Alert } from 'antd';
import electron from 'electron';
import styles from './index.css';

const { remote } = electron;

class Dialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      dialogMessage: '',
      filePath: ''
    }
  }

  createErrorDialog = () => {
    remote.dialog.showErrorBox('错误', '这是一个错误弹框！')
  }

  createDialog = () => {
    remote.dialog.showMessageBox({
      type: 'info',
      title: '提示信息',
      message: '这是一个对话弹框！',
      buttons: ['确定', '取消']
    }, (index) => {
      this.setState({ dialogMessage: `【你点击了${index ? '取消' : '确定'}！！】` })
    })
  }

  createMessage = () => {
    let options = {
      title: '信息框标题',
      body: '我是一条信息～～～',
    }
    let myNotification = new window.Notification(options.title, options)
    myNotification.onclick = () => {
      this.setState({ message: '【你点击了信息框！！】' })
    }
  }

  createOpenDialog = () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'openFile']
    }, (data) => {
      this.setState({ filePath: `【选择路径：${data[0]}】 ` })
    })
  }


  render() {
    const { message, dialogMessage, filePath } = this.state;
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message="点击打开一个错误弹框" type="info" />
        <Button className={styles.margin} onClick={this.createErrorDialog}>打开</Button>
        <Alert className={styles.margin} message={"点击打开一个系统对话弹框" + dialogMessage} type="success" />
        <Button className={styles.margin} onClick={this.createDialog}>打开</Button>
        <Alert className={styles.margin} message={"点击打开一个信息提示框" + message} type="warning" />
        <Button className={styles.margin} onClick={this.createMessage}>打开</Button>
        <Alert className={styles.margin} message={"点击打开一个文件选择框" + filePath} type="error" />
        <Button className={styles.margin} onClick={this.createOpenDialog}>打开</Button>
      </div>
    );
  }
}
export default Dialog;