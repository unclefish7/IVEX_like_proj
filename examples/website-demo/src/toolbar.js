/* global document */
import React, {PureComponent} from 'react';
import {Tooltip, Popover, Button} from '@streetscape.gl/monochrome'; // 引入单色调库中的工具提示、弹出框和按钮组件

import {TOOLTIP_STYLE, TOOLBAR_MENU_STYLE, TOOLBAR_BUTTON_STYLE} from './custom-styles'; // 引入自定义样式

// 定义视图模式
const VIEW_MODE = {
  TOP_DOWN: {desc: 'Top down (T)', icon: 'top'}, // 顶视图模式
  PERSPECTIVE: {desc: 'Perspective (P)', icon: 'perspective'}, // 透视视图模式
  DRIVER: {desc: 'Driver (D)', icon: 'driver'} // 驾驶员视图模式
};

const noop = () => {}; // 空函数

export default class Toolbar extends PureComponent {
  // 组件挂载后添加键盘事件监听器
  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown);
  }

  // 组件卸载前移除键盘事件监听器
  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

  // 键盘事件处理
  _onKeyDown = evt => {
    const key = String.fromCharCode(evt.keyCode);

    switch (key) {
      case 'T':
        this._gotoViewMode('TOP_DOWN'); // 切换到顶视图模式
        break;

      case 'P':
        this._gotoViewMode('PERSPECTIVE'); // 切换到透视视图模式
        break;

      case 'D':
        this._gotoViewMode('DRIVER'); // 切换到驾驶员视图模式
        break;

      case 'R':
        this._resetView(); // 重置视图
        break;

      case 'I':
        this._toggleTooltip(!this.props.settings.showTooltip); // 切换工具提示显示状态
        break;

      default:
    }
  };

  // 切换视图模式
  _gotoViewMode = viewMode => {
    this.props.onSettingsChange({viewMode});
  };

  // 重置视图
  _resetView = () => {
    this.props.onSettingsChange({viewOffset: {x: 0, y: 0, bearing: 0}});
  };

  // 切换工具提示显示状态
  _toggleTooltip = showTooltip => {
    this.props.onSettingsChange({showTooltip});
  };

  // 渲染视图按钮
  _renderViewButton(mode, opts = {}) {
    const {
      tooltip = VIEW_MODE[mode].desc,
      position = Popover.TOP,
      onClick = () => this._gotoViewMode(mode)
    } = opts;
    const isSelected = mode === this.props.settings.viewMode;

    return (
      <Tooltip key={mode} content={tooltip} position={position} style={TOOLTIP_STYLE}>
        <Button type={Button.MUTED} style={TOOLBAR_BUTTON_STYLE} onClick={onClick}>
          <i className={`icon-camera_${VIEW_MODE[mode].icon} ${isSelected ? 'selected' : ''}`}>
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
          </i>
        </Button>
      </Tooltip>
    );
  }

  // 渲染视图模式选择器
  _renderViewModeSelector = () => {
    return (
      <div className="menu">{Object.keys(VIEW_MODE).map(item => this._renderViewButton(item))}</div>
    );
  };

  render() {
    const {settings} = this.props; // 从属性中获取设置

    return (
      <div id="toolbar">
        <Popover
          content={this._renderViewModeSelector} // 渲染视图模式选择器
          trigger={Popover.CLICK}
          arrowSize={0}
          style={TOOLBAR_MENU_STYLE}
        >
          {this._renderViewButton(settings.viewMode, {
            tooltip: 'Camera',
            position: Popover.LEFT,
            onClick: noop
          })}
        </Popover>
        <Tooltip content="Recenter Camera (R)" position={Popover.LEFT} style={TOOLTIP_STYLE}>
          <Button type={Button.MUTED} style={TOOLBAR_BUTTON_STYLE} onClick={this._resetView}>
            <i className="icon-recenter" />
          </Button>
        </Tooltip>
        <Tooltip content="Get Info (I)" position={Popover.LEFT} style={TOOLTIP_STYLE}>
          <Button
            type={Button.MUTED}
            style={TOOLBAR_BUTTON_STYLE}
            className={settings.showTooltip ? 'active' : ''}
            onClick={() => this._toggleTooltip(!settings.showTooltip)}
          >
            <i className="icon-select" />
          </Button>
        </Tooltip>
      </div>
    );
  }
}
