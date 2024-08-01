/* global window */
import React, {PureComponent} from 'react';
import {XVIZPanel} from 'streetscape.gl'; // 引入 XVIZ 面板组件
import {FloatPanel} from '@streetscape.gl/monochrome'; // 引入可浮动面板组件

import {XVIZ_PANEL_STYLE, FLOAT_PANEL_STYLE} from './custom-styles'; // 引入自定义样式

const TITLE_HEIGHT = 28; // 定义标题栏的高度

export default class CameraPanel extends PureComponent {
  // 初始化状态
  state = {
    panelState: {
      x: window.innerWidth - 420, // 面板初始 X 坐标
      y: 20, // 面板初始 Y 坐标
      width: 400, // 面板初始宽度
      height: 148, // 面板初始高度
      minimized: false // 面板是否最小化
    }
  };

  // 组件接收新属性时调用
  componentWillReceiveProps(nextProps) {
    const {panelState} = this.state;
    // 如果视频宽高比发生变化，更新面板高度
    if (this.props.videoAspectRatio !== nextProps.videoAspectRatio) {
      this.setState({
        panelState: {
          ...panelState,
          height: panelState.width / nextProps.videoAspectRatio + TITLE_HEIGHT
        }
      });
    }
  }

  // 更新面板状态的方法
  _onUpdate = panelState => {
    const {videoAspectRatio} = this.props;
    // 更新面板状态，包括根据视频宽高比调整高度
    this.setState({
      panelState: {
        ...panelState,
        height: panelState.width / videoAspectRatio + TITLE_HEIGHT
      }
    });
  };

  render() {
    const {log} = this.props; // 从属性中获取日志数据
    const {panelState} = this.state; // 从状态中获取面板状态

    return (
      <FloatPanel
        {...panelState} // 传递面板状态
        movable={true} // 面板是否可移动
        minimizable={false} // 面板是否可最小化
        resizable={true} // 面板是否可调整大小
        onUpdate={this._onUpdate} // 面板更新时的回调
        style={FLOAT_PANEL_STYLE} // 面板样式
      >
        {/* XVIZ 面板组件，用于显示相机数据 */}
        <XVIZPanel log={log} name="Camera" style={XVIZ_PANEL_STYLE} />
      </FloatPanel>
    );
  }
}
