import React from 'react';
import { Button, Alert, Input } from 'antd';
import electron from 'electron';
import os from 'os';
import styles from './index.css';

const { remote, clipboard } = electron;
const { app } = remote;


class System extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      appPath: '',
      electron: '',
      chrome: '',
      node: '',
      v8: '',
      systemPath: '',
      text: '复制我呀',
      copy: '',
      copyVal: ''
    }
  }

  getAppPath = () => {
    this.setState({ appPath: app.getAppPath() })
  }

  getVersion = () => {
    this.setState({ ...process.versions })
  }

  getSystemPath = () => {
    this.setState({ systemPath: os.homedir() })
  }

  changeText = (e) => {
    this.setState({ text: e.target.value })
  }

  copy = () => {
    clipboard.writeText(this.state.text);
    this.setState({
      copy: '复制成功！' + this.state.text
    })
  }

  copyVal = () => {
    this.setState({
      copyVal: clipboard.readText()
    })
  }

  render() {
    const { appPath, electron, chrome, node, v8, systemPath, text, copy, copyVal } = this.state;
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message={"点击获取当前应用程序路径：" + appPath} type="info" />
        <Button className={styles.margin} onClick={this.getAppPath}>获取应用路径</Button>

        <Alert className={styles.margin} message={"点击获取系统主目录：" + systemPath} type="error" />
        <Button className={styles.margin} onClick={this.getSystemPath}>获取系统路径</Button>

        <Alert className={styles.margin} message="点击获取版本信息" type="success" />
        {electron && <Alert className={styles.margin} message={"electron版本：" + electron} type="success" />}
        {chrome && <Alert className={styles.margin} message={"chrome版本：" + chrome} type="success" />}
        {node && <Alert className={styles.margin} message={"node版本：" + node} type="success" />}
        {v8 && <Alert className={styles.margin} message={"v8版本：" + v8} type="success" />}
        <Button className={styles.margin} onClick={this.getVersion}>获取版本</Button>

        <Input className={styles.margin} value={text} onChange={this.changeText} />

        <Alert className={styles.margin} message={"点击复制上面的内容：" + copy} type="warning" />
        <Button className={styles.margin} onClick={this.copy}>复制</Button>

        <Alert className={styles.margin} message={"点击粘贴剪切板的内容：" + copyVal} type="warning" />
        <Button className={styles.margin} onClick={this.copyVal}>粘贴</Button>
      </div>
    );
  }
}

export default System;