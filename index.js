// 雪月控制台｜GitHub 模块入口｜by@冬月
// 推荐通过酒馆助手加载器 import 本文件。

export async function initXueyue(options = {}) {
  const cacheKey = encodeURIComponent(options.cacheKey || options.version || 'v0.6.26');
  const { initXueyueCore } = await import(`./modules/xueyue-core.js?v=${cacheKey}`);
  return initXueyueCore({
    repo: 'yutsuki0110/xueyue',
    ...options,
  });
}

export default initXueyue;
