import React, {PureComponent} from 'react';
import {Tooltip, Button} from '@streetscape.gl/monochrome';

import {TOOLTIP_STYLE, HELP_BUTTON_STYLE} from './custom-styles'; // 引入自定义样式

export default class HelpPanel extends PureComponent {
  // 静态方法：渲染帮助按钮
  static renderButton(props) {
    return (
      <Tooltip content="Help" style={TOOLTIP_STYLE}> {/* 工具提示，内容为 "Help" */}
        <Button type={Button.MUTED} style={HELP_BUTTON_STYLE} {...props}> {/* 按钮类型为 MUTED，应用自定义样式 */}
          <i className={props.isOpen ? 'icon-close' : 'icon-help'} /> {/* 根据 isOpen 属性切换图标 */}
        </Button>
      </Tooltip>
    );
  }

  render() {
    return (
      <div id="help">
        <table>
          <tbody>
            {/* 3D Navigation 部分 */}
            <tr>
              <td>
                <h4>3D Navigation</h4> {/* 标题 */}
              </td>
            </tr>
            <tr>
              <td>Pan</td> {/* 平移 */}
              <td>Mouse Left</td> {/* 鼠标左键 */}
            </tr>
            <tr>
              <td>Rotate</td> {/* 旋转 */}
              <td>Mouse Right</td> {/* 鼠标右键 */}
            </tr>
            <tr>
              <td />
              <td>Shift + Mouse Left</td> {/* Shift + 鼠标左键 */}
            </tr>
            <tr>
              <td>Top-down Camera</td> {/* 顶视图相机 */}
              <td>T</td> {/* 按键 T */}
            </tr>
            <tr>
              <td>Perspective Camera</td> {/* 透视相机 */}
              <td>P</td> {/* 按键 P */}
            </tr>
            <tr>
              <td>Driver Camera</td> {/* 驾驶员相机 */}
              <td>D</td> {/* 按键 D */}
            </tr>
            <tr>
              <td>Recenter Camera</td> {/* 重新对准相机 */}
              <td>R</td> {/* 按键 R */}
            </tr>

            {/* Interaction 部分 */}
            <tr>
              <td>
                <h4>Interaction</h4> {/* 标题 */}
              </td>
            </tr>
            <tr>
              <td>Select 3D Object</td> {/* 选择 3D 对象 */}
              <td>Click</td> {/* 点击 */}
            </tr>
            <tr>
              <td>Show/Hide Tooltip</td> {/* 显示/隐藏工具提示 */}
              <td>I</td> {/* 按键 I */}
            </tr>

            {/* Playback 部分 */}
            <tr>
              <td>
                <h4>Playback</h4> {/* 标题 */}
              </td>
            </tr>
            <tr>
              <td>Play/Pause</td> {/* 播放/暂停 */}
              <td>Space</td> {/* 空格键 */}
            </tr>
            <tr>
              <td>Prev Frame</td> {/* 上一帧 */}
              <td>Left Arrow</td> {/* 左箭头键 */}
            </tr>
            <tr>
              <td>Next Frame</td> {/* 下一帧 */}
              <td>Right Arrow</td> {/* 右箭头键 */}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
