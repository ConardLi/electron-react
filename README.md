# electron-react

electron + react + react-router + mobx + webpack 搭建的脚手架工程

像开发react web项目一样开发electron

![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/electron-react.png)

## 项目路径与命名

```
main  //主进程
    menu  //菜单
render  //渲染进程
    component  //组件
    config  //配置
    public  //静态资源
    routes  //路由
    service  //服务
    utils  //工具类
    view  //页面
scripts  //打包脚本
main_process  //主进程打包目录
render_process   //渲染进程打包目录
dist    //客户端打包目录
resources  //图标资源
```

# 使用

## 本地调试

```
npm install
npm start
```

## 本地测试打包

```
npm run compile
```

## 打包客户端

```
npm run pack-win
npm run pack-mac
```

# 解决了什么问题

### 1.electron+react框架搭建

主进程代码使用babel编译，渲染进程使用webpack打包,快速开始开发。

### 2.调试

集成环境选择模块，简单分离开发，测试，线上环境。

![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/electron-env.png)

### 3.程序保护

开机自启

托盘最小化

崩溃监控

### 4.升级

一行代码接入升级平台，实现客户端升级功能

### 5.打包构建

一个指令搞定打包

```
npm run pack-win
npm run pack-mac
```

### 6.其他特性

- 立即可用的 React 插件 react-router,antd
- electron-build轻松构建
- webpack各种loader配置
- 默认支持 stage-0 的 ES6