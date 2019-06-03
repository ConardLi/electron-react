import React from 'react';
import { Button, Alert } from 'antd';
import electron from 'electron';
import os from 'os';
import styles from './index.css';

const { remote } = electron;
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


  render() {
    const { appPath, electron, chrome, node, v8, systemPath } = this.state;
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
      </div>
    );
  }
}

export default System;