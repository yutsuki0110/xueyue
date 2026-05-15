# 雪月 Fragment Region v0.1 正式图包

这是雪月 Fragment Map 的 **region 区域级真实场景碎片图包**。

## 内容

```text
fragments/
  grassland.webp
  forest.webp
  mountain.webp
  coast.webp
  desert.webp
  snow.webp
  swamp.webp
  volcano.webp
  ruins.webp

backgrounds/
  mist_sea_dark.webp

preview/
  region_v0_1_preview.jpg
  region_v0_1_asset_sheet.jpg

samples/
  sample_mapinit_fragment_region.txt
```

## 层级定位

后续雪月地图只保留三层：

```text
world    世界级
country  国家级
region   区域级
```

本图包只负责 `region` 区域级地点碎片。

## 关于 unknown

`unknown` 不再作为场景资源。  
未知 / 锁定 / 隐藏地点由脚本遮罩处理：

```text
CSS 黑雾遮罩 + 问号 + ？？？标签
```

这样地点揭晓时只需要撤掉遮罩，不需要替换图片资源。

## GitHub 上传建议

把整个目录上传到仓库根目录：

```text
xueyue_fragment_region_v0_1/
```

上传后 CDN 路径：

```text
https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@main/xueyue_fragment_region_v0_1/fragments
```
