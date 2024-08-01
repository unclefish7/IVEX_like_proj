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
import {XVIZStreamLoader} from 'streetscape.gl'; // 从streetscape.gl导入XVIZStreamLoader模块，用于从流加载XVIZ数据

export default new XVIZStreamLoader({
  logGuid: 'mock', // 日志的唯一标识符，这里使用'mock'作为示例
  // bufferLength: 15, // 缓冲区长度，指定缓存的帧数（注释掉了）
  
  // 服务器配置
  serverConfig: {
    defaultLogLength: 30, // 默认日志长度
    serverUrl: 'ws://localhost:8081' // 服务器的WebSocket URL
  },
  
  worker: true, // 启用Web Worker以提高加载性能
  maxConcurrency: 4 // 设置最大并发数，限制同时加载的文件数量
});
// 创建并导出一个新的XVIZStreamLoader实例，用于从指定的流加载XVIZ数据
