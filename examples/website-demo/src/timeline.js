/* global document */
import React, {PureComponent} from 'react';
import {PlaybackControl} from 'streetscape.gl'; // 引入 Streetscape 的播放控制组件

import {PLAYBACK_CONTROL_STYLE} from './custom-styles'; // 引入自定义样式

// 格式化时间戳
const formatTimestamp = x => new Date(x * 1000).toUTCString();

export default class Timeline extends PureComponent {
  state = {
    isPlaying: false // 初始化播放状态为 false
  };

  // 组件挂载后添加键盘事件监听器
  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown);
  }

  // 组件卸载前移除键盘事件监听器
  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

  // 跳转到指定时间的方法
  _seek(delta) {
    const {log} = this.props;
    const startTime = log.getLogStartTime(); // 获取日志开始时间
    const endTime = log.getLogEndTime(); // 获取日志结束时间
    let timestamp = log.getCurrentTime(); // 获取当前时间

    if (Number.isFinite(timestamp)) {
      timestamp += delta; // 调整时间
      if (timestamp < startTime) {
        timestamp = startTime; // 限制在开始时间之前
      }
      if (timestamp > endTime) {
        timestamp = endTime; // 限制在结束时间之后
      }
      log.seek(timestamp); // 跳转到调整后的时间
    }
  }

  // 播放事件处理
  _onPlay = () => this.setState({isPlaying: true});
  // 暂停事件处理
  _onPause = () => this.setState({isPlaying: false});

  // 键盘事件处理
  _onKeyDown = evt => {
    switch (evt.keyCode) {
      case 32: // 空格键
        if (this.state.isPlaying) {
          this._onPause(); // 如果正在播放，则暂停
        } else {
          this._onPlay(); // 如果暂停，则播放
        }
        break;

      case 37: // 左箭头键
        this._seek(-0.1); // 后退 0.1 秒
        break;

      case 39: // 右箭头键
        this._seek(0.1); // 前进 0.1 秒
        break;

      default:
    }
  };

  render() {
    const {log} = this.props; // 从属性中获取日志数据
    const {isPlaying} = this.state; // 从状态中获取播放状态

    return (
      <div id="timeline">
        <PlaybackControl
          compact={true} // 使用紧凑模式
          style={PLAYBACK_CONTROL_STYLE} // 应用自定义样式
          isPlaying={isPlaying} // 当前播放状态
          onPlay={this._onPlay} // 播放事件处理函数
          onPause={this._onPause} // 暂停事件处理函数
          onSeek={this._onSeek} // 跳转事件处理函数
          width="100%" // 控件宽度
          log={log} // 日志数据
          formatTimestamp={formatTimestamp} // 格式化时间戳的函数
        />
      </div>
    );
  }
}
