# 雪月控制台 GitHub 包

当前版本：`v0.6.26`

这个包用于把雪月控制台放到 GitHub，然后通过酒馆助手加载器使用 `import()` 加载。

## 文件说明

- `github-repo/index.js`：上传到 GitHub 仓库的主脚本。
- `tavern-helper-loader/雪月控制台_加载器_main.json`：测试用加载器，使用 `@main`。
- `tavern-helper-loader/雪月控制台_加载器_v0_6_26.json`：发布用加载器，使用固定版本 `v0.6.26`。
- `tavern-helper-loader/loader_content_main.js`：加载器 JS 内容，方便你手动复制。
- `tavern-helper-loader/loader_content_v0_6_26.js`：固定版本加载器 JS 内容。

## 使用步骤

1. 在 GitHub 创建公开仓库，推荐仓库名：`xueyue-console`。
2. 把 `github-repo/index.js` 上传到仓库根目录。
3. 测试阶段可以用 `@main` 加载器；打开加载器 JSON，把：
   - `你的GitHub用户名`
   - `xueyue-console`
   改成你的真实用户名和仓库名。
4. 导入酒馆助手。
5. 稳定发布时，在 GitHub 创建 tag：`v0.6.26`，然后改用固定版本加载器。

## CDN 地址格式

测试用：

```txt
https://cdn.jsdelivr.net/gh/你的GitHub用户名/xueyue-console@main/index.js
```

发布用：

```txt
https://cdn.jsdelivr.net/gh/你的GitHub用户名/xueyue-console@v0.6.26/index.js
```

## 注意

- GitHub 仓库建议设为 Public。
- 修改 `index.js` 后，`@main` 可能会被 CDN 缓存；正式发布建议用 tag 版本。
- 导入新版加载器前，建议禁用旧版雪月控制台脚本，避免重复加载。

by@冬月
