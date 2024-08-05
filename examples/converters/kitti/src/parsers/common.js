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
/* global Buffer */
import assert from 'assert';
import fs from 'fs';
import path from 'path';

// 读取并解析时间戳文件，返回时间戳数组
export function getTimestamps(timestampsFilePath) {
  const content = fs.readFileSync(timestampsFilePath, 'utf8');
  const lines = content.split('\n').filter(Boolean);

  const timestamps = lines.map(line => {
    // 将时间戳转换为UNIX时间戳
    const unix = Date.parse(`${line} GMT`) / 1000;
    return unix;
  });

  return timestamps;
}

// 创建目录及其父目录（如果不存在）
export function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    const parent = path.dirname(dirPath);
    createDir(parent);
    fs.mkdirSync(dirPath);
  }
}

// 递归删除目录及其所有内容
export function deleteDirRecursive(parentDir) {
  const files = fs.readdirSync(parentDir);
  files.forEach(file => {
    const currPath = path.join(parentDir, file);
    if (fs.lstatSync(currPath).isDirectory()) {
      deleteDirRecursive(currPath);
    } else {
      fs.unlinkSync(currPath);
    }
  });
  fs.rmdirSync(parentDir);
}

// 将ArrayBuffer转换为Buffer
export function toBuffer(ab) {
  assert(ab instanceof ArrayBuffer);
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

// 将Buffer转换为ArrayBuffer
export function toArrayBuffer(buf) {
  assert(buf instanceof Buffer);
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
