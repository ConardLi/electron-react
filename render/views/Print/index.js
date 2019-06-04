import React from 'react';
import { Button, Alert, Select, Row, Tag } from 'antd';
import electron from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import styles from './index.css';

const { remote } = electron;
const { getGlobal, BrowserWindow, shell } = remote;
const mainWindow = BrowserWindow.fromId(getGlobal('mainId'));
const { Option } = Select;

class Print extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contentPdfPath: '',
      webviewPdfPath: '',
      printers: mainWindow.webContents.getPrinters(),
      curretnPrinter: ''
    }
  }

  changePrinter = (curretnPrinter) => {
    this.setState({ curretnPrinter })
  }

  printToPDF = () => {
    const pdfPath = path.join(os.tmpdir(), 'contentPrint.pdf');
    mainWindow.webContents.printToPDF({}, (err, data) => {
      console.log(err, data);
      fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error
        shell.openExternal(`file://${pdfPath}`)
        this.setState({ contentPdfPath: pdfPath })
      });
    });
  }

  printWebviewToPDF = () => {
    const pdfPath = path.join(os.tmpdir(), 'webviewPrint.pdf');
    const webview = document.getElementById('printWebview');
    const renderHtml = '我是被临时插入webview的内容...';
    webview.executeJavaScript('document.documentElement.innerHTML =`' + renderHtml + '`;');
    webview.printToPDF({}, (err, data) => {
      console.log(err, data);
      fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error
        shell.openExternal(`file://${pdfPath}`)
        this.setState({ webviewPdfPath: pdfPath })
      });
    });
  }

  printWebview = () => {
    const webview = document.getElementById('printWebview');
    const renderHtml = '我是被临时插入webview的内容...';
    webview.executeJavaScript('document.documentElement.innerHTML =`' + renderHtml + '`;');
    webview.print({ silent: false, printBackground: true, deviceName: this.state.curretnPrinter },
      () => { })
  }

  contentPrint = (silent) => {
    if (this.state.curretnPrinter) {
      mainWindow.webContents.print({
        silent: silent, printBackground: true, deviceName: this.state.curretnPrinter
      }, () => { })
    } else {
      remote.dialog.showErrorBox('错误', '请先选择一个打印机！')
    }
  }

  render() {
    const { contentPdfPath, webviewPdfPath, printers, curretnPrinter } = this.state;
    return (
      <div className={styles.demoContainer}>
        <Alert className={styles.margin} message={"点击将【当前窗口】打印到PDF：" + contentPdfPath} type="info" />
        <Button className={styles.margin} onClick={this.printToPDF}>打印</Button>
        <Alert className={styles.margin} message={"点击将【webview】打印到PDF" + webviewPdfPath} type="info" />
        <Button className={styles.margin} onClick={this.printWebviewToPDF}>打印</Button>
        <Row className={styles.margin}>
          <Tag color="green">请选择系统打印机</Tag>
          <Select style={{ width: 200 }} onChange={this.changePrinter} value={curretnPrinter}>
            {printers.map((item) => <Option key={item.name} value={item.name}>{item.description}</Option>)}
          </Select>
        </Row>
        <Alert className={styles.margin} message="点击将【当前窗口】选择指定打印机进行打印" type="success" />
        <Button className={styles.margin} onClick={() => { this.contentPrint(false) }}>打印</Button>
        <Alert className={styles.margin} message="点击将【当前窗口】选择指定打印机进行静默打印（不调用系统打印对话框）" type="success" />
        <Button className={styles.margin} onClick={() => { this.contentPrint(true) }}>打印</Button>
        <Alert className={styles.margin} message="点击将【webview】选择指定打印机进行打印" type="info" />
        <Button className={styles.margin} onClick={this.printWebview}>打印</Button>
        <Row className={styles.margin}>
          <webview
            id="printWebview"
            src="data:text/html,init"
            nodeintegration="true"
            style={{ height: '0cm', width: '0cm', visibility: 'hidden' }}
          />
        </Row>
      </div >
    );
  }
}
export default Print;