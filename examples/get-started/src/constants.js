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
import {CarMesh} from 'streetscape.gl'; // 从streetscape.gl导入CarMesh模块，用于定义汽车模型

/* eslint-disable camelcase */
export const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
// 获取环境变量中的Mapbox访问令牌，用于加载Mapbox地图

export const MAP_STYLE = 'mapbox://styles/mapbox/light-v9';
// 定义Mapbox地图的样式，这里使用的是Mapbox提供的light-v9样式

export const XVIZ_CONFIG = {
  PLAYBACK_FRAME_RATE: 10
};
// 定义XVIZ配置项，这里设置回放帧率为10帧每秒

export const CAR = CarMesh.sedan({
  origin: [1.08, -0.32, 0], // 汽车模型的原点坐标
  length: 4.3, // 汽车模型的长度
  width: 2.2, // 汽车模型的宽度
  height: 1.5, // 汽车模型的高度
  color: [160, 160, 160] // 汽车模型的颜色
});
// 使用CarMesh.sedan方法定义了一辆轿车模型，并设置了原点、尺寸和颜色

export const APP_SETTINGS = {
  viewMode: {
    type: 'select', // 设置项类型为选择框
    title: 'View Mode', // 设置项标题
    data: {TOP_DOWN: 'Top Down', PERSPECTIVE: 'Perspective', DRIVER: 'Driver'} // 选项数据，包括俯视图、透视图和驾驶员视图
  },
  showTooltip: {
    type: 'toggle', // 设置项类型为切换开关
    title: 'Show Tooltip' // 设置项标题
  }
};
// 定义应用程序设置，这里包括视图模式选择和工具提示显示切换

export const XVIZ_STYLE = {
  '/tracklets/objects': [{name: 'selected', style: {fill_color: '#ff8000aa'}}], // 定义对象的样式，选中对象的填充颜色
  '/lidar/points': [{style: {point_color_mode: 'elevation'}}] // 定义激光雷达点云的样式，根据高度设置点颜色
};
// 定义XVIZ数据流的样式配置，设置不同数据流的显示样式
