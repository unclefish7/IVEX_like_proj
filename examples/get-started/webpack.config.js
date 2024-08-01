// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/* eslint-disable no-process-env */ // 禁用ESLint规则，允许使用process.env
const {resolve} = require('path'); // 导入path模块，用于处理文件和目录路径
const webpack = require('webpack'); // 导入webpack模块

// Babel配置，用于编译ES2015和React代码
const BABEL_CONFIG = {
  presets: ['@babel/preset-env', '@babel/preset-react'], // 使用的Babel预设
  plugins: ['@babel/proposal-class-properties'] // 使用的Babel插件
};

// Webpack配置
const CONFIG = {
  mode: 'development', // 设置模式为开发模式
  entry: {
    app: resolve('./src/app.js') // 入口文件，定义应用程序的主文件
  },
  devtool: 'source-map', // 生成源映射文件，便于调试
  output: {
    path: resolve('./dist'), // 输出目录
    filename: 'bundle.js' // 输出文件名
  },
  module: {
    noParse: /(mapbox-gl)\.js$/, // 不解析mapbox-gl的JS文件，提高构建速度
    rules: [
      {
        // 使用babel-loader编译ES2015和React代码
        test: /\.js$/, // 匹配所有JS文件
        exclude: /node_modules/, // 排除node_modules目录
        loader: 'babel-loader', // 使用babel-loader进行编译
        options: BABEL_CONFIG // Babel配置
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热模块替换插件，用于在运行时更新各种模块，而无需进行完全刷新
    new webpack.EnvironmentPlugin(['MapboxAccessToken']) // 环境变量插件，用于定义环境变量
  ]
};

module.exports = (env = {}) => {
  let config = Object.assign({}, CONFIG); // 创建一个新的配置对象

  // 根据环境变量切换流加载和静态文件加载
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({__IS_STREAMING__: JSON.stringify(Boolean(env.stream))}), // 定义__IS_STREAMING__变量
    new webpack.DefinePlugin({__IS_LIVE__: JSON.stringify(Boolean(env.live))}) // 定义__IS_LIVE__变量
  ]);

  if (env.local) {
    // 启用本地配置，优先使用本地src目录中的文件，而不是安装的模块
    config = require('../webpack.config.local')(config)(env);
  }

  return config; // 返回最终配置
};
