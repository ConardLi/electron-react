import React from 'react';
import { Button, Alert } from 'antd';
import { observer } from 'mobx-react';
import styles from './index.css';


@observer
class Demo extends React.Component {

  handleCrash = () => {
    process.crash();
  }

  render() {
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message="点击测试程序崩溃重启" type="info" />
        <Button className={styles.margin} onClick={this.handleCrash}>程序崩溃</Button>
        <Alert className={styles.margin} message="点击测试隐藏窗口，最小化到托盘" type="info" />
        <Button className={styles.margin}>缩小到托盘</Button>
      </div>
    );
  }
}

export default Demo;