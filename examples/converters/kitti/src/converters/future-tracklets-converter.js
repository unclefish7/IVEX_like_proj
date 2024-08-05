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
import {
  _getRelativeCoordinates as getRelativeCoordinates,
  _getGeospatialToPoseTransform as getGeospatialToPoseTransform
} from '@xviz/builder';

import {loadTracklets} from '../parsers/parse-tracklets';

const FUTURE_STEPS = 100; // 10 seconds

// FutureTrackletsConverter使用已知的轨迹对象数据生成"未来"数据（即预测数据），以演示它们如何在XVIZ中生成。
export default class FutureTrackletsConverter {
  constructor(directory, getPoses, ts) {
    this.rootDir = directory;
    this.trackletFile = path.join(directory, 'tracklet_labels.xml');
    this.getPoses = getPoses;
    this.ts = ts;

    // 激光扫描仪相对于GPS的位置
    this.FIXTURE_TRANSFORM_POSE = {
      x: 0.81,
      y: -0.32,
      z: 1.73
    };

    this.TRACKLETS_FUTURES = '/tracklets/objects/futures';
  }

  load() {
    if (!fs.existsSync(this.trackletFile)) {
      this.trackletFile = null;
      return;
    }

    const xml = fs.readFileSync(this.trackletFile, 'utf8');
    this.data = loadTracklets(xml);

    this.frameStart = this.data.objects.reduce(
      (minFrame, obj) => Math.min(minFrame, obj.firstFrame),
      Number.MAX_SAFE_INTEGER
    );

    this.frameLimit = this.data.objects.reduce(
      (maxFrame, obj) => Math.max(maxFrame, obj.lastFrame),
      0
    );

    if (this.frameStart > this.frameLimit) {
      throw new Error('Invalid frame range');
    }

    this.poses = this.getPoses();
  }

  async convertMessage(messageNumber, xvizBuilder) {
    if (!this.trackletFile) {
      return;
    }

    if (messageNumber < this.frameStart || messageNumber >= this.frameLimit) {
      return;
    }

    const futureFrameLimit = Math.min(messageNumber + FUTURE_STEPS, this.frameLimit);

    for (let i = messageNumber; i < futureFrameLimit; i++) {
      const tracklets = this._convertTrackletsFutureMessage(messageNumber, i);

      tracklets.forEach(tracklet => {
        const future_ts = this.ts[i];
        xvizBuilder
          .futureInstance(this.TRACKLETS_FUTURES, future_ts)
          .polygon(tracklet.vertices)
          .classes([tracklet.objectType])
          .id(tracklet.id);
      });
    }
  }

  getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream(this.TRACKLETS_FUTURES)
      .category('future_instance')
      .type('polygon')
      .streamStyle({
        stroke_width: 0.1,
        extruded: false,
        fill_color: '#00000080'
      })
      .styleClass('Car', {
        fill_color: '#50B3FF80',
        stroke_color: '#50B3FF'
      })
      .styleClass('Cyclist', {
        fill_color: '#957FCE80',
        stroke_color: '#957FCE'
      })
      .styleClass('Pedestrian', {
        fill_color: '#FFC6AF80',
        stroke_color: '#FFC6AF'
      })
      .styleClass('Van', {
        fill_color: '#5B91F480',
        stroke_color: '#5B91F4'
      })
      .styleClass('Unknown', {
        fill_color: '#E2E2E280',
        stroke_color: '#E2E2E2'
      })
      .coordinate('VEHICLE_RELATIVE')
      .pose(this.FIXTURE_TRANSFORM_POSE);
  }

  // 为当前帧创建代表未来帧的轨迹数据
  _convertTrackletsFutureMessage(currentFrameIndex, futureFrameIndex) {
    return (
      this.data.objects
        // 确保对象在当前帧和未来帧中存在
        .filter(
          object => currentFrameIndex >= object.firstFrame && futureFrameIndex < object.lastFrame
        )
        .map(object => {
          const currentVehiclePose = this.poses[currentFrameIndex].pose;
          const futureVehiclePose = this.poses[futureFrameIndex].pose;

          // 返回从未来车辆姿态转换到当前车辆姿态的变换矩阵
          const transform = getGeospatialToPoseTransform(futureVehiclePose, currentVehiclePose);

          // 这是相对于未来车辆姿态的轨迹位置
          const futurePoseIndex = futureFrameIndex - object.firstFrame;
          const pose = this._makePoseShape(object.data.poses.item[futurePoseIndex]);

          // 翻译未来位置
          const v = transform.transform([pose.x, pose.y, pose.z]);
          pose.x = v[0];
          pose.y = v[1];
          pose.z = v[2];
          // 更新对象的相对姿态
          pose.yaw -= currentVehiclePose.yaw - futureVehiclePose.yaw;

          const vertices = getRelativeCoordinates(object.bounds, pose);

          return {
            ...object,
            ...pose,
            vertices
          };
        })
    );
  }

  _makePoseShape(trackletPose) {
    return {
      x: Number(trackletPose.tx),
      y: Number(trackletPose.ty),
      z: Number(trackletPose.tz),
      roll: Number(trackletPose.rx),
      pitch: Number(trackletPose.ry),
      yaw: Number(trackletPose.rz)
    };
  }
}
