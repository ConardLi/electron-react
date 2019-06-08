import React from 'react';
import { Alert } from 'antd';
import electron from 'electron';
import styles from './index.css';

const { remote } = electron;
const { Menu, globalShortcut, dialog } = remote;
const menus = [
  {
    label: '文件',
    submenu: [
      {
        label: '新建文件',
        click: function () {
          dialog.showMessageBox({
            type: 'info',
            message: '嘿!',
            detail: '你点击了新建文件！',
          })
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [{
      label: '撤销',
      role: 'undo'
    }, {
      label: '重做',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: '剪切',
      role: 'cut'
    }, {
      label: '复制',
      role: 'copy'
    }, {
      label: '粘贴',
      role: 'paste'
    }, {
      label: '全选',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  },
  {
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }
]

class MenuView extends React.Component {

  componentDidMount() {
    let m = Menu.buildFromTemplate(menus)
    document.getElementById('menuDemoContainer').addEventListener('contextmenu', (e) => {
      e.preventDefault()
      m.popup({ window: remote.getCurrentWindow() })
    })
    globalShortcut.register('CommandOrControl+N', () => {
      dialog.showMessageBox({
        type: 'info',
        message: '嘿!',
        detail: '你触发了手动注册的快捷键.',
      })
    })
  }

  componentWillUnmount() {
    globalShortcut.unregisterAll();
  }

  render() {
    return (
      <div className={styles.demoContainer} id="menuDemoContainer">
        <Alert className={styles.margin} message="右键本页面查看自定义菜单" type="info" />
        <Alert className={styles.margin} message="试试【command or Ctrl + M】进行最小化，由菜单创建的快捷键" type="success" />
        <Alert className={styles.margin} message="试试【command or Ctrl + N】，手动创建的快捷键" type="error" />
      </div>
    );
  }
}

export default MenuView;