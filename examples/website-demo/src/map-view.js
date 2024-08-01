import React, {PureComponent} from 'react';
import {LogViewer, VIEW_MODE} from 'streetscape.gl'; // 引入 Streetscape 的日志查看器和视图模式

import {MAPBOX_TOKEN, MAP_STYLE, CAR} from './constants'; // 引入常量
import {XVIZ_STYLE, LOG_VIEWER_STYLE} from './custom-styles'; // 引入自定义样式

// 定义对象类型与图标的映射
const OBJECT_ICONS = {
  Car: 'car',
  Van: 'bus',
  Pedestrian: 'pedestrian',
  Cyclist: 'bike'
};

// 渲染对象标签的函数
const renderObjectLabel = ({id, object, isSelected}) => {
  const feature = object.getFeature('/tracklets/objects');

  if (!feature) {
    return isSelected && <b>{id}</b>; // 如果没有特征且被选中，显示对象 ID
  }

  const {classes} = feature.base;

  if (isSelected) {
    return (
      <div>
        <div>
          <b>{id}</b> {/* 显示对象 ID */}
        </div>
        <div>{classes.join(' ')}</div> {/* 显示对象类型 */}
      </div>
    );
  }

  const objectType = classes && classes.join('');
  if (objectType in OBJECT_ICONS) {
    return (
      <div>
        <i className={`icon-${OBJECT_ICONS[objectType]}`} /> {/* 显示对象图标 */}
      </div>
    );
  }

  return null; // 如果对象类型不在映射中，不显示标签
};

export default class MapView extends PureComponent {
  // 视图状态变化时的处理方法
  _onViewStateChange = ({viewOffset}) => {
    this.props.onSettingsChange({viewOffset}); // 更新设置中的视图偏移量
  };

  render() {
    const {log, settings} = this.props; // 从属性中获取日志数据和设置

    return (
      <LogViewer
        log={log} // 日志数据
        mapboxApiAccessToken={MAPBOX_TOKEN} // Mapbox 访问令牌
        mapStyle={MAP_STYLE} // 地图样式
        car={CAR} // 汽车模型
        xvizStyles={XVIZ_STYLE} // XVIZ 样式
        style={LOG_VIEWER_STYLE} // 日志查看器样式
        showTooltip={settings.showTooltip} // 是否显示工具提示
        viewMode={VIEW_MODE[settings.viewMode]} // 视图模式
        viewOffset={settings.viewOffset} // 视图偏移量
        onViewStateChange={this._onViewStateChange} // 视图状态变化处理方法
        renderObjectLabel={renderObjectLabel} // 渲染对象标签的函数
      />
    );
  }
}
