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
import path from 'path';

import {XVIZBuilder, XVIZMetadataBuilder} from '@xviz/builder';
import {getTimestamps, createDir} from '../parsers/common';
import GPSConverter from './gps-converter';
import LidarConverter from './lidar-converter';
import TrackletsConverter from './tracklets-converter';
import FutureTrackletsConverter from './future-tracklets-converter';
import CameraConverter from './camera-converter';
import RandomDataGenerator from './random-data-generator';
import {getDeclarativeUI} from './declarative-ui';

export class KittiConverter {
  constructor(inputDir, outputDir, {disabledStreams, fakeStreams, imageMaxWidth, imageMaxHeight}) {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    this.disabledStreams = disabledStreams;
    this.fakeStreams = fakeStreams;
    this.imageOptions = {
      maxWidth: imageMaxWidth,
      maxHeight: imageMaxHeight
    };

    this.numMessages = 0;
    this.metadata = null;
  }

  initialize() {
    const timestampsFilePath = path.resolve(this.inputDir, 'oxts', 'timestamps.txt');
    this.timestamps = getTimestamps(timestampsFilePath);

    createDir(this.outputDir);

    this.numMessages = this.timestamps.length;

    // 这些是各种数据源的转换器
    const gpsConverter = new GPSConverter(this.inputDir, 'oxts');

    // 按顺序添加转换器，因为某些数据源需要依赖其他数据源的协调
    this.converters = [
      gpsConverter,
      new TrackletsConverter(this.inputDir, () => gpsConverter.getPoses()),
      new LidarConverter(this.inputDir, 'velodyne_points', {disabledStreams: this.disabledStreams}),
      new CameraConverter(this.inputDir, {
        disabledStreams: this.disabledStreams,
        options: this.imageOptions
      }),
      new FutureTrackletsConverter(this.inputDir, () => gpsConverter.getPoses(), this.timestamps)
    ];

    if (this.fakeStreams) {
      this.converters.push(new RandomDataGenerator());
    }

    this.converters.forEach(converter => converter.load());

    this.metadata = this.getMetadata();
  }

  messageCount() {
    return this.numMessages;
  }

  async convertMessage(messageNumber) {
    const xvizBuilder = new XVIZBuilder({
      metadata: this.metadata,
      disabledStreams: this.disabledStreams
    });

    // 确保每个转换器都完成转换，避免竞争条件
    for (let i = 0; i < this.converters.length; i++) {
      await this.converters[i].convertMessage(messageNumber, xvizBuilder);
    }

    return xvizBuilder.getMessage();
  }

  getMetadata() {
    const xb = new XVIZMetadataBuilder();
    xb.startTime(this.timestamps[0]).endTime(this.timestamps[this.timestamps.length - 1]);

    this.converters.forEach(converter => converter.getMetadata(xb));
    xb.ui(getDeclarativeUI({fakeStreams: this.fakeStreams}));

    xb.logInfo({
      description: 'Conversion of KITTI data set into XVIZ',
      license: 'CC BY-NC-SA 3.0',
      'license link':
        '<a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">http://creativecommons.org/licenses/by-nc-sa/3.0/</a>',
      uri: '<a href="https://github.com/uber/xviz-data">https://github.com/uber/xviz-data</a>',
      source: {
        title: 'Vision meets Robotics: The KITTI Dataset',
        author: 'Andreas Geiger and Philip Lenz and Christoph Stiller and Raquel Urtasun',
        link:
          '<a href="http://www.cvlibs.net/datasets/kitti/raw_data.php">http://www.cvlibs.net/datasets/kitti/raw_data.php</a>',
        copyright:
          'All datasets and benchmarks on <a href="http://www.cvlibs.net/datasets/kitti">this page</a> are copyright by us and published under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License. This means that you must attribute the work in the manner specified by the authors, you may not use this work for commercial purposes and if you alter, transform, or build upon this work, you may distribute the resulting work only under the same license.'
      }
    });

    return xb.getMetadata();
  }
}
