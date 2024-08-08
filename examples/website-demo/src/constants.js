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
import {load} from '@loaders.gl/core'; // 引入加载器核心库
import {OBJLoader} from '@loaders.gl/obj'; // 引入 OBJ 加载器

/* eslint-disable camelcase */
// export const MAPBOX_TOKEN = "pk.eyJ1IjoidW5jbGVmaXNoNyIsImEiOiJjbHphbTI0bXkwOG5hMmtva3ZhY2V3d3VuIn0.9sDgCWGerQ5tFNBNjIqNXw"; // eslint-disable-line
// Mapbox 访问令牌，用于访问 Mapbox 地图服务
export const MAPBOX_TOKEN = ""; // eslint-disable-line
// Mapbox 访问令牌，用于访问 Mapbox 地图服务

export const MAP_STYLE = 'mapbox://styles/uberdata/cjfxhlikmaj1b2soyzevnywgs';
// Mapbox 地图样式 URL

// OBJ 模型的尺寸：宽 2073mm，长 4946mm
// 大众帕萨特的尺寸：宽 1820mm，长 4780mm
export const CAR = {
  mesh: load('./assets/car.obj', OBJLoader), // 加载汽车 OBJ 模型
  origin: [1.08, -0.32, 0], // 汽车模型的原点位置
  scale: 0.0009, // 汽车模型的缩放比例
  wireframe: true, // 是否显示线框
  color: [160, 160, 160] // 汽车模型的颜色
};

export const SETTINGS = {
  viewMode: {
    type: 'select', // 设置类型为选择框
    title: 'View Mode', // 设置标题
    data: {TOP_DOWN: 'Top Down', PERSPECTIVE: 'Perspective', DRIVER: 'Driver'} // 可选视图模式
  }
};

// LOG_DIR 在 webpack.config.js 中定义
/* eslint-disable no-undef */
export const LOGS = [
  {
    name: 'KITTI-0005', // 日志名称
    path: `${LOG_DIR}/kitti/2011_09_26_drive_0005_sync`, // 日志路径
    xvizConfig: {
      TIME_WINDOW: 0.4 // XVIZ 配置中的时间窗口
    },
    videoAspectRatio: 10 / 3 // 视频宽高比
  },
  // {
  //   name: 'nuTonomy-0006', // 日志名称
  //   path: `${LOG_DIR}/nutonomy/scene-0006`, // 日志路径
  //   xvizConfig: {
  //     TIME_WINDOW: 0.2, // XVIZ 配置中的时间窗口
  //     PLAYBACK_FRAME_RATE: 16 // XVIZ 播放帧率
  //   },
  //   videoAspectRatio: 16 / 9 // 视频宽高比
  // },
  // {
  //   name: 'KITTI-0001', // 日志名称
  //   path: `${LOG_DIR}/kitti/2011_09_26_drive_0001_sync/xviz`, // 日志路径
  //   xvizConfig: {
  //     TIME_WINDOW: 0.4 // XVIZ 配置中的时间窗口
  //   },
  //   videoAspectRatio: 10 / 3 // 视频宽高比
  // },
  // {
  //   name: 'KITTI-0037', // 日志名称
  //   path: `${LOG_DIR}/kitti/2011_09_28_drive_0037_sync/2011_09_28_drive_0037_sync`, // 日志路径
  //   xvizConfig: {
  //     TIME_WINDOW: 0.4 // XVIZ 配置中的时间窗口
  //   },
  //   videoAspectRatio: 10 / 3 // 视频宽高比
  // },
  // {
  //   name: 'nuScene', // 日志名称
  //   path: `${LOG_DIR}/nuScene/output/scene-0061`, // 日志路径
  //   xvizConfig: {
  //     TIME_WINDOW: 0.2, // XVIZ 配置中的时间窗口
  //     PLAYBACK_FRAME_RATE: 16 // XVIZ 播放帧率
  //   },
  //   videoAspectRatio: 16 / 9 // 视频宽高比
  // },
  // { // 示例代码不能解析json
  //   name: 'KITTI-0001-in-json', // 日志名称
  //   path: `${LOG_DIR}/kitti/2011_09_26_drive_0001_sync/xviz_json`, // 日志路径
  //   xvizConfig: {
  //     TIME_WINDOW: 0.4 // XVIZ 配置中的时间窗口
  //   },
  //   videoAspectRatio: 10 / 3 // 视频宽高比
  // },

];

export const MOBILE_NOTIFICATION = {
  id: 'mobile', // 通知 ID
  message: 'Streetscape.gl demo can not run on mobile devices.' // 通知消息
};
// 移动设备通知信息，提示 Streetscape.gl 演示无法在移动设备上运行
