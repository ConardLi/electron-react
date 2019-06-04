import React from 'react';
import { Button, Alert } from 'antd';
import electron from 'electron';
import os from 'os';
import styles from './index.css';

const { shell } = electron;


class Shell extends React.Component {

  openDir = () => {
    shell.showItemInFolder(os.homedir());
  }

  openWeb = () => {
    shell.openExternal('http://www.conardli.top/');
  }

  render() {
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message="点击打开系统文件夹" type="info" />
        <Button className={styles.margin} onClick={this.openDir}>打开</Button>
        <Alert className={styles.margin} message="点击打开一个外部网站" type="success" />
        <Button className={styles.margin} onClick={this.openWeb}>打开</Button>
      </div>
    );
  }
}

export default Shell;