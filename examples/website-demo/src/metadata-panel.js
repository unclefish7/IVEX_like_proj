import React, {PureComponent} from 'react';
import {connectToLog} from 'streetscape.gl'; // 引入 Streetscape 的连接日志组件
import {Dropdown} from '@streetscape.gl/monochrome'; // 引入单色调库中的下拉菜单组件
import {LOGS} from './constants'; // 引入日志常量

// 从 HTML 中提取链接的函数
function extractLink(html) {
  const match = html.match(/href="(.*?)"/);
  return match && match[1];
}

class MetadataPanel extends PureComponent {
  // 渲染日志选择器
  _renderLogSelector() {
    const {selectedLog} = this.props; // 从属性中获取选中的日志

    // 将日志常量转换为下拉菜单的数据格式
    const logs = LOGS.reduce((resMap, log) => {
      resMap[log.name] = log.name;
      return resMap;
    }, {});

    return (
      <div>
        <Dropdown
          value={selectedLog.name} // 下拉菜单当前选中的值
          data={logs} // 下拉菜单的数据
          onChange={value => this.props.onLogChange(LOGS.find(log => log.name === value))} // 当选择改变时的回调函数
        />
      </div>
    );
  }

  render() {
    const {metadata} = this.props; // 从属性中获取元数据

    if (!metadata) {
      return null; // 如果没有元数据，返回 null
    }

    const hasLicenseInfo = metadata.log_info.source; // 判断是否有许可信息

    return (
      <div id="log-info">
        <h4>Select Demo Log</h4> {/* 选择演示日志标题 */}
        {this._renderLogSelector()} {/* 渲染日志选择器 */}

        <h4>XVIZ Version</h4> {/* XVIZ 版本标题 */}
        <div>{metadata.version}</div> {/* 显示 XVIZ 版本 */}

        <h4>Log Start Time</h4> {/* 日志开始时间标题 */}
        <div>{new Date(metadata.start_time * 1000).toJSON()}</div> {/* 显示日志开始时间 */}

        <h4>Log End Time</h4> {/* 日志结束时间标题 */}
        <div>{new Date(metadata.end_time * 1000).toJSON()}</div> {/* 显示日志结束时间 */}

        {hasLicenseInfo && ( /* 如果有许可信息，显示以下内容 */
          <div>
            <h4>Demo Description</h4> {/* 演示描述标题 */}
            <div>
              <p>{metadata.log_info.description}</p> {/* 显示描述 */}
              <p>
                <a href={extractLink(metadata.log_info['license link'])}>
                  {metadata.log_info.license} {/* 显示许可链接 */}
                </a>
              </p>
            </div>

            <h4>Data Source</h4> {/* 数据源标题 */}
            <div>
              <p>
                <a href={extractLink(metadata.log_info.source.link)}>
                  {metadata.log_info.source.title} {/* 显示数据源标题 */}
                </a>
              </p>
              <p>{metadata.log_info.source.author}</p> {/* 显示作者 */}
              <p dangerouslySetInnerHTML={{__html: metadata.log_info.source.copyright}} /> {/* 显示版权信息 */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

// 获取日志状态的函数
const getLogState = log => ({
  metadata: log.getMetadata() // 获取日志的元数据
});

// 连接日志组件并导出
export default connectToLog({getLogState, Component: MetadataPanel});
