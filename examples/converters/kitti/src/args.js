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
// 导入 argparse 模块用于解析命令行参数
const {ArgumentParser} = require('argparse');

// 创建 ArgumentParser 对象，添加帮助和描述信息
const parser = new ArgumentParser({
  addHelp: true,
  description: 'KITTI to XVIZ converter'
});

// 添加命令行参数 -d 和 --data-directory，用于指定原始 KITTI 数据的路径
parser.addArgument(['-d', '--data-directory'], {
  required: true,
  help: 'Path to raw KITTI data.'
});

// 添加命令行参数 -o 和 --output，用于指定生成数据的路径
parser.addArgument(['-o', '--output'], {
  required: true,
  help: 'Path to generated data.'
});

// 添加可选参数 --json，用于指定生成 JSON 格式的 XVIZ 输出
parser.addArgument('--json', {
  action: 'storeTrue',
  help: 'Generate JSON XVIZ output instead of the GLB file format'
});

// 添加可选参数 --protobuf，用于指定生成 Protobuf 格式的 XVIZ 输出
parser.addArgument('--protobuf', {
  action: 'storeTrue',
  help: 'Generate Protobuf XVIZ output instead of the GLB file file format'
});

// 添加可选参数 --disable-streams，用于指定禁用的流（逗号分隔的流名称）
parser.addArgument(['--disable-streams'], {
  defaultValue: '',
  help: 'Comma separated stream names to disable'
});

// 添加可选参数 --message-limit，用于限制生成的 XVIZ 消息数量
parser.addArgument(['--message-limit'], {
  defaultValue: Number.MAX_SAFE_INTEGER,
  help: 'Limit XVIZ message generation to this value. Useful for testing conversion quickly'
});

// 添加可选参数 --image-max-width，用于指定图像的最大宽度
parser.addArgument(['--image-max-width'], {
  defaultValue: 400,
  help: 'Image max width'
});

// 添加可选参数 --image-max-height，用于指定图像的最大高度
parser.addArgument(['--image-max-height'], {
  defaultValue: 300,
  help: 'Image max height'
});

// 添加可选参数 --fake-streams，用于生成用于测试的虚假数据流
parser.addArgument('--fake-streams', {
  action: 'storeTrue',
  help: 'Generate fake streams with random data for testing'
});

// 提取用户输入的参数并导出
module.exports = function getArgs() {
  const args = parser.parseArgs();
  const inputDir = args.data_directory;
  const outputDir = args.output;

  console.log(inputDir, outputDir); // 打印输入和输出目录
  const disabledStreams = args.disable_streams.split(',').filter(Boolean);
  return {
    inputDir,
    outputDir,
    disabledStreams,
    fakeStreams: args.fake_streams,
    imageMaxWidth: Number(args.image_max_width),
    imageMaxHeight: Number(args.image_max_height),
    messageLimit: Number(args.message_limit),
    writeJson: Number(args.json),
    writeProtobuf: Number(args.protobuf)
  };
};
