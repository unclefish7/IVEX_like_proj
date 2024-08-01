
### 1. 整体架构

`streetscape.gl` 的 `get-started` 示例是一个用于展示 XVIZ 日志数据的前端应用程序，主要包括以下模块：

1. **数据加载模块**：负责从本地文件或流媒体服务器加载 XVIZ 数据。
2. **数据处理和配置模块**：负责设置 XVIZ 配置和样式。
3. **前端展示模块**：负责在浏览器中渲染数据，并提供交互界面。

### 2. 主要模块

#### 2.1 数据加载模块

**log-from-file.js**：

```javascript
import {XVIZFileLoader} from 'streetscape.gl';

// 创建一个 XVIZFileLoader 实例，用于从本地文件加载 XVIZ 数据
export default new XVIZFileLoader({
  // 指定包含时间信息的 JSON 文件路径
  timingsFilePath: 'path_to_your_data/0-frame.json',
  // 获取每个帧的文件路径
  getFilePath: index => `path_to_your_data/${index + 1}-frame.glb`,
  // 使用 Web Worker 进行并发加载
  worker: true,
  // 最大并发请求数
  maxConcurrency: 4
});
```

**log-from-live.js**：

```javascript
import {XVIZLiveLoader} from 'streetscape.gl';

// 创建一个 XVIZLiveLoader 实例，用于从实时服务器加载 XVIZ 数据
export default new XVIZLiveLoader({
  logGuid: 'mock', // 日志 GUID
  bufferLength: 10, // 缓冲区长度
  serverConfig: {
    defaultLogLength: 30, // 默认日志长度
    serverUrl: 'ws://your_server_url' // WebSocket 服务器 URL
  },
  worker: true,
  maxConcurrency: 4
});
```

**log-from-stream.js**：

```javascript
import {XVIZStreamLoader} from 'streetscape.gl';

// 创建一个 XVIZStreamLoader 实例，用于从流媒体服务器加载 XVIZ 数据
export default new XVIZStreamLoader({
  logGuid: 'mock',
  serverConfig: {
    defaultLogLength: 30,
    serverUrl: 'ws://your_server_url'
  },
  worker: true,
  maxConcurrency: 4
});
```

#### 2.2 数据处理和配置模块

**constants.js**：

```javascript
import {CarMesh} from 'streetscape.gl';

/* eslint-disable camelcase */
export const MAPBOX_TOKEN = process.env.MapboxAccessToken; // 从环境变量中读取 Mapbox 访问令牌

export const MAP_STYLE = 'mapbox://styles/mapbox/light-v9'; // Mapbox 样式

export const XVIZ_CONFIG = {
  PLAYBACK_FRAME_RATE: 10 // XVIZ 播放帧率
};

export const CAR = CarMesh.sedan({ // 定义汽车模型的参数
  origin: [1.08, -0.32, 0],
  length: 4.3,
  width: 2.2,
  height: 1.5,
  color: [160, 160, 160]
});

export const APP_SETTINGS = { // 应用程序设置
  viewMode: {
    type: 'select',
    title: 'View Mode',
    data: {TOP_DOWN: 'Top Down', PERSPECTIVE: 'Perspective', DRIVER: 'Driver'}
  },
  showTooltip: {
    type: 'toggle',
    title: 'Show Tooltip'
  }
};

export const XVIZ_STYLE = { // XVIZ 样式设置
  '/tracklets/objects': [{name: 'selected', style: {fill_color: '#ff8000aa'}}],
  '/lidar/points': [{style: {point_color_mode: 'elevation'}}]
};
```

#### 2.3 前端展示模块

**app.js**：

```javascript
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import {setXVIZConfig, getXVIZConfig} from '@xviz/parser';
import {
  LogViewer,
  PlaybackControl,
  StreamSettingsPanel,
  MeterWidget,
  TrafficLightWidget,
  TurnSignalWidget,
  XVIZPanel,
  VIEW_MODE
} from 'streetscape.gl';
import {Form} from '@streetscape.gl/monochrome';

import {XVIZ_CONFIG, APP_SETTINGS, MAPBOX_TOKEN, MAP_STYLE, XVIZ_STYLE, CAR} from './constants';

// 设置 XVIZ 配置
setXVIZConfig(XVIZ_CONFIG);

const TIMEFORMAT_SCALE = getXVIZConfig().TIMESTAMP_FORMAT === 'seconds' ? 1000 : 1;

// 根据环境变量选择数据加载器
const exampleLog = require('./log-from-file').default; // 可以修改为 './log-from-stream' 或 './log-from-live'

class Example extends PureComponent {
  state = {
    log: exampleLog, // 日志数据加载器
    settings: {
      viewMode: 'PERSPECTIVE', // 视图模式
      showTooltip: false // 是否显示工具提示
    }
  };

  componentDidMount() {
    // 连接数据加载器并处理错误
    this.state.log.on('error', console.error).connect();
  }

  _onSettingsChange = changedSettings => {
    // 更新设置状态
    this.setState({
      settings: {...this.state.settings, ...changedSettings}
    });
  };

  render() {
    const {log, settings} = this.state;

    return (
      <div id="container">
        <div id="control-panel">
          <XVIZPanel log={log} name="Metrics" /> {/* 显示 Metrics 数据 */}
          <hr />
          <XVIZPanel log={log} name="Camera" /> {/* 显示 Camera 数据 */}
          <hr />
          <Form
            data={APP_SETTINGS} // 表单数据
            values={this.state.settings} // 当前设置值
            onChange={this._onSettingsChange} // 设置变化处理方法
          />
          <StreamSettingsPanel log={log} /> {/* 显示流设置面板 */}
        </div>
        <div id="log-panel">
          <div id="map-view">
            <LogViewer
              log={log} // 日志数据
              mapboxApiAccessToken={MAPBOX_TOKEN} // Mapbox 访问令牌
              mapStyle={MAP_STYLE} // 地图样式
              car={CAR} // 汽车模型
              xvizStyles={XVIZ_STYLE} // XVIZ 样式
              showTooltip={settings.showTooltip} // 是否显示工具提示
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
                getWarning={x => (x > 6 ? 'FAST' : '')} // 获取警告状态
                min={0} // 最小值
                max={20} // 最大值
              />
            </div>
          </div>
          <div id="timeline">
            <PlaybackControl
              width="100%" // 宽度
              log={log} // 日志数据
              formatTimestamp={x => new Date(x * TIMEFORMAT_SCALE).toUTCString()} // 格式化时间戳
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<Example />, document.getElementById('app')); // 渲染主组件到 DOM 中
```

### 3. 如何获取数据

数据加载模块负责从不同来源加载 XVIZ 数据：

- **log-from-file.js**：从本地文件加载 XVIZ 数据。
- **log-from-live.js**：从实时服务器加载 XVIZ 数据。
- **log-from-stream.js**：从流媒体服务器加载 XVIZ 数据。

### 4. 前端如何展示信息

前端展示模块通过 `LogViewer` 组件展示 3D 场景和数据，通过 `PlaybackControl` 组件提供播放控制，通过 `XVIZPanel` 组件展示特定的数据流，通过小部件（如 `MeterWidget`, `TurnSignalWidget`, `TrafficLightWidget`）展示特定车辆状态和传感器数据。

### 5. 总体框架

- **数据加载模块**：负责从不同来源加载 XVIZ 数据。
- **数据处理和配置模块**：设置 XVIZ 配置和样式。
- **前端展示模块**：渲染数据并提供交互界面。

通过这些模块的协作，`streetscape.gl` 的 `get-started` 示例能够加载和展示 XVIZ 数据，实现交互式的 3D 数据可视化。如果你有任何问题或需要进一步的帮助，请告诉我。