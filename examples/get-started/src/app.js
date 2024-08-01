// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/* global document, console */
/* eslint-disable no-console, no-unused-vars, no-undef */

import React, {PureComponent} from 'react'; // 导入React库和PureComponent组件，用于创建React组件
import {render} from 'react-dom'; // 导入render方法，用于将React组件渲染到DOM中

import {setXVIZConfig, getXVIZConfig} from '@xviz/parser'; // 导入XVIZ解析器的配置方法
import {
  LogViewer, // 用于显示XVIZ日志数据的主要组件
  PlaybackControl, // 用于控制日志播放的组件
  StreamSettingsPanel, // 用于显示和设置流配置的组件
  MeterWidget, // 用于显示指标数据的组件
  TrafficLightWidget, // 用于显示交通灯状态的组件
  TurnSignalWidget, // 用于显示转向灯状态的组件
  XVIZPanel, // 用于显示XVIZ面板数据的组件
  VIEW_MODE // 用于定义视图模式的常量
} from 'streetscape.gl';
import {Form} from '@streetscape.gl/monochrome'; // 导入Form组件，用于创建表单

import {XVIZ_CONFIG, APP_SETTINGS, MAPBOX_TOKEN, MAP_STYLE, XVIZ_STYLE, CAR} from './constants'; // 导入常量配置

setXVIZConfig(XVIZ_CONFIG); // 设置XVIZ解析器的配置

const TIMEFORMAT_SCALE = getXVIZConfig().TIMESTAMP_FORMAT === 'seconds' ? 1000 : 1; // 根据时间戳格式设置时间缩放比例

// 根据不同的模式加载相应的XVIZ日志文件
const exampleLog = require(__IS_STREAMING__
  ? './log-from-stream' // 如果是流模式，加载log-from-stream
  : __IS_LIVE__
    ? './log-from-live' // 如果是实时模式，加载log-from-live
    : './log-from-file').default; // 否则，加载log-from-file

class Example extends PureComponent {
  state = {
    log: exampleLog, // 存储当前加载的XVIZ日志
    settings: {
      viewMode: 'PERSPECTIVE', // 设置初始视图模式为透视图
      showTooltip: false // 初始状态下不显示工具提示
    }
  };

  componentDidMount() {
    // 组件挂载完成后连接日志，并在发生错误时输出到控制台
    this.state.log.on('error', console.error).connect();
  }

  // 处理设置变化的方法，将新的设置合并到现有设置中
  _onSettingsChange = changedSettings => {
    this.setState({
      settings: {...this.state.settings, ...changedSettings}
    });
  };

  render() {
    const {log, settings} = this.state;

    return (
      <div id="container">
        <div id="control-panel">
          <XVIZPanel log={log} name="Metrics" /> {/* 显示Metrics数据的XVIZ面板 */}
          <hr />
          <XVIZPanel log={log} name="Camera" /> {/* 显示Camera数据的XVIZ面板 */}
          <hr />
          <Form
            data={APP_SETTINGS} // 表单数据
            values={this.state.settings} // 当前设置
            onChange={this._onSettingsChange} // 设置变化处理方法
          />
          <StreamSettingsPanel log={log} /> {/* 显示流设置面板 */}
        </div>
        <div id="log-panel">
          <div id="map-view">
            <LogViewer
              log={log} // 日志数据
              mapboxApiAccessToken={MAPBOX_TOKEN} // Mapbox令牌
              mapStyle={MAP_STYLE} // 地图样式
              car={CAR} // 汽车模型
              xvizStyles={XVIZ_STYLE} // XVIZ样式
              showTooltip={settings.showTooltip} // 工具提示显示状态
              viewMode={VIEW_MODE[settings.viewMode]} // 视图模式
            />
            <div id="hud">
              <TurnSignalWidget log={log} streamName="/vehicle/turn_signal" /> {/* 显示转向灯状态 */}
              <hr />
              <TrafficLightWidget log={log} streamName="/vehicle/traffic_light" /> {/* 显示交通灯状态 */}
              <hr />
              <MeterWidget
                log={log} // 日志数据
                streamName="/vehicle/acceleration" // 加速度数据流
                label="Acceleration" // 标签
                min={-4} // 最小值
                max={4} // 最大值
              />
              <hr />
              <MeterWidget
                log={log} // 日志数据
                streamName="/vehicle/velocity" // 速度数据流
                label="Speed" // 标签
                getWarning={x => (x > 6 ? 'FAST' : '')} // 警告条件
                min={0} // 最小值
                max={20} // 最大值
              />
            </div>
          </div>
          <div id="timeline">
            <PlaybackControl
              width="100%" // 控件宽度
              log={log} // 日志数据
              formatTimestamp={x => new Date(x * TIMEFORMAT_SCALE).toUTCString()} // 格式化时间戳
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<Example />, document.getElementById('app')); // 将Example组件渲染到id为'app'的HTML元素中
