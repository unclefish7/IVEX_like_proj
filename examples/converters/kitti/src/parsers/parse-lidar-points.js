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
import {Parser as BinaryParser} from 'binary-parser';

// 定义一个二进制解析器，用于解析浮点型小端字节序数据
const parser = new BinaryParser().floatle();

function readBinaryData(binary) {
  const res = [];
  for (let i = 0; i < binary.length; i = i + 4) {
    if (i + 4 > binary.length) {
      break;
    }
    const parsed = parser.parse(binary.slice(i, i + 4));
    res.push(parsed);
  }
  return res;
}

// 解析激光雷达数据
export function loadLidarData(data) {
  const binary = readBinaryData(data);
  const float = new Float32Array(binary);
  const size = Math.round(binary.length / 4);

  const positions = new Array(size);
  const colors = new Array(size);

  for (let i = 0; i < size; i++) {
    positions[i] = float.subarray(i * 4, i * 4 + 3);

    const reflectance = Math.min(float[i * 4 + 3], 3);
    colors[i] = [80 + reflectance * 80, reflectance * 80, reflectance * 60];
  }
  return {positions, colors};
}
