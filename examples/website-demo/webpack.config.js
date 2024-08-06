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
          resolve(__dirname, '../../../myDataSets'), // XVIZ 数据目录
          //resolve(__dirname, './output'), // 自己生成的数据目录
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
