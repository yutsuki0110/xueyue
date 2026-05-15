# 雪月 Lux V2 Base v0.1

这是第一版可测试基础地形包，用于 SillyTavern 地图脚本实测。

## 规格

- 风格：平面化手绘六边地图块
- 成品尺寸：280×208
- 命名：简化命名
- 用途：先测试显示、大小、路径线、marker 与整体地图观感

## base 文件

```text
base/grassland.webp
base/forest.webp
base/mountain.webp
base/coast.webp
base/desert.webp
base/snow.webp
```

## 旧命名兼容

```text
legacy/grassland_base.webp
legacy/forest_base.webp
legacy/mountain_base.webp
legacy/coast_base.webp
legacy/desert_base.webp
legacy/snow_base.webp
```

## 推荐字段

```json
{"terrain": "grassland"}
```

对应：

```text
base/grassland.webp
```

## 注意

这是 v0.1 试用包，不是最终正式精修包。  
snow 当前从概念图中提取，后续需要单独生成正式版。
