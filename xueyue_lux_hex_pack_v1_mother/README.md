# 雪月 Lux Hex Pack V1 · Mother Tiles

这是 Lux 六边形地图图包的第一版母版资源包，用于 SillyTavern 雪月地图系统的文明式/4X 战略地图显示。

## 目录

- `terrain/`：基础地形地块。
- `landmarks/`：大型地标地块。
- `preview/`：预览图。
- `docs/sample_mapinit.txt`：测试地图标签。
- `manifest.json`：资源清单。

## 当前资源

### Terrain

- `grassland_a.webp`
- `forest_a.webp`
- `mountain_a.webp`
- `coast_a.webp`
- `desert_a.webp`
- `snow_a.webp`

### Landmarks

- `ruins.webp`
- `sect_gate.webp`
- `danger_zone.webp`
- `harbor.webp`

## CDN 用法

上传到 GitHub 后，建议目录：

```text
xueyue_lux_hex_pack_v1_mother/
├─ terrain/
├─ landmarks/
├─ preview/
└─ manifest.json
```

节点示例：

```json
{
  "name": "青霜草原",
  "type": "plain",
  "terrain": "grassland",
  "q": 0,
  "r": 0
}
```

重要地点示例：

```json
{
  "name": "旧宗门",
  "type": "sect",
  "terrain": "grassland",
  "landmarkKey": "sect_gate",
  "iconKey": "sect",
  "q": 1,
  "r": -1
}
```

## 注意

这是一版“母版审美测试包”。如果确认风格过关，再扩展 `grassland_b / forest_b / mountain_b` 等变体。
