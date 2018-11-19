import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Page2 extends Component {

  render() {
    return (
      <h2>第二页</h2>
    );
  }
}

export default Page2;