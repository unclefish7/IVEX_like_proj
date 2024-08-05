// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 导入必要的模块
import {FileSink} from '@xviz/io/node';
import {XVIZBinaryWriter, XVIZJSONWriter, XVIZProtobufWriter} from '@xviz/io';
import {KittiConverter} from './converters';
import process from 'process';

module.exports = async function main(args) {
  // 从命令行参数中解析输入和输出目录等选项
  const {
    inputDir,
    outputDir,
    disabledStreams,
    fakeStreams,
    messageLimit,
    cameraSources,
    imageMaxWidth,
    imageMaxHeight,
    writeJson,
    writeProtobuf
  } = args;

  // 创建一个KittiConverter对象，用于处理数据转换
  const converter = new KittiConverter(inputDir, outputDir, {
    cameraSources,
    disabledStreams,
    fakeStreams,
    imageMaxWidth,
    imageMaxHeight
  });

  console.log(`Converting KITTI data at ${inputDir}`);
  console.log(`Saving to ${outputDir}`);

  // 初始化转换器
  converter.initialize();

  // 创建一个FileSink对象，用于管理输出文件
  const sink = new FileSink(outputDir);
  let xvizWriter = null;
  if (writeJson) {
    xvizWriter = new XVIZJSONWriter(sink);
  } else if (writeProtobuf) {
    xvizWriter = new XVIZProtobufWriter(sink);
  } else {
    xvizWriter = new XVIZBinaryWriter(sink);
  }

  // 写入元数据文件
  const xvizMetadata = converter.getMetadata();
  xvizWriter.writeMetadata(xvizMetadata);

  // 设置信号处理函数，以便在中断时写入索引文件
  signalWriteIndexOnInterrupt(xvizWriter);

  const start = Date.now();

  // 计算需要处理的消息数量
  const limit = Math.min(messageLimit, converter.messageCount());
  // 转换每个消息并写入文件
  for (let i = 0; i < limit; i++) {
    const xvizMessage = await converter.convertMessage(i);
    xvizWriter.writeMessage(i, xvizMessage);
  }

  // 关闭写入器
  xvizWriter.close();

  const end = Date.now();
  console.log(`Generate ${limit} messages in ${end - start}s`);
};

// 在接收到中断信号时，写入索引文件并退出
function signalWriteIndexOnInterrupt(writer) {
  process.on('SIGINT', () => {
    console.log('Aborting, writing index file.');
    writer.close();
    process.exit(0);
  });
}
