import React, {PureComponent} from 'react';
import {StreamSettingsPanel, XVIZPanel} from 'streetscape.gl';

import {XVIZ_PANEL_STYLE, STREAM_SETTINGS_STYLE} from './custom-styles';
import MetadataPanel from './metadata-panel';
import HelpPanel from './help-panel';

export default class ControlPanel extends PureComponent {
  state = {
    tab: 'streams' // 初始化选项卡为 'streams'
  };

  // 切换选项卡的方法
  _gotoTab(tab) {
    this.setState({tab, lastTab: this.state.tab}); // 设置当前选项卡并记录上一个选项卡
  }

  // 渲染选项卡内容的方法
  _renderTabContent() {
    const {log, selectedLog, onLogChange} = this.props; // 从属性中获取日志数据和选项卡变化处理方法

    // 根据当前选项卡渲染不同的内容
    switch (this.state.tab) {
      case 'streams':
        return <StreamSettingsPanel log={log} style={STREAM_SETTINGS_STYLE} />; // 流设置面板

      case 'charts':
        return (
          <XVIZPanel
            log={log}
            name="Metrics"
            style={XVIZ_PANEL_STYLE}
            componentProps={{
              metric: {getColor: '#ccc'} // 设置指标颜色
            }}
          />
        );

      case 'info':
        return <MetadataPanel log={log} selectedLog={selectedLog} onLogChange={onLogChange} />; // 元数据面板

      case 'help':
        return <HelpPanel />; // 帮助面板

      default:
        return null;
    }
  }

  // 渲染单个选项卡的方法
  _renderTab({id, description}) {
    const {tab} = this.state;

    return (
      <div className={`tab ${id === tab ? 'active' : ''}`} onClick={() => this._gotoTab(id)}>
        {id}
      </div>
    );
  }

  render() {
    const {tab} = this.state; // 获取当前选项卡

    const isHelpOpen = tab === 'help'; // 判断帮助面板是否打开

    return (
      <div id="control-panel">
        <header>
          <div id="logo">
            <a href="../index.html">
              <img src="assets/logo.png" alt="Logo" /> {/* 显示 logo 图片 */}
            </a>
          </div>
          <div id="help-btn">
            {HelpPanel.renderButton({
              isOpen: isHelpOpen,
              onClick: () => this._gotoTab(isHelpOpen ? this.state.lastTab : 'help') // 切换到帮助选项卡或返回上一个选项卡
            })}
          </div>
          {!isHelpOpen && (
            <div id="tabs">
              {this._renderTab({id: 'info', description: 'Log Info'})} 
              {this._renderTab({id: 'streams', description: 'Stream Settings'})} 
              {this._renderTab({id: 'charts', description: 'Charts'})} 
            </div>
          )}
        </header>

        <main>{this._renderTabContent()}</main> {/* 渲染选项卡内容 */}
      </div>
    );
  }
}
