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
/**
 * 解析GPS/IMU数据（存储在oxts目录中），提取车辆的姿态、速度和加速度信息
 */

// 根据dataformat.txt文件定义的OxtsPacket字段
const OxtsPacket = [
  'lat', 'lon', 'alt', 'roll', 'pitch', 'yaw',
  'vn', 've', 'vf', 'vl', 'vu', 'ax', 'ay', 'az',
  'af', 'al', 'au', 'wx', 'wy', 'wz', 'wf', 'wl',
  'wu', 'pos_accuracy', 'vel_accuracy', 'navstat',
  'numsats', 'posmode', 'velmode', 'orimode'
];

// 将OXTS数据行解析为对象
function getOxtsPacket(oxtsLine) {
  const res = OxtsPacket.reduce((resMap, key, i) => {
    resMap[key] = oxtsLine[i];
    return resMap;
  }, {});

  return res;
}

// 解析OXTS文件内容
export function loadOxtsPackets(content) {
  // 读取OXTS地面真实数据。姿态在东-北-上的坐标系中给出，
  // 其原点是第一个GPS位置。
  const values = content.split(' ').filter(Boolean);
  // TODO: 应该验证字段数量
  return getOxtsPacket(values);
}
