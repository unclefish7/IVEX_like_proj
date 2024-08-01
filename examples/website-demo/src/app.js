/* global document */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import {setXVIZConfig} from '@xviz/parser';
import {XVIZFileLoader} from 'streetscape.gl';
import {ThemeProvider} from '@streetscape.gl/monochrome';

import ControlPanel from './control-panel'; // 控制面板组件
import CameraPanel from './camera-panel'; // 摄像头面板组件
import MapView from './map-view'; // 地图视图组件
import Timeline from './timeline'; // 时间轴组件
import Toolbar from './toolbar'; // 工具栏组件
import HUD from './hud'; // 头部显示组件
import NotificationPanel from './notification-panel'; // 通知面板组件
import isMobile from './is-mobile'; // 检测是否为移动设备的模块

import {LOGS, MOBILE_NOTIFICATION} from './constants'; // 常量文件
import {UI_THEME} from './custom-styles'; // 自定义样式

import './stylesheets/main.scss'; // 引入主样式文件

class Example extends PureComponent {
  state = {
    // 如果不是移动设备，加载第一个日志文件
    ...(!isMobile && this._loadLog(LOGS[0])),
    settings: {
      viewMode: 'PERSPECTIVE', // 视图模式
      showTooltip: false // 是否显示工具提示
    }
  };

  // 加载日志文件的方法
  _loadLog(logSettings) {
    if (logSettings.xvizConfig) {
      // 设置 XVIZ 配置
      setXVIZConfig(logSettings.xvizConfig);
    }

    // 创建一个 XVIZFileLoader 实例来加载日志文件
    const loader = new XVIZFileLoader({
      timingsFilePath: `${logSettings.path}/0-frame.json`, // 时间文件路径
      getFilePath: index => `${logSettings.path}/${index + 1}-frame.glb`, // 每个帧文件路径
      worker: true, // 是否使用 worker
      maxConcurrency: 4 // 最大并发数
    })
      .on('ready', () =>
        // 设置流配置
        loader.updateStreamSettings({
          '/tracklets/label': false
        })
      )
      .on('error', console.error); // 处理错误

    loader.connect(); // 连接加载器

    return {selectedLog: logSettings, log: loader}; // 返回加载的日志
  }

  // 日志文件改变时的处理方法
  _onLogChange = selectedLog => {
    this.state.log.close(); // 关闭当前日志
    this.setState(this._loadLog(selectedLog)); // 加载新日志并更新状态
  };

  // 设置改变时的处理方法
  _onSettingsChange = changedSettings => {
    this.setState({
      settings: {...this.state.settings, ...changedSettings} // 更新设置状态
    });
  };

  render() {
    // 如果是移动设备，显示通知面板
    if (isMobile) {
      return <NotificationPanel notification={MOBILE_NOTIFICATION} />;
    }

    const {log, selectedLog, settings} = this.state;

    return (
      <div id="container">
        <MapView log={log} settings={settings} onSettingsChange={this._onSettingsChange} />
        {/* 地图视图组件 */}

        <ControlPanel selectedLog={selectedLog} onLogChange={this._onLogChange} log={log} />
        {/* 控制面板组件 */}

        <HUD log={log} />
        {/* 头部显示组件 */}

        <Timeline log={log} />
        {/* 时间轴组件 */}

        <Toolbar settings={settings} onSettingsChange={this._onSettingsChange} />
        {/* 工具栏组件 */}

        <CameraPanel log={log} videoAspectRatio={selectedLog.videoAspectRatio} />
        {/* 摄像头面板组件 */}
      </div>
    );
  }
}

// 创建一个根元素并添加到文档中
const root = document.createElement('div');
document.body.appendChild(root);

// 渲染主组件到根元素中，并使用 ThemeProvider 提供主题
render(
  <ThemeProvider theme={UI_THEME}>
    <Example />
  </ThemeProvider>,
  root
);
