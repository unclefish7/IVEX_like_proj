# 在构建过程中可能遇到的问题

- nodejs版本最好用18.17
- 在安装 `sharp`这个依赖的时候可能会遇到问题（也可能需要手动安装），根据报错信息去修改一下源代码
- 要使用旧版本的openssl算法，添加以下环境变量 `export NODE_OPTIONS=--openssl-legacy-provider`。
- 如果给的脚本无法正常下载数据集，就手动下
- 之后只要路径没错应该能正确转换kitti的数据集
