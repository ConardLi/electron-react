import React from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import './index.css';


@observer
class Demo extends React.Component {

  render() {
    return (
      <div>我是一个例子</div>
    );
  }
}

export default Demo;