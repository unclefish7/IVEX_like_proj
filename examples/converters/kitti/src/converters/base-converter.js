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
import fs from 'fs';
import path from 'path';
import {getTimestamps} from '../parsers/common';

export default class BaseConverter {
  constructor(rootDir, streamDir) {
    // 初始化根目录和数据流目录
    this.rootDir = rootDir;
    this.streamDir = path.join(this.rootDir, streamDir);
    this.dataDir = path.join(this.streamDir, 'data');
  }

  load() {
    // 加载并排序数据文件名
    this.fileNames = fs.readdirSync(this.dataDir).sort();

    // 加载时间戳表
    const timeFilePath = path.join(this.streamDir, 'timestamps.txt');
    this.timestamps = getTimestamps(timeFilePath);
  }

  async loadMessage(messageNumber) {
    // 加载指定消息编号的数据
    const fileName = this.fileNames[messageNumber];
    const srcFilePath = path.join(this.dataDir, fileName);
    const data = fs.readFileSync(srcFilePath);

    // 获取时间戳
    const timestamp = this.timestamps[messageNumber];

    return {data, timestamp};
  }
}
