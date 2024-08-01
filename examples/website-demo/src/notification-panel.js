import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// 定义面板样式
const PANEL_STYLE = {
  display: 'flex', // 使用 flex 布局
  color: 'white', // 文本颜色为白色
  background: '#5B91F4', // 背景颜色
  flexDirection: 'column', // 子元素按列排列
  alignItems: 'center', // 子元素居中对齐
  width: '100%', // 宽度为 100%
  padding: '2px', // 内边距为 2px
  position: 'absolute', // 绝对定位
  zIndex: '10000', // z-index 为 10000
  boxSizing: 'border-box' // 使用 border-box 计算盒模型
};

export default class NotificationPanel extends PureComponent {
  // 定义属性类型
  static propTypes = {
    notification: PropTypes.object.isRequired // notification 属性是一个对象且是必需的
  };

  render() {
    return <div style={PANEL_STYLE}>{this.props.notification.message}</div>; // 渲染通知面板，显示通知消息
  }
}
