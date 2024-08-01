### 项目总体框架

这个 `streetscape.gl` 项目主要用于可视化自动驾驶和机器人系统的数据。以下是项目的总体框架概述：

1. **数据集转换和准备**

   - 将原始数据集转换为 XVIZ 格式。
   - 确保数据集的结构与项目中预期的一致。
2. **目录结构**

   - `src/` 目录包含所有的前端代码，包括组件和样式。
   - `dist/` 目录用于存放构建后的静态文件。
   - `xviz-data/` 目录存放 XVIZ 格式的数据集。
3. **主要组件**

   - **`MapView`**：显示 3D 地图和对象。
   - **`ControlPanel`**：包含日志选择和流设置的控制面板。
   - **`HUD`**：显示汽车状态和仪表盘的头部显示组件。
   - **`Timeline`**：控制播放和时间导航的时间轴组件。
   - **`Toolbar`**：包含视图模式和工具提示切换按钮的工具栏。
   - **`CameraPanel`**：显示摄像头视图的摄像头面板。
4. **数据加载和配置**

   - 在 `constants.js` 中配置数据集路径和其他参数。
   - 使用 `XVIZFileLoader` 从本地或远程路径加载 XVIZ 数据。
5. **前端框架**

   - 使用 React 进行组件开发。
   - 使用 `streetscape.gl` 和 `@streetscape.gl/monochrome` 提供的组件进行可视化。
   - 使用 `webpack` 进行模块打包和开发服务器配置。
6. **本地开发和构建**

   - 使用 `yarn start-local` 启动本地开发服务器。
   - 使用 `yarn build` 进行生产环境构建。

通过这些步骤和组件，项目实现了从数据集加载、处理到前端展示的完整流程，能够有效地进行自动驾驶和机器人系统数据的可视化。

在 `website-demo` 项目中，React 和 Webpack 扮演了重要角色，用于实现高效的开发和构建流程。以下是它们的具体作用及核心代码的解释：

### React 的作用

React 是用于构建用户界面的 JavaScript 库。它使开发者可以用组件的方式构建复杂的 UI。这些组件可以独立管理自己的状态和生命周期。

#### 核心代码示例

**`src/app.js`**

`app.js` 是项目的主要入口文件，负责初始化应用程序并渲染根组件。

```javascript
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {setXVIZConfig} from '@xviz/parser';
import {XVIZFileLoader} from 'streetscape.gl';
import {ThemeProvider} from '@streetscape.gl/monochrome';

import ControlPanel from './control-panel';
import CameraPanel from './camera-panel';
import MapView from './map-view';
import Timeline from './timeline';
import Toolbar from './toolbar';
import HUD from './hud';
import NotificationPanel from './notification-panel';
import isMobile from './is-mobile';

import {LOGS, MOBILE_NOTIFICATION} from './constants';
import {UI_THEME} from './custom-styles';

import './stylesheets/main.scss';

class Example extends PureComponent {
  state = {
    ...(!isMobile && this._loadLog(LOGS[0])),
    settings: {
      viewMode: 'PERSPECTIVE',
      showTooltip: false
    }
  };

  _loadLog(logSettings) {
    if (logSettings.xvizConfig) {
      setXVIZConfig(logSettings.xvizConfig);
    }

    const loader = new XVIZFileLoader({
      timingsFilePath: `${logSettings.path}/0-frame.json`,
      getFilePath: index => `${logSettings.path}/${index + 1}-frame.glb`,
      worker: true,
      maxConcurrency: 4
    })
      .on('ready', () => loader.updateStreamSettings({ '/tracklets/label': false }))
      .on('error', console.error);

    loader.connect();

    return {selectedLog: logSettings, log: loader};
  }

  _onLogChange = selectedLog => {
    this.state.log.close();
    this.setState(this._loadLog(selectedLog));
  };

  _onSettingsChange = changedSettings => {
    this.setState({ settings: { ...this.state.settings, ...changedSettings } });
  };

  render() {
    if (isMobile) {
      return <NotificationPanel notification={MOBILE_NOTIFICATION} />;
    }

    const {log, selectedLog, settings} = this.state;

    return (
      <div id="container">
        <MapView log={log} settings={settings} onSettingsChange={this._onSettingsChange} />
        <ControlPanel selectedLog={selectedLog} onLogChange={this._onLogChange} log={log} />
        <HUD log={log} />
        <Timeline log={log} />
        <Toolbar settings={settings} onSettingsChange={this._onSettingsChange} />
        <CameraPanel log={log} videoAspectRatio={selectedLog.videoAspectRatio} />
      </div>
    );
  }
}

const root = document.createElement('div');
document.body.appendChild(root);

render(
  <ThemeProvider theme={UI_THEME}>
    <Example />
  </ThemeProvider>,
  root
);
```

**作用：**

1. **初始化应用程序**：`Example` 组件是应用程序的根组件，负责加载日志数据并将其传递给子组件。
2. **渲染 UI**：使用 `render` 方法将 `Example` 组件渲染到 DOM 中的根节点。

### Webpack 的作用

Webpack 是一个模块打包工具，它将多个模块打包成一个或多个优化的输出文件。在这个项目中，Webpack 用于处理 JavaScript、CSS 和其他静态资源，并提供开发服务器支持。

#### 核心代码示例

**`webpack.config.js`**

```javascript
/* eslint-disable no-process-env */
const {resolve} = require('path');
const webpack = require('webpack');

// Babel 配置，用于编译 ES2015 和 React 代码
const BABEL_CONFIG = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/proposal-class-properties']
};

// Webpack 配置
const CONFIG = {
  entry: {
    app: resolve('./src/app.js') // 入口文件
  },

  output: {
    path: resolve('./dist'), // 输出目录
    filename: 'bundle.js' // 输出文件名
  },

  module: {
    noParse: /(mapbox-gl)\.js$/, // 不解析 mapbox-gl.js 文件
    rules: [
      {
        // 使用 Babel 编译 ES2015 和 React 代码
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: BABEL_CONFIG
      },
      {
        // 处理 CSS 和 SCSS 文件
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader' // 将 CSS 插入到 DOM 中
          },
          {
            loader: 'css-loader' // 解析 CSS 文件
          },
          {
            loader: 'sass-loader', // 编译 SCSS 文件
            options: {
              includePaths: ['./node_modules', '.']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热模块替换插件
    new webpack.EnvironmentPlugin(['MapboxAccessToken']) // 环境变量插件
  ]
};

module.exports = env => {
  const config = Object.assign({}, CONFIG);

  if (env.prod) {
    // 生产环境配置
    Object.assign(config, {
      mode: 'production'
    });

    config.plugins = config.plugins.concat(
      new webpack.DefinePlugin({
        LOG_DIR: JSON.stringify('https://raw.githubusercontent.com/uber/xviz-data/master') // 定义 LOG_DIR 为生产环境的 URL
      })
    );
  } else {
    // 开发环境配置
    Object.assign(config, {
      mode: 'development',
      devServer: {
        contentBase: [
          resolve(__dirname, '../../website/src/static'), // 网站静态资源目录
          resolve(__dirname, '../../../xviz-data'), // XVIZ 数据目录
          resolve(__dirname) // 当前目录
        ]
      },
      devtool: 'source-map' // 开启源码映射
    });

    config.module.rules = config.module.rules.concat({
      // 使用 source-map-loader 加载源映射
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre'
    });

    config.plugins = config.plugins.concat(
      new webpack.DefinePlugin({
        LOG_DIR: JSON.stringify('.') // 定义 LOG_DIR 为当前目录
      })
    );
  }
  return require('../webpack.config.local')(config)(env); // 返回本地配置
};
```

**作用：**

1. **模块打包**：指定入口文件 `app.js`，将所有依赖打包到 `bundle.js`。
2. **资源处理**：使用加载器（loader）处理 JavaScript、CSS 和 SCSS 文件。
3. **开发支持**：配置 `devServer` 提供开发服务器支持，实现热模块替换（HMR）和源码映射（source-map）。
4. **环境区分**：根据环境（开发或生产）加载不同的配置。

### 更改成自己的数据集

1. **准备数据集**

   将你自己的数据集转换为 XVIZ 格式。参考 [XVIZ examples](https://github.com/uber/xviz/tree/master/examples/converters) 中的转换器示例。
2. **放置数据集**

   将转换后的数据集放在一个新的目录中，例如 `my-xviz-data`，确保数据集的结构与 `xviz-data` 相同。
3. **修改 `webpack.config.js`**

   更新 `webpack.config.js` 中的 `contentBase` 配置，指向你自己的数据集目录：

   ```javascript
   devServer: {
     contentBase: [
       resolve(__dirname, '../../website/src/static'), // 网站静态资源目录
       resolve(__dirname, '../../../my-xviz-data'), // 修改为你的数据目录
       resolve(__dirname) // 当前目录
     ]
   }
   ```
4. **更新数据集路径**

   在 `constants.js` 中更新 `LOGS` 配置，指向你自己的数据集路径：

   ```javascript
   export const LOGS = [
     {
       name: 'MyDataset-0001',
       path: `${LOG_DIR}/mydataset/scene-0001`,
       xvizConfig: {
         TIME_WINDOW: 0.4
       },
       videoAspectRatio: 16 / 9
     }
     // 你可以添加更多的数据集配置
   ];
   ```

通过以上步骤，你可以将项目更改为使用你自己的数据集进行可视化。

### 以下是各个组件的对应关系：

1. **Info Tab（信息标签）**：

   - **组件**：`MetadataPanel`
   - **功能**：显示数据集的元数据信息，如XVIZ版本、日志开始和结束时间、数据来源等。
   - **对应代码**：`src/metadata-panel.js`
   - **显示内容**：数据集信息（如XVIZ版本、日志时间、数据来源等）。
2. **Streams Tab（数据流标签）**：

   - **组件**：`StreamSettingsPanel`
   - **功能**：显示和管理数据流设置，用户可以选择不同的数据流进行可视化。
   - **对应代码**：`src/control-panel.js` 中的 `StreamSettingsPanel`
   - **显示内容**：各种数据流的复选框，如/vehicle_pose、/lidar/points等。
3. **Charts Tab（图表标签）**：

   - **组件**：`XVIZPanel`
   - **功能**：显示各种传感器数据的图表，如加速度、速度、方向盘角度等。
   - **对应代码**：`src/control-panel.js` 中的 `XVIZPanel`
   - **显示内容**：加速度、速度、方向盘角度等图表。
4. **3D 场景渲染**：

   - **组件**：`LogViewer`
   - **功能**：主要的3D可视化组件，渲染点云、物体检测框、轨迹等。
   - **对应代码**：`src/map-view.js`
   - **显示内容**：3D场景，包括点云数据、物体标注等。
5. **右上角的摄像头视图**：

   - **组件**：`XVIZPanel`
   - **功能**：显示摄像头视图。
   - **对应代码**：`src/camera-panel.js`
   - **显示内容**：摄像头的实时视图。
6. **HUD（仪表盘）**：

   - **组件**：`HUD`
   - **功能**：显示车辆状态信息，如自动驾驶状态、转向信号、加速度、速度、方向盘角度等。
   - **对应代码**：`src/hud.js`
   - **显示内容**：自动驾驶状态、转向信号、加速度、速度、方向盘角度等。
7. **Timeline（时间轴）**：

   - **组件**：`PlaybackControl`
   - **功能**：控制回放的时间轴，用户可以播放、暂停、快进、快退。
   - **对应代码**：`src/timeline.js`
   - **显示内容**：时间轴，播放、暂停、快进、快退控制按钮。
8. **Toolbar（工具栏）**：

   - **组件**：`Toolbar`
   - **功能**：提供相机视角切换、重置视角、显示/隐藏提示信息等功能。
   - **对应代码**：`src/toolbar.js`
   - **显示内容**：相机视角切换按钮（顶部视角、透视视角、驾驶员视角）、重置视角按钮、显示/隐藏提示信息按钮。

通过这些组件，`streetscape.gl` 可以实现高效的数据可视化和交互。使用这些组件，你可以方便地配置不同的数据流和视图，以便从不同角度分析和理解数据集。
