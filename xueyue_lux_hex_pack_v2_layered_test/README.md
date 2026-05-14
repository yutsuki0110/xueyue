# 雪月 Lux V2 Layered Test Pack

小格剧情地图分层测试包。用于 SillyTavern 雪月地图 v0.3.0。

## 目录
- `base/`：正规小六边形底板
- `transition/`：轻量边缘过渡
- `overlay/`：小型剧情地标符号，重要地点才用
- `marker/`：当前位置、选中、可前往、危险、未知等状态层

## CDN 设置示例
```text
地形CDN目录：https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@main/xueyue_lux_hex_pack_v2_layered_test/base
过渡CDN目录：https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@main/xueyue_lux_hex_pack_v2_layered_test/transition
Overlay CDN目录：https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@main/xueyue_lux_hex_pack_v2_layered_test/overlay
标记CDN目录：https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@main/xueyue_lux_hex_pack_v2_layered_test/marker
```

## 字段
- `terrain`: 对应 base，如 `grassland` -> `base/grassland_base.webp`
- `overlayKey`: 对应 overlay，如 `sect_gate` -> `overlay/sect_gate_overlay.webp`
- `visibility/danger/currentLocation`: 触发 marker。
