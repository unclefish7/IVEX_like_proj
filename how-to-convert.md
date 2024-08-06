# 如何将数据集转换为XVIZ格式

## 省流

- 先用XVIZMetaBuiler写入元数据
- 用XVIZUIBuiler写入UI数据
- 用XVIZBuiler写入数据

## XVIZ Converter比较重要的数据类型

### 1. 输入数据

- **原始数据路径（data-directory）**：指定原始数据集的路径。
- **生成数据路径（output）**：指定生成的XVIZ数据路径。

### 2. 命令行参数解析
- **ArgumentParser**：用于解析命令行参数，指定输入输出路径、禁用的数据流、生成数据格式（JSON或Protobuf）、图像的最大宽度和高度等。

### 3. 数据转换器（Converters）
每个转换器负责处理特定类型的数据，例如GPS数据、激光雷达数据、图像数据等。
- **GPSConverter**：处理GPS数据，生成车辆的位置信息。
- **LidarConverter**：处理激光雷达数据，生成点云数据。
- **ImageConverter**：处理图像数据，生成图像帧。

### 4. 数据流定义

- **流名称（stream names）**：例如，/vehicle/acceleration, /vehicle/velocity等。
- **XVIZMetadataBuilder**：用于定义数据流的类型、类别和样式等信息。

### 5. 声明式UI定义

- **XVIZUIBuilder**：用于定义用户界面的布局和元素。
- **getDeclarativeUI**：根据不同数据流定义UI面板和元素，例如指标面板、视频面板、绘图面板和表格面板。

### 6. 元数据生成
- **getMetadata**：定义并添加数据流、样式和其他元数据，确保所有数据能正确展示和解释。

### 7. 数据处理与转换
- **convertMessage**：每个转换器根据消息编号处理并生成对应的数据，通过XVIZBuilder生成XVIZ格式的数据。

### 8. 数据写入
- **XVIZBinaryWriter**：将数据写入GLB格式。
- **XVIZJSONWriter**：将数据写入JSON格式。

### 9. 数据解析
- **parseStreamMessage**：解析XVIZ数据，处理GLB或其他格式的数据，返回“修补”后的JSON结构。

通过以上这些关键数据类型和逻辑顺序，可以有效地将不同类型的数据集转换为XVIZ格式，以便于在可视化工具中进行展示和分析。

## 输入参数

在 XVIZ 转换器中，输入参数主要通过命令行参数和配置文件进行传递。这些参数由 `args.js` 文件中的 `ArgumentParser` 进行解析。主要的输入参数包括：

1. **data-directory (-d, --data-directory)**: 指定原始数据集的路径，这是必须的参数。
   ```bash
   -d /path/to/kitti/data
   ```

2. **output (-o, --output)**: 指定生成的 XVIZ 数据存储路径，这是必须的参数。
   ```bash
   -o /path/to/output
   ```

3. **json (--json)**: 是否生成 JSON 格式的 XVIZ 输出。
   ```bash
   --json
   ```

4. **protobuf (--protobuf)**: 是否生成 Protobuf 格式的 XVIZ 输出。
   ```bash
   --protobuf
   ```

5. **disable-streams (--disable-streams)**: 禁用特定的数据流，用逗号分隔流名称。
   ```bash
   --disable-streams stream1,stream2
   ```

6. **message-limit (--message-limit)**: 限制生成的 XVIZ 消息数量，通常用于测试。
   ```bash
   --message-limit 100
   ```

7. **image-max-width (--image-max-width)**: 指定图像的最大宽度。
   ```bash
   --image-max-width 800
   ```

8. **image-max-height (--image-max-height)**: 指定图像的最大高度。
   ```bash
   --image-max-height 600
   ```

9. **fake-streams (--fake-streams)**: 生成用于测试的虚假数据流。
   ```bash
   --fake-streams
   ```

### 示例命令
以下是一个使用上述参数的示例命令：
```bash
node src/index.js -d /path/to/kitti/data -o /path/to/output --json --disable-streams stream1,stream2 --message-limit 100 --image-max-width 800 --image-max-height 600 --fake-streams
```

通过这些参数，用户可以灵活地配置和控制数据转换的行为。

## 数据流

### MetaData

XVIZ的元数据（metadata）用于定义数据流的类型、类别和样式等信息。元数据帮助确保数据的一致性，并且在查看器中具有自动行为。元数据通常包括以下几类信息：

1. **流定义**：
   - 定义数据流的名称、类别和数据类型。
   - 例如，定义一个用于显示车辆位置的数据流。

2. **样式信息**：
   - 定义数据流的视觉样式，如颜色、宽度等。
   - 例如，定义一个多边形数据流的填充颜色和边框颜色。

3. **UI定义**：
   - 定义数据流在用户界面中的展示方式。
   - 例如，定义一个面板用于显示特定数据流的图表或表格。

#### XVIZMetadataBuilder的作用

XVIZMetadataBuilder用于构建和管理这些元数据。它提供了一个流利的API来收集和定义元数据，确保所有相关信息都集中在一个地方，便于查找和修改。

#### getMetadata的作用

getMetadata函数通常在转换器中调用，用于向XVIZMetadataBuilder添加数据流、样式和其他元数据。每个转换器都会定义自己特定的数据流和相关元数据，以确保所有生成的数据都能正确展示和解释。

通过定义元数据，可以确保数据流在不同的转换器和查看器中都能以一致的方式展示，并且能够支持丰富的用户界面交互。

```javascript
 getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream(this.streamName)
      .category('primitive')
      .type('image');
  }
```

## 数据处理与转换

数据会先由解析器（parser）进行解析与读取。再被移交给转换器（converter），使用XVIZBuilder构建最终的数据结构。

### 以图像数据为例

```javascript
// 调整图像尺寸，保持宽高比
export async function resizeImage(filePath, maxWidth, maxHeight) {
  const metadata = await getImageMetadata(filePath);
  const {width, height} = metadata;

  let imageData = null;
  const {resizeWidth, resizeHeight} = getResizeDimension(width, height, maxWidth, maxHeight);

  if (resizeWidth === width && resizeHeight === height) {
    imageData = fs.readFileSync(filePath);
  } else {
    imageData = await sharp(filePath)
      .resize(resizeWidth, resizeHeight)
      .toBuffer()
      .then(data => data);
  }

  return {
    width: resizeWidth,
    height: resizeHeight,
    data: imageData
  };
}

async loadMessage(messageNumber) {
    // 加载指定消息编号的数据
    const fileName = this.fileNames[messageNumber];
    const {maxWidth, maxHeight} = this.options;
    const srcFilePath = path.join(this.dataDir, fileName);
    const {data, width, height} = await resizeImage(srcFilePath, maxWidth, maxHeight);

    // 获取时间戳
    const timestamp = this.timestamps[messageNumber];

    return {data, timestamp, width, height};
}

async convertMessage(messageNumber, xvizBuilder) {
    const {data, width, height} = await this.loadMessage(messageNumber);

    xvizBuilder
        .primitive(this.streamName)
        .image(nodeBufferToTypedArray(data), 'png')
        .dimensions(width, height);
}

```

## XVIZBuilder

`XVIZBuilder` 提供了多种 API 用于构建和生成 XVIZ 数据结构。以下是一些常用的 API 及其功能简介：

1. **pose(stream_id)**: 创建一个位姿数据流，用于描述车辆或传感器的位置信息。
   - `timestamp(time)`: 设置时间戳。
   - `mapOrigin(longitude, latitude, altitude)`: 设置地图原点。
   - `position(x, y, z)`: 设置位置信息。
   - `orientation(roll, pitch, yaw)`: 设置方向信息。

2. **timeSeries(stream_id)**: 创建一个时间序列数据流，用于描述随时间变化的数据。
   - `timestamp(time)`: 设置时间戳。
   - `value(val)`: 设置时间序列的值。

3. **primitive(stream_id)**: 创建一个原始数据流，用于描述几何图形、点云等数据。
   - `polyline(points)`: 定义一条折线。
   - `points(points)`: 定义点云数据。
   - `circle(center, radius)`: 定义一个圆形。

4. **timeSeries(stream_id)**: 创建时间序列数据流。
   - `timestamp(time)`: 设置时间戳。
   - `value(val)`: 设置时间序列的值。

5. **UI Components**:
   - `uiPrimitive(stream_id)`: 创建 UI 数据流，如图像、视频等。
   - `video(cameras)`: 定义视频流。
   - `plot(options)`: 创建绘图面板。
   - `metric(options)`: 创建指标面板。
   - `treetable(options)`: 创建表格面板。

6. **getMessage()**: 获取构建的 XVIZ 消息，用于输出。

### 示例
以下是一个简单示例，展示如何使用 `XVIZBuilder` 构建车辆位姿和加速度数据流：

```javascript
const {XVIZBuilder} = require('@xviz/builder');

const xvizBuilder = new XVIZBuilder();

// 定义车辆位姿数据流
xvizBuilder
  .pose('/vehicle_pose')
  .timestamp(Date.now() / 1000)
  .mapOrigin(37.7749, -122.4194)
  .position(0, 0, 0)
  .orientation(0, 0, 0);

// 定义加速度数据流
xvizBuilder
  .timeSeries('/vehicle/acceleration')
  .timestamp(Date.now() / 1000)
  .value(1.2);

// 获取 XVIZ 消息
const xvizData = xvizBuilder.getMessage();
console.log(xvizData);
```

通过这些 API，用户可以方便地创建和管理各种类型的数据流，从而构建出丰富的 XVIZ 数据结构，用于后续的可视化和分析。

## xvizUIBuider

`XVIZUIBuilder` 是用于构建 XVIZ 声明式 UI 的类，它提供了一种流畅的 API，用于构建面板、图表、视频等 UI 组件。其主要作用是通过定义一系列 UI 元素及其布局，帮助开发者在可视化应用中展示数据。

### 用法示例

1. **创建 XVIZUIBuilder 实例**
   ```javascript
   import {XVIZUIBuilder} from '@xviz/builder';
   const builder = new XVIZUIBuilder({});
   ```

2. **添加 UI 组件**
   ```javascript
   // 添加一个指标面板
   const metricsPanel = builder.panel({name: 'Metrics'});
   const accelerationMetric = builder.metric({
     title: 'Acceleration',
     streams: ['/vehicle/acceleration'],
     description: 'The acceleration of the vehicle'
   });
   metricsPanel.child(accelerationMetric);
   builder.child(metricsPanel);
   ```

3. **生成 UI 定义**
   ```javascript
   const uiDefinition = builder.getUI();
   ```

### `XVIZUIBuilder` 方法

- **panel(options)**: 创建一个面板。
  - `options`: 包含面板名称等信息的对象。
  - 返回 `XVIZPanelBuilder` 实例。

- **metric(options)**: 创建一个指标组件。
  - `options`: 包含指标名称、数据流等信息的对象。
  - 返回 `XVIZMetricBuilder` 实例。

- **video(options)**: 创建一个视频组件。
  - `options`: 包含摄像头数据流等信息的对象。
  - 返回 `XVIZVideoBuilder` 实例。

- **plot(options)**: 创建一个绘图组件。
  - `options`: 包含绘图标题、数据流等信息的对象。
  - 返回 `XVIZPlotBuilder` 实例。

- **treetable(options)**: 创建一个树形表格组件。
  - `options`: 包含表格标题、数据流等信息的对象。
  - 返回 `XVIZTreeTableBuilder` 实例。

这些方法帮助开发者构建复杂的 UI 布局，并将其应用于数据可视化中，使得不同类型的数据可以以直观的方式展示。

更多详细信息可以参考 [XVIZ UI Builder 文档](https://github.com/aurora-opensource/xviz/blob/master/docs/api-reference/xviz-ui-builder.md)。

