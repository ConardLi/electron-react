import React from 'react';
import { Button, Alert } from 'antd';
import electron from 'electron';
import styles from './index.css';

const { ipcRenderer } = electron;


class Window extends React.Component {

  createWindow = () => {
    ipcRenderer.send('create-window');
  }

  createWNoBarWindow = () => {
    ipcRenderer.send('create-nobar-window');
  }

  createNoBarWindowWithButton = () => {
    ipcRenderer.send('create-nobar-window-button');
  }

  createWindowDrag = () => {
    ipcRenderer.send('create-nobar-window-drag');
  }

  createWindowTrans = () => {
    ipcRenderer.send('create-window-trans');
  }


  render() {
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message="点击打开一个普通窗口" type="info" />
        <Button className={styles.margin} onClick={this.createWindow}>打开窗口</Button>
        <Alert className={styles.margin} message="点击打开一个无框窗口(点击下面【关闭所有窗口】即可关闭)" type="success" />
        <Button className={styles.margin} onClick={this.createWNoBarWindow}>打开窗口</Button>
        <Alert className={styles.margin} message="点击打开一个带有状态栏的无框窗口" type="warning" />
        <Button className={styles.margin} onClick={this.createNoBarWindowWithButton}>打开窗口</Button>
        <Alert className={styles.margin} message="点击打开一个带有状态栏、可拖动的无框窗口" type="error" />
        <Button className={styles.margin} onClick={this.createWindowDrag}>打开窗口</Button>
        <Alert className={styles.margin} message="点击打开一个透明窗口" type="info" />
        <Button className={styles.margin} onClick={this.createWindowTrans}>打开窗口</Button>
      </div>
    );
  }
}

export default Window;