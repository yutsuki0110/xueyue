# 雪月控制台

雪月预设绑定版控制台。仓库用于给酒馆助手加载器通过 `import()` 远程加载。

## 文件结构

```txt
index.js
modules/xueyue-core.js
```

## jsDelivr 地址

开发测试（main）：

```txt
https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@main/index.js
```

固定版本示例：

```txt
https://cdn.jsdelivr.net/gh/yutsuki0110/xueyue@v0.6.26/index.js
```

## 使用方式

1. 把 `github-repo/` 里的内容上传到 GitHub 仓库根目录：
   `https://github.com/yutsuki0110/xueyue.git`
2. 在酒馆助手导入 `tavern-helper-loader/雪月控制台_加载器_main.json`。
3. 调试完成后给仓库打 tag，例如 `v0.6.26`，再使用固定版本加载器。

## 注意

- 请不要同时启用旧版雪月大 JSON 和此加载器。
- 如用过旧版，导入后刷新 SillyTavern 页面一次。
- 若使用固定版本，修改 GitHub 代码后需要新建 tag 并更新加载器版本。
