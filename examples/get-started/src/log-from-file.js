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
import {XVIZFileLoader} from 'streetscape.gl'; // 从streetscape.gl导入XVIZFileLoader模块，用于从文件加载XVIZ数据

export default new XVIZFileLoader({
  // 指定时间文件路径，用于描述各帧之间的时间关系
  timingsFilePath: 'https://raw.githubusercontent.com/uber/xviz-data/master/kitti/2011_09_26_drive_0005_sync/0-frame.json',
  
  // 指定获取每帧数据文件路径的方法
  // 这里使用模板字符串和箭头函数，根据索引返回对应的文件路径
  getFilePath: index =>
    `https://raw.githubusercontent.com/uber/xviz-data/master/kitti/2011_09_26_drive_0005_sync/${index + 1}-frame.glb`,
  
  worker: true, // 启用Web Worker以提高加载性能
  maxConcurrency: 4 // 设置最大并发数，限制同时加载的文件数量
});
// 创建并导出一个新的XVIZFileLoader实例，用于从指定的文件路径加载XVIZ数据
