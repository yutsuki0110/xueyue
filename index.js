(() => {
  'use strict';

  const VERSION = '0.6.26';
  const NS = '__XUEYUE_CONSOLE_ACTIVE__';
  const LEGACY_NS_KEYS = ['__XUEYUE_CONSOLE_ACTIVE__','__XUEYUE_CONSOLE_V0622__','__XUEYUE_CONSOLE_V0623__'];
  const STATE_KEY = 'XUEYUE_DYNAMIC_STATE';
  const STORY_KEY = '__xueyue_story_archive_meta_v7_7';
  const LS_SETTINGS = 'XUEYUE_CONSOLE_SETTINGS_V065';
  const LS_TEMPLATES = 'XUEYUE_CONSOLE_TEMPLATES_V065';
  const LS_LOGS = 'XUEYUE_CONSOLE_LOGS_V065';
  const LS_PRESET_BACKUP = 'XUEYUE_PRESET_BACKUP_V064';
  const LS_PRESET_MODES = 'XUEYUE_PRESET_MODES_V065';
  const PROMPT_STATE_ID = 'xueyue_schema_state_v064';
  const PROMPT_FORMAT_ID = 'xueyue_schema_format_v064';
  const PROMPT_STORY_ID = 'xueyue_story_archive_v064';
  const PROMPT_LABEL_ID = 'xueyue_label_order_v0612';
  const PROMPT_DYNAMIC_ID = 'xueyue_story_dynamic_v0617';
  const PROMPT_ROUTE_ID = 'xueyue_selected_route_v0617';
  const PROMPT_FREEZE_ID = 'xueyue_freeze_notice_v0617';
  const PROMPT_NARRATIVE_ID = 'xueyue_narrative_model_v0625';
  const PROMPT_EVENT_ID = 'xueyue_active_event_v0625';
  const LABEL_KEY = '__xueyue_label_order_v0612';
  const CG_DATA_KEY = 'xueyueCgVirtual';

  const IDS = {
    float: 'xueyue-v0619-float',
    drawer: 'xueyue-v0619-drawer',
    style: 'xueyue-v0619-style'
  };

  const rootWin = (() => {
    try { if (window.parent && window.parent.document && window.parent.document.body) return window.parent; } catch (_) {}
    return window;
  })();
  const rootDoc = rootWin.document || document;
  const localWin = window;
  const TH = rootWin.TavernHelper || localWin.TavernHelper || {};
  if (!rootDoc || !rootDoc.body) return;

  function pickFn(name) {
    if (typeof localWin[name] === 'function') return localWin[name].bind(localWin);
    if (typeof rootWin[name] === 'function') return rootWin[name].bind(rootWin);
    if (TH && typeof TH[name] === 'function') return TH[name].bind(TH);
    return null;
  }

  const api = {
    getVariables: pickFn('getVariables'),
    replaceVariables: pickFn('replaceVariables'),
    updateVariablesWith: pickFn('updateVariablesWith'),
    injectPrompts: pickFn('injectPrompts'),
    uninjectPrompts: pickFn('uninjectPrompts'),
    getChatMessages: pickFn('getChatMessages'),
    setChatMessages: pickFn('setChatMessages'),
    getLastMessageId: pickFn('getLastMessageId'),
    eventOn: pickFn('eventOn'),
    getButtonEvent: pickFn('getButtonEvent'),
    retrieveDisplayedMessage: pickFn('retrieveDisplayedMessage'),
    formatAsDisplayedMessage: pickFn('formatAsDisplayedMessage'),
    refreshOneMessage: pickFn('refreshOneMessage'),
    getPreset: pickFn('getPreset'),
    setPreset: pickFn('setPreset'),
    replacePreset: pickFn('replacePreset'),
    updatePresetWith: pickFn('updatePresetWith'),
    getLoadedPresetName: pickFn('getLoadedPresetName'),
    tavern_events: localWin.tavern_events || rootWin.tavern_events || {},
    builtin: TH.builtin || localWin.builtin || rootWin.builtin || {}
  };

  const DEFAULT_SETTINGS = {
    currentTab: 'preset',
    presetSearch: '',
    arrangeMode: false,
    selectedPromptIds: [],
    enabled: true,
    autoInject: true,
    autoProcessAfterGeneration: true,
    removeTagAfterParse: true,
    statePromptEnabled: true,
    formatPromptEnabled: true,
    storyArchiveEnabled: true,
    storyAutoProcess: true,
    storyInjectEnabled: true,
    storyInjectDynamic: false,
    storyInjectRoutes: true,
    roleStateDepth: 0,
    formatDepth: 1,
    storyInjectDepth: 4,
    storyInjectDynamicDepth: 2,
    routeInjectDepth: 0,
    freezeInjectDepth: 0,
    injectRole: 'system',
    storyInjectRole: 'system',
    routeInjectRole: 'system',
    freezeInjectRole: 'system',
    narrativeInjectEnabled: true,
    narrativeInjectDepth: 0,
    narrativeInjectRole: 'system',
    eventInjectEnabled: true,
    eventInjectDepth: 0,
    eventInjectRole: 'system',
    labelInjectEnabled: true,
    labelInjectDepth: 0,
    labelInjectRole: 'system',
    formatMode: 'compact',
    onlyInjectActiveCharacters: true,
    maxInjectedCharacters: 5,
    maxInjectedForeshadows: 3,
    storyRemoveFixedOutput: true,
    dynamicArchiveRemoveOutput: true,
    routeOptionsRemoveOutput: true,
    archiveDisplayEnabled: true,
    dynamicArchiveBeautify: true,
    dynamicArchiveDefaultCollapsed: true,
    dynamicArchiveTitle: '动态剧情档案',
    fixedArchiveDisplay: 'hidden',
    fixedArchiveTitle: '固定剧情档案',
    archiveFoldBgUrl: '',
    archiveFoldBgOpacity: 20,
    archiveFoldBgBlur: 0,
    tagRepairEnabled: true,
    autoCloseTags: true,
    sameOpenAsCloseFix: true,
    tagBoundaryProtect: true,
    routeButtonsEnabled: true,
    routeTitle: '路线选择',
    freezeModeEnabled: true,
    freezeInjectEnabled: true,
    registerNewAsActive: false,
    backgroundUrl: '',
    backgroundOpacity: 28,
    backgroundBlur: 8,
    floatTop: 320,
    panelX: null,
    panelY: null,
    panelWidthVw: 75,
    panelHeightVh: 75,
    cgEnabled: true,
    cgAutoProcess: true,
    cgRemoveOutput: true,
    cgVirtualCard: true,
    cgTitle: '世界回响',
    cgSubtitle: 'LORE SIGNAL',
    cgSigil: '✦',
    cgDefaultCollapsed: true,
    cgBackgroundMode: 'smart',
    cgFixedBackgroundUrl: '',
    cgBackgroundOpacity: 70,
    cgBackgroundBlur: 0,
  };

  const DEFAULT_TEMPLATES = {
    formatCompact: `【XUEYUE 输出格式】\n当需要输出 <XUEYUE> 时，标签内部必须是严格 JSON。\n\n1. 角色长期状态更新：\n<XUEYUE>\n{\n  "type": "state_patch",\n  "updates": {\n    "characters.角色名.corePersonality.currentShift": "长期人格偏移摘要",\n    "characters.角色名.corePersonality.shiftDirection": "人格变化方向",\n    "characters.角色名.schemas.selfSchema": "自我图式变化",\n    "characters.角色名.schemas.otherSchema": "他人图式变化",\n    "characters.角色名.schemas.relationshipSchema": "关系图式变化",\n    "characters.角色名.schemas.worldSchema": "世界图式变化",\n    "characters.角色名.defensePatterns.softenedDefense": "防御模式变化",\n    "characters.角色名.relationshipToUser.stableImpression": "角色对 user 的稳定印象",\n    "characters.角色名.relationshipToUser.trustModel": "角色对 user 的信任模型",\n    "characters.角色名.relationshipToUser.boundaryModel": "角色对 user 的边界模型",\n    "characters.角色名.relationshipToUser.metrics.trust": "+1",\n    "characters.角色名.relationshipToUser.metrics.guard": "-1",\n    "characters.角色名.relationshipToUser.metrics.affection": "+0",\n    "characters.角色名.relationshipToUser.metrics.dependence": "+0",\n    "characters.角色名.relationshipToUser.metrics.attachment": "+0",\n    "characters.角色名.relationshipToUser.metrics.conflict": "+0",\n    "characters.角色名.relationshipToUser.metrics.boundaryAcceptance": "+1",\n    "characters.角色名.galgame.lastChoice": "user 最近造成长期影响的重要选择",\n    "characters.角色名.galgame.longTermChoiceEffect": "该选择造成的长期心理影响",\n    "characters.角色名.lastStableChange": "本次长期变化原因"\n  }\n}\n</XUEYUE>\n\n2. 新重要角色注册：\n<XUEYUE>\n{\n  "type": "character_register",\n  "character": {\n    "name": "角色名",\n    "aliases": ["别名1", "别名2"],\n    "scope": "unknown",\n    "category": "new",\n    "role": "新登场角色",\n    "base": "基于已出现内容的稳定人格概括",\n    "initialImpression": "该角色对 user 或当前互动形成的初始稳定印象"\n  }\n}\n</XUEYUE>\n\n3. 角色伏笔更新：\n<XUEYUE>\n{\n  "type": "foreshadow_update",\n  "updates": [\n    {\n      "action": "add",\n      "character": "角色名",\n      "id": "唯一ID",\n      "title": "伏笔标题",\n      "hint": "正文中已经出现过的可观察线索",\n      "schemaType": "relationshipSchema",\n      "status": "unresolved",\n      "intensity": 1,\n      "lastTouched": "最近一次触碰到该伏笔的表现"\n    }\n  ]\n}\n</XUEYUE>\n\n规则：<XUEYUE> 必须放在回复最后；数值变化通常为 -3 到 +3；不要只更新数值，应优先更新文字模型；所有记录必须基于正文中已经发生的内容。`,
    roleState: `【雪月 · 当前角色图式状态】\n以下内容是当前聊天中角色的长期心理结构记录，只用于影响角色后续表现。不要在正文中直接复述本记录，不要暴露数值，不要提到变量或系统。\n\n{{ACTIVE_CHARACTER_STATE}}\n\n要求：\n1. 根据角色图式、人格偏移、防御模式和关系模型，自然影响角色的语气、行动和反应。\n2. 角色变化必须渐进，不要因为单轮互动突然大幅改变人格。\n3. 不要替 user 决定行动。\n4. 不要把长期记录写成直白说明，要转化为自然的角色表现。`,
    empty: `【雪月 · 当前角色图式状态】\n当前没有已激活的角色图式记录。\n如果本轮出现未来可能继续参与剧情的重要角色，可在回复最后使用 <XUEYUE> 注册该角色。普通路人、临时 NPC、无持续价值的人物不要注册。`,
    storyInjection: `【叙事档案｜脚本注入】\n以下内容来自脚本缓存，只用于提供稳定剧情基准或用户已选择路线；不要把它当作新的剧情事件。\n\n{{archiveAppendix}}`,
    selectedRoute: `【用户已选择的下一章路线】\n路线ID: {{routeId}}\n按钮标题: {{title}}\n下一章指令: {{instruction}}\n推进要求: 下一章必须优先按照该路线推进。未选择路线视为废案，不得主动推进。`,
    freeze: `【限制级事件状态｜脚本提示】\n仅当当前动态档案明确显示限制级事件正在进行时，此提示才有效。若当前剧情状态并非限制级事件中，请忽略本段。\n进行中时：冻结正常主线章节，不生成新候选路线，只维护限制级事件轨迹。`
  };


  // CG 背景图库来源于用户提供的【雪月】CG美化脚本；作者标记：@冬月，禁止商业化，未经许可禁止搬运。
  const CG_BACKGROUND_LIBRARY = [
      { name: '日常·澄蓝海面', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/daily/clear-blue-ocean-02.png', keywords: ['海洋', '海面', '蓝天', '晴空', '日常', '夏日', '治愈', '宁静', '海边', '海域', '岛屿', 'clear', 'ocean'] },
      { name: '日常·海边剪影', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/daily/ocean-silhouette-girl-01.png', keywords: ['海洋', '海边', '少女', '剪影', '青春', '记忆', '孤独', '日常', '夏日', '黄昏', 'ocean', 'girl'] },
      { name: '日常·夏日运河街区', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/daily/summer-canal-neighborhood-01.png', keywords: ['运河', '街区', '小镇', '邻里', '日常', '生活', '夏日', '城市', '现代', '学院', '学校', 'canal', 'neighborhood'] },
      { name: '日常·晴日山丘城市', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/daily/sunny-hill-city-view-01.png', keywords: ['城市', '都市', '山丘', '晴天', '日常', '现代', '学院', '学校', '城镇', '高处', 'city', 'hill'] },
      { name: '日常·夕照神社参道', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/daily/sunset-shrine-path-01.png', keywords: ['神社', '参道', '夕阳', '祭典', '传说', '乡镇', '日常', '灵异', '神秘', '祈愿', 'shrine', 'sunset'] },
      { name: '奇幻·月夜魔法都市', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/fantasy_light/moonlit-magic-city-01.png', keywords: ['魔法', '魔力', '奇幻', '法师', '王国', '圣城', '月光', '神秘', '精灵', '冒险', 'fantasy', 'magic', 'moonlit'] },
      { name: '现代·旧城樱花街', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/modern/old-town-sakura-city-02.png', keywords: ['现代', '都市', '城市', '樱花', '旧城', '街道', '小镇', '学院', '学校', '日常', '春天', 'sakura', 'modern'] },
      { name: '现代·旧城春日街', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/modern/old-town-spring-city-01.png', keywords: ['现代', '都市', '城市', '春日', '旧城', '街道', '小镇', '学院', '学校', '日常', '生活', 'spring', 'modern'] },
      { name: '秘仪·烛灯仪式桌', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/occult/ritual-desk-lantern-03.png', keywords: ['仪式', '烛灯', '秘仪', '魔法阵', '诅咒', '灵异', '怪谈', ' occult', '神秘学', '契约', '祭祀', 'ritual', 'lantern'] },
      { name: '秘仪·灯火仪式房间', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/occult/ritual-room-lantern-02.png', keywords: ['仪式', '房间', '烛灯', '秘仪', '禁术', '诅咒', '灵异', '怪谈', '神秘学', '祭坛', 'ritual', 'occult'] },
      { name: '科幻·异星有机洞窟', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/scifi/alien-organic-cavern-01.png', keywords: ['异星', '外星', '生物', '洞窟', '巢穴', '遗迹', '探索', '深渊', '科幻', '异形', '污染', 'alien', 'organic', 'cavern'] },
      { name: '科幻·蓝色星舰机库', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/scifi/starship-hangar-blue-02.png', keywords: ['星舰', '飞船', '机库', '空间站', '宇宙', '舰船', '科幻', '机甲', '军团', '蓝色', 'starship', 'hangar', 'scifi'] },
      { name: '科幻·橙色星舰机库', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/scifi/starship-hangar-orange-03.png', keywords: ['星舰', '飞船', '机库', '空间站', '宇宙', '舰船', '科幻', '机甲', '军团', '战争', 'starship', 'hangar', 'scifi'] },
      { name: '都市奇幻·雨港商店', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/urban_fantasy/rain-harbor-shop-02.png', keywords: ['都市奇幻', '雨', '港口', '商店', '现代', '异能', '灵异', '调查', '秘密', '夜晚', '港湾', 'urban', 'fantasy', 'harbor'] },
      { name: '都市奇幻·雨中湖畔屋', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/urban_fantasy/rain-lakeside-house-01.png', keywords: ['都市奇幻', '雨', '湖畔', '房屋', '现代', '异能', '灵异', '隐居', '秘密', '怪谈', 'lakeside', 'urban', 'fantasy'] },
      { name: '仙侠·云崖仙城', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/xianxia/cloud-cliff-city-01.png', keywords: ['修仙', '仙侠', '宗门', '灵气', '仙城', '云海', '山门', '境界', '法器', '剑修', '古风', 'xianxia', 'cultivation'] },
      { name: '仙侠·云村内景', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/xianxia/cloud-village-interior-02.jpeg', keywords: ['修仙', '仙侠', '村落', '山村', '宗门', '修炼', '古风', '居所', '灵气', '隐世', 'xianxia', 'village'] },
      { name: '仙侠·暗港城镇', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/xianxia/dark-harbor-town-01.png', keywords: ['修仙', '仙侠', '江湖', '暗港', '黑市', '魔修', '夜晚', '港口', '阴谋', '城镇', '古风', 'harbor', 'xianxia'] },
      { name: '仙侠·帝雾皇城', url: 'https://cdn.jsdelivr.net/gh/yutsuki0110/images@38e25767b9bd996ce0da1b0b24b0a69d0d72abc6/xianxia/imperial-mist-city-01.jpeg', keywords: ['修仙', '仙侠', '帝国', '皇城', '王朝', '宫廷', '云雾', '古风', '权谋', '仙城', 'imperial', 'xianxia'] },
    ];

  const GROUPS = [
    ['active', '当前活跃'],
    ['newCharacters', '新人物 / 待确认'],
    ['globalImportant', '全局重要'],
    ['arcImportant', '本卷重要'],
    ['npc', 'NPC'],
    ['archivedCharacters', '旧人物 / 归档']
  ];
  const GROUP_FIELDS = {
    globalImportant: { scope: 'global', category: 'important', status: 'active' },
    arcImportant: { scope: 'arc', category: 'important', status: 'active' },
    npc: { scope: 'local', category: 'npc', status: 'active' },
    newCharacters: { scope: 'unknown', category: 'new', status: 'pending' },
    archivedCharacters: { status: 'archived' }
  };
  const METRICS = ['trust','guard','affection','dependence','attachment','conflict','boundaryAcceptance'];
  const NARRATIVE_MODELS = [
    {id:'pov', name:'POV视点人物结构', short:'POV', goal:'让读者深入不同角色的内心。', eventStyle:'角色视角事件、内心冲突、信息差事件。', desc:'适合多角色内心、隐藏动机、同一事件的不同认知。'},
    {id:'convergence', name:'辐辏式结构', short:'辐辏', goal:'营造命运交汇的宿命感。', eventStyle:'多线汇聚事件、命运节点、交汇前兆。', desc:'适合多条线逐渐靠近同一核心事件，制造宿命感。'},
    {id:'parallel_contrast', name:'平行对照结构', short:'对照', goal:'通过对比强化主题或制造戏剧张力。', eventStyle:'镜像事件、对照事件、主题反差事件。', desc:'适合用两组人物/事件互相映照，突出选择差异和主题反差。'},
    {id:'network', name:'网状结构', short:'网状', goal:'记录一个真实的、万物互联的动态社会。', eventStyle:'势力事件、社会节点、多角色行动、连锁反应。', desc:'适合大世界、势力博弈、群像互动和牵一发而动全身的剧情。'},
    {id:'main_sub', name:'主副线式结构', short:'主副线', goal:'以主线为骨架，副线补强人物、世界与伏笔。', eventStyle:'支线任务、角色支线、地点事件、伏笔事件。', desc:'最稳妥的经典结构，主线清晰，副线用于补充情感、世界观和伏笔。'},
    {id:'interwoven_multiline', name:'交织式多线结构', short:'交织多线', goal:'线索较少但关联紧密，多线交替推进。', eventStyle:'关联角色事件、交错行动、同步推进事件。', desc:'适合几条彼此有关的线交替推进，角色通常一开始就有关联。'},
    {id:'parallel_multiline', name:'并列式多线结构', short:'并列多线', goal:'多条故事线主题相关，情节相对独立，后期可能交汇。', eventStyle:'独立角色线、远方事件、主题呼应事件。', desc:'适合多地点、多主角或远方事件，前期独立，后期可交汇。'},
    {id:'layered_reveal', name:'分层递进结构', short:'分层递进', goal:'像剥洋葱一样逐层揭示更深的秘密。', eventStyle:'表层线索、隐藏线索、误导线索、真相碎片。', desc:'适合悬疑、秘密、世界真相、身份谜团和逐步揭露。'},
    {id:'hero_journey', name:'英雄之旅', short:'英雄之旅', goal:'以召唤、越过门槛、试炼、危机、奖赏、归来为推进骨架。', eventStyle:'召唤事件、门槛事件、试炼事件、导师事件、深渊事件。', desc:'适合主角成长、冒险、修行、异世界踏入新秩序的故事。'},
    {id:'story_circle', name:'丹·哈蒙的故事圈', short:'故事圈', goal:'以需求、进入陌生处境、适应、付出代价、回归变化为循环。', eventStyle:'需求触发、陌生领域、代价事件、回归变化事件。', desc:'适合单章/单事件循环推进，每段都有明确需求、代价和变化。'},
    {id:'three_act', name:'三幕剧结构', short:'三幕剧', goal:'以建立、对抗、解决为主要推进骨架，强调转折与高潮。', eventStyle:'铺垫事件、中点危机、高潮前事件、解决事件。', desc:'适合清晰商业叙事：开端建立问题，中段升级冲突，末段解决爆发。'},
    {id:'kishotenketsu', name:'起承转合', short:'起承转合', goal:'以起、承、转、合组织推进，强调转折后的自然收束。', eventStyle:'铺陈事件、承接事件、转折事件、收束事件。', desc:'适合东方叙事、日常转折、气氛积累和不靠强冲突的推进。'}
  ];
  let settings = loadJson(LS_SETTINGS, DEFAULT_SETTINGS);
  if (settings._v066FixedDefaultApplied !== true) {
    settings.storyRemoveFixedOutput = true;
    settings.fixedArchiveDisplay = 'hidden';
    settings._v066FixedDefaultApplied = true;
    try { rootWin.localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); } catch (_) {}
  }
  if (settings._v0615CoreArchiveDefaults !== true) {
    settings.archiveDisplayEnabled = true;
    settings.dynamicArchiveBeautify = true;
    settings.dynamicArchiveRemoveOutput = true;
    settings.routeOptionsRemoveOutput = true;
    settings.dynamicArchiveDefaultCollapsed = true;
    settings.storyRemoveFixedOutput = true;
    settings.fixedArchiveDisplay = 'hidden';
    settings.tagRepairEnabled = true;
    settings.autoCloseTags = true;
    settings.sameOpenAsCloseFix = true;
    settings.tagBoundaryProtect = true;
    settings.routeButtonsEnabled = true;
    settings.freezeModeEnabled = true;
    settings.freezeInjectEnabled = true;
    settings._v0615CoreArchiveDefaults = true;
    try { rootWin.localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); } catch (_) {}
  }
  if (settings._v0617RecommendedInjectionDefaults !== true) {
    settings.roleStateDepth = 0;
    settings.formatDepth = 1;
    settings.storyInjectDepth = 4;
    settings.storyInjectDynamicDepth = 2;
    settings.routeInjectDepth = 0;
    settings.freezeInjectDepth = 0;
    settings.labelInjectDepth = 0;
    settings.injectRole = 'system';
    settings.storyInjectRole = 'system';
    settings.routeInjectRole = 'system';
    settings.freezeInjectRole = 'system';
    settings.labelInjectRole = 'system';
    settings.storyInjectDynamic = false;
    settings.storyInjectRoutes = true;
    settings.freezeInjectEnabled = true;
    settings._v0617RecommendedInjectionDefaults = true;
    try { rootWin.localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); } catch (_) {}
  }

  let templates = loadJson(LS_TEMPLATES, DEFAULT_TEMPLATES);
  let logs = loadJson(LS_LOGS, []);
  let processTimer = 0;
  let archiveMutationObserver = null;
  let archiveRepaintTimer = 0;
  let archiveRepaintBusy = false;
  const archiveOpenStates = new Map();
  let pointerStart = null;
  let panelStart = null;
  let dragged = false;
  let ignoreClickUntil = 0;
  let appDrag = null;
  let folderLongPressTimer = null;
  const APP_DRAG_HOLD_MS = 3000;
  const FOLDER_DISSOLVE_HOLD_MS = 5000;

  const eventAbortController = (() => {
    try { return new (rootWin.AbortController || window.AbortController)(); } catch (_) { return null; }
  })();
  const eventUnsubscribers = [];
  function addGlobalListener(target, type, handler, options) {
    if (!target || !target.addEventListener) return;
    if (eventAbortController) {
      const opts = Object.assign({}, typeof options === 'boolean' ? { capture: options } : (options || {}), { signal: eventAbortController.signal });
      target.addEventListener(type, handler, opts);
    } else {
      target.addEventListener(type, handler, options);
    }
  }

  for (const key of [NS, ...LEGACY_NS_KEYS]) {
    try { if (rootWin[key] && rootWin[key].destroy) rootWin[key].destroy(); } catch (_) {}
  }
  try { rootWin[NS] = null; } catch (_) {}
  cleanupOldUi();

  function loadJson(key, fallback) {
    try { const raw = rootWin.localStorage.getItem(key); return raw ? Object.assign(clone(fallback), JSON.parse(raw)) : clone(fallback); } catch (_) { return clone(fallback); }
  }
  function saveJson(key, value) { try { rootWin.localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function clone(x) { return JSON.parse(JSON.stringify(x == null ? {} : x)); }
  function nowIso() { return new Date().toISOString(); }
  function esc(x) { return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function uniq(arr) { return [...new Set((arr || []).map(x => String(x || '').trim()).filter(Boolean))]; }
  function clamp(n,min,max,def) { n = Number(n); if (!Number.isFinite(n)) n = def || 0; return Math.max(min, Math.min(max, n)); }
  function toast(msg,type='success') { const t=rootWin.toastr || localWin.toastr; if(t&&typeof t[type]==='function') t[type](msg); else console.log('[雪月]',msg); }
  function copyText(text) { if(api.builtin && typeof api.builtin.copyText==='function') return api.builtin.copyText(text); try { navigator.clipboard.writeText(String(text)); } catch(_) { const ta=rootDoc.createElement('textarea'); ta.value=String(text); rootDoc.body.appendChild(ta); ta.select(); rootDoc.execCommand('copy'); ta.remove(); } }
  function addLog(type,title,detail='') { logs.unshift({time:new Date().toLocaleString(),type,title,detail:String(detail||'')}); logs=logs.slice(0,80); saveJson(LS_LOGS,logs); renderIfOpen(); }
  function getByPath(obj,path){ return String(path||'').split('.').filter(Boolean).reduce((a,k)=>a==null?undefined:a[k],obj); }
  function setByPath(obj,path,value){ const p=String(path||'').split('.').filter(Boolean); let cur=obj; for(let i=0;i<p.length-1;i++){ if(cur[p[i]]==null||typeof cur[p[i]]!=='object') cur[p[i]]={}; cur=cur[p[i]]; } if(p.length) cur[p[p.length-1]]=value; }
  function metricStage(name,v){ v=Number(v)||0; const map={trust:['不信任','有限信任','基本信任','稳定信任','深度信任'],guard:['几乎不设防','轻微保留','保持边界','高戒备','强烈防御'],affection:['无明显好感','轻微在意','稳定好感','明显亲近','强烈情感牵引'],boundaryAcceptance:['拒绝靠近','只接受低压靠近','可接受边界内靠近','较高边界接纳','高度接纳']}; const a=map[name]||['极低','较低','中等','较高','极高']; return a[v<=20?0:v<=40?1:v<=60?2:v<=80?3:4]; }

  function getChatVars(){ if(!api.getVariables) return {}; try { return api.getVariables({type:'chat'}) || {}; } catch(e){ addLog('error','读取聊天变量失败',e.message); return {}; } }
  function saveChatVars(vars){ if(!api.replaceVariables) { addLog('error','保存聊天变量失败','replaceVariables 不可用'); return; } try { api.replaceVariables(vars||{}, {type:'chat'}); } catch(e){ addLog('error','保存聊天变量失败',e.message); } }

  function makeState(){ return {version:2,preset:'雪月',activeCharacters:[],characterGroups:{globalImportant:[],arcImportant:[],npc:[],newCharacters:[],archivedCharacters:[]},characters:{},relationships:{},meta:{createdAt:nowIso(),updatedAt:nowIso()}}; }
  function normState(s){ s=s&&typeof s==='object'?s:makeState(); s.activeCharacters=uniq(s.activeCharacters); s.characterGroups=s.characterGroups||{}; for(const k of ['globalImportant','arcImportant','npc','newCharacters','archivedCharacters']) s.characterGroups[k]=uniq(s.characterGroups[k]); s.characters=s.characters||{}; s.meta=s.meta||{}; return s; }
  function getState(){ const vars=getChatVars(); const s=normState(vars[STATE_KEY]); if(!vars[STATE_KEY]) { vars[STATE_KEY]=s; saveChatVars(vars); } return s; }
  function saveState(s){ const vars=getChatVars(); s=normState(s); s.meta.updatedAt=nowIso(); vars[STATE_KEY]=s; saveChatVars(vars); }

  function baseStory(){ return {fixedText:'',semiFixedText:'',dynamicText:'',eventText:'',routeOptionsText:'',selectedRoute:null,frozenMainText:'',freezeActive:false,lastRoutes:[],narrativeModel:null,activeEvent:null,returnMainlineNotice:null,cacheVersion:'xy-v0.6.26',savedAt:0,lastExtractedAt:0}; }
  function normStory(m){ return Object.assign(baseStory(), m&&typeof m==='object'?m:{}); }
  function getStory(){ const vars=getChatVars(); let m=vars[STORY_KEY]; if(typeof m==='string') { try{m=JSON.parse(m);}catch(_){m=null;} } m=normStory(m); if(!vars[STORY_KEY]) { vars[STORY_KEY]=m; saveChatVars(vars); } return m; }
  function saveStory(m){ const vars=getChatVars(); m=normStory(m); m.savedAt=Date.now(); vars[STORY_KEY]=m; saveChatVars(vars); }


  function getLabelText(){
    const vars=getChatVars();
    const v=vars[LABEL_KEY];
    if(typeof v==='string') return v;
    if(v && typeof v==='object' && typeof v.text==='string') return v.text;
    return '';
  }
  function saveLabelText(text){
    const vars=getChatVars();
    vars[LABEL_KEY]=String(text||'').trim();
    saveChatVars(vars);
  }
  function labelInjectPrompt(){
    const tags=getLabelText().trim();
    if(!settings.labelInjectEnabled || !tags) return '';
    return 'Fuyutsuki，完整的响应应包含下列标签，且必须完全闭合：\n' + tags;
  }
  function extractLabelPairsFromText(text){
    const src=String(text||'');
    const excluded=new Set(['FixedAppendix','content','ContentPreamble']);
    const seen=new Set();
    const out=[];
    const re=/<([A-Za-z][A-Za-z0-9_:-]*)(?:\s[^<>]*)?>/g;
    let m;
    while((m=re.exec(src))){
      const name=m[1];
      // 避免把普通 html / markdown 渲染残留或用户明确不要的 content 类标签提取进去。
      if(excluded.has(name) || excluded.has(name.toLowerCase())) continue;
      if(!/[A-Z]/.test(name[0]) && name !== name.toUpperCase()) continue;
      if(seen.has(name)) continue;
      seen.add(name);
      out.push(`<${name}>\n</${name}>`);
    }
    return out.join('\n\n');
  }
  function findLatestAssistantForLabels(){
    if(!api.getChatMessages) return null;
    try{
      const arr = api.getChatMessages(-1, {role:'assistant'}) || [];
      if(arr[0] && arr[0].role==='assistant') return arr[0];
    }catch(_){ }
    try{
      const all = api.getChatMessages('0-{{lastMessageId}}', {role:'assistant'}) || [];
      for(let i=all.length-1;i>=0;i--){
        if(all[i] && all[i].role==='assistant') return all[i];
      }
    }catch(_){
      try{
        const all = api.getChatMessages('0-{{lastMessageId}}') || [];
        for(let i=all.length-1;i>=0;i--){
          if(all[i] && all[i].role==='assistant') return all[i];
        }
      }catch(__){}
    }
    return null;
  }
  function extractLabelsFromLatestAssistant(){
    const msg=findLatestAssistantForLabels();
    if(!msg){ toast('未找到最后一条助手回复。','warning'); addLog('info','标签提取失败','未找到最后一条助手回复'); return; }
    const tags=extractLabelPairsFromText(msg.message||'');
    if(!tags.trim()){
      toast('最后一条助手回复没有可用标签。','warning');
      addLog('info','标签提取为空',`来源楼层 ${msg.message_id}；FixedAppendix 或 content 类标签已被排除，或该回复没有标签`);
      return;
    }
    saveLabelText(tags);
    addLog('success','已从最后回复提取标签',`来源楼层 ${msg.message_id}`);
    toast('已从最后回复提取标签。');
    renderDrawer();
  }
  function saveLabelsFromTextarea(){
    const el=rootDoc.querySelector(`#${IDS.drawer} [data-label-text]`);
    if(!el) return;
    saveLabelText(el.value||'');
    addLog('success','已保存标签',`${(el.value||'').split('\n').filter(x=>x.trim()).length} 行`);
    toast('已保存标签。');
    renderDrawer();
  }
  function clearLabels(){
    saveLabelText('');
    addLog('success','已清空标签','');
    renderDrawer();
  }

  function createChar(input={}){ const name=String(input.name||'未命名角色').trim()||'未命名角色'; const now=nowIso(); return {displayName:name,aliases:uniq([name].concat(input.aliases||[])),status:'pending',scope:input.scope||'unknown',category:input.category||'new',role:input.role||'新登场角色',corePersonality:{base:input.base||'基于已出现内容逐步记录稳定人格。',stableTraits:[],currentShift:'尚未发生明显偏移',shiftDirection:'未定'},schemas:{selfSchema:'待观察',otherSchema:'待观察',relationshipSchema:'待观察',worldSchema:'待观察'},defensePatterns:{primaryDefense:'待观察',secondaryDefense:'待观察',softenedDefense:'尚未出现',triggerConditions:[]},relationshipToUser:{stableImpression:input.initialImpression||'尚未形成稳定印象',trustModel:'尚未形成稳定信任',boundaryModel:'边界模型待观察',metrics:{trust:20,guard:50,affection:0,dependence:0,attachment:0,conflict:0,boundaryAcceptance:0}},behaviorModel:{defaultResponse:'依据当前人格与图式自然回应',underPressure:'待观察',whenTrustIncreases:'待观察',whenGuardIncreases:'待观察'},galgame:{lastChoice:'',longTermChoiceEffect:'',flags:[]},foreshadows:[],memoryImprints:[],lastStableChange:'初始记录',meta:{locked:false,createdAt:now,updatedAt:now,lastTouchedMessageId:null,notes:''}}; }
  function removeFromGroups(s,name){ s.activeCharacters=(s.activeCharacters||[]).filter(x=>x!==name); for(const k of Object.keys(s.characterGroups||{})) s.characterGroups[k]=(s.characterGroups[k]||[]).filter(x=>x!==name); }
  function addToGroup(s,name,group){ if(group==='active'){s.activeCharacters=uniq([...(s.activeCharacters||[]),name]); return;} removeFromGroups(s,name); if(group&&s.characterGroups[group]) s.characterGroups[group]=uniq([...(s.characterGroups[group]||[]),name]); if(s.characters[name]&&GROUP_FIELDS[group]) Object.assign(s.characters[name],GROUP_FIELDS[group]); }

  function getPromptCollection(){ const pm=api.builtin && api.builtin.promptManager; if(!pm || typeof pm.getPromptCollection!=='function') return null; try { return pm.getPromptCollection(); } catch(e){ addLog('error','读取预设管理器失败',e.message); return null; } }
  function getPresetObject(){
    try {
      if (typeof api.getPreset === 'function') {
        const preset = api.getPreset('in_use');
        if (preset && Array.isArray(preset.prompts)) return preset;
      }
    } catch(e) { addLog('error','读取 in_use 预设失败',e.message); }
    return null;
  }
  function getPrompts(){
    const preset = getPresetObject();
    if (preset && Array.isArray(preset.prompts)) return preset.prompts;
    const pc=getPromptCollection();
    return pc && Array.isArray(pc.collection) ? pc.collection : [];
  }
  function promptId(p){ return p.identifier || p.id || p.name; }
  function promptDepth(p){
    if (p.injection_depth !== undefined && p.injection_depth !== null) return p.injection_depth;
    if (p.position && p.position.depth !== undefined && p.position.depth !== null) return p.position.depth;
    return null;
  }
  function normalizePresetPromptForCurrentShape(p){
    // 保留原对象所有字段；只补齐缺失的 id/identifier，避免写回时丢字段。
    const q = Object.assign({}, p || {});
    if (!q.id && q.identifier) q.id = q.identifier;
    if (!q.identifier && q.id) q.identifier = q.id;
    return q;
  }

  async function savePrompts(nextPrompts){
    const prompts = (nextPrompts || []).map(normalizePresetPromptForCurrentShape);
    try {
      // 最稳路线：读取完整 in_use 预设，只替换 prompts，再整体 replace。
      // 不再用 setPreset('in_use', { prompts })，因为部分 ST/助手版本会在缺少完整预设结构时访问 promptOrder 报错。
      if (typeof api.replacePreset === 'function' && typeof api.getPreset === 'function') {
        const preset = api.getPreset('in_use');
        if (!preset || typeof preset !== 'object') throw new Error('getPreset("in_use") 没有返回有效预设对象。');
        preset.prompts = prompts;
        await api.replacePreset('in_use', preset, { render: 'immediate' });
      } else if (typeof api.updatePresetWith === 'function') {
        await api.updatePresetWith('in_use', preset => {
          preset = preset && typeof preset === 'object' ? preset : {};
          preset.prompts = prompts;
          return preset;
        }, { render: 'immediate' });
      } else {
        const pc = getPromptCollection();
        if (pc && Array.isArray(pc.collection)) {
          pc.collection.splice(0, pc.collection.length, ...prompts);
          if(api.builtin && typeof api.builtin.saveSettings==='function') await api.builtin.saveSettings();
        } else {
          throw new Error('缺少 getPreset/replacePreset/updatePresetWith 接口，无法写入预设。');
        }
      }
      try { if(api.builtin && typeof api.builtin.renderPromptManager==='function') api.builtin.renderPromptManager(); } catch(_) {}
      try { if(api.builtin && typeof api.builtin.renderPromptManagerDebounced==='function') api.builtin.renderPromptManagerDebounced(); } catch(_) {}
      return true;
    } catch(e) {
      addLog('error','写入预设失败',e.message || e);
      toast('写入预设失败：' + (e.message || e), 'error');
      return false;
    }
  }
  function cleanModuleTitle(name){
    let n=String(name||'').trim();
    n=n.replace(/[（(]\s*开始\s*[)）]/g,'').replace(/[（(]\s*结束\s*[)）]/g,'').trim();
    n=n.replace(/^\s*[\/／]+\s*/,'').replace(/\s*[\/／]+\s*$/,'').trim();
    return n || '杂项';
  }
  function leadingEmoji(name){ const m=String(name||'').trim().match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}](?:\uFE0F)?)/u); return m?m[1]:''; }
  function folderStartInfo(p){
    // 严格文件夹起点：必须是「emoji + 标题」，例如 🐳思维链。
    // 不再根据内容关键词或 extra 猜测文件夹，避免误识别。
    const raw=String(p?.name||'').trim();
    const emoji=leadingEmoji(raw);
    if(!emoji) return null;
    const rest=raw.slice(emoji.length).trim();
    if(!rest || /^[\/／]/.test(rest)) return null;
    const name=rest.trim();
    return {emoji, name, title:emoji+name};
  }
  function folderEndInfo(p){
    // 严格文件夹终点：必须是「相同 emoji + / + 相同标题」，例如 🐳/思维链。
    const raw=String(p?.name||'').trim();
    const emoji=leadingEmoji(raw);
    if(!emoji) return null;
    let rest=raw.slice(emoji.length).trim();
    if(!/^[\/／]/.test(rest)) return null;
    rest=rest.replace(/^[\/／]\s*/,'').trim();
    if(!rest) return null;
    return {emoji, name:rest, title:emoji+rest};
  }
  function parseFolderNameInput(raw){
    const info = folderStartInfo({name: String(raw||'').trim()});
    if(!info || !info.emoji || !info.name || /^[\/／]/.test(info.name)) return null;
    return info;
  }

  function sameFolderInfo(a,b){ return a&&b&&a.emoji===b.emoji&&a.name===b.name; }
  function isFolderMarker(p){ return !!(folderStartInfo(p)||folderEndInfo(p)); }
  function findFolderEnd(prompts,startIndex,info){
    let level=0;
    for(let i=startIndex+1;i<prompts.length;i++){
      const st=folderStartInfo(prompts[i]);
      const ed=folderEndInfo(prompts[i]);
      if(sameFolderInfo(st,info)) level++;
      if(sameFolderInfo(ed,info)){
        if(level===0) return i;
        level--;
      }
    }
    return -1;
  }

  function classifyPrompt(p){
    const name = String(p?.name || '');
    const content = String(p?.content || '');
    const all = `${name}\n${content}`;
    if (/🫧|水月|LEGEND|宏观叙事|单元叙事|剧情|叙事结构|路线|章节|事件追踪/.test(all)) return '🫧水月';
    if (/❄️|文风|文体|描写|叙述|修辞|语气|轻小说|故事基调|氛围|对白/.test(all)) return '❄️文风';
    if (/💡|功能区|功能|CG|选项|标签|状态栏|变量|界面|按钮|视觉|Status|visual_cards|RouteOption|UpdateVariable/.test(all)) return '💡功能区';
    if (/🐳|🐱|思维链|thinking|思考|分析|推理|char_analysis|Reasoning|认知|心理治疗师/.test(all)) return '🐳思维链';
    if (/雪月|XUEYUE|人格变化|图式变化|防御模式|稳定印象|galgame|角色伏笔|新重要角色/.test(all)) return '❄️雪月';
    return '杂项';
  }
  function newPromptId(){
    try{ if(api.builtin&&typeof api.builtin.uuidv4==='function') return 'xy_folder_' + api.builtin.uuidv4(); }catch(_){ }
    return 'xy_folder_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
  }
  function makeFolderPrompt(emoji,name,type){
    const clean=cleanModuleTitle(name);
    const label= type==='start' ? `${emoji}${clean}` : `${emoji}/${clean}`;
    const id=newPromptId() + '_' + type;
    return { identifier:id, id, name:label, enabled:false, role:'system', content:'', injection_position:0, injection_depth:0, injection_order:0, system_prompt:true, marker:true, extra:{xueyueFolder:true,type,folderName:clean,emoji} };
  }
  function makeNormalPresetPrompt(name, role='system', depth=4, content='') {
    const id = String(newPromptId()).replace('xy_folder_', 'xy_prompt_') + '_entry';
    return {
      identifier: id,
      id,
      name: String(name || '新建条目').trim() || '新建条目',
      enabled: true,
      role: ['system','user','assistant'].includes(role) ? role : 'system',
      content: String(content || ''),
      injection_position: 0,
      injection_depth: Number.isFinite(Number(depth)) ? Number(depth) : 4,
      injection_order: 100,
      system_prompt: false,
      marker: false,
      forbid_overrides: false,
      injection_trigger: []
    };
  }

  function promptFolderRangeByIds(prompts, startId, endId) {
    const start = prompts.findIndex(p => String(promptId(p)) === String(startId));
    const end = prompts.findIndex(p => String(promptId(p)) === String(endId));
    if (start >= 0 && end > start) return { start, end };
    return null;
  }
  function selectedPromptSet(){ return new Set((settings.selectedPromptIds||[]).map(String)); }
  function promptMetaLine(p){
    const role=String(p.role||'system').toUpperCase();
    const d=promptDepth(p);
    return `${role} // ${d===null?'CORE':'D'+d}`;
  }
  function backupPrompts(){ const ps=getPrompts(); const payload={time:nowIso(),prompts:clone(ps)}; rootWin.localStorage.setItem(LS_PRESET_BACKUP, JSON.stringify(payload)); addLog('success','已备份当前预设',`共 ${ps.length} 个条目`); toast('已备份当前预设。'); }
  async function togglePrompt(id){
    const ps=clone(getPrompts());
    const p=ps.find(x=>String(promptId(x))===String(id));
    if(!p) { toast('没有找到这个预设条目。','error'); return; }
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    p.enabled = !(p.enabled !== false);
    const ok = await savePrompts(ps);
    if(ok){ addLog('success','切换预设条目',`${p.name}: ${p.enabled?'开启':'关闭'}`); renderDrawer(); }
  }
  function copyPrompt(id){ const p=getPrompts().find(x=>String(promptId(x))===String(id)); if(!p) return; copyText(p.content||''); toast('已复制条目内容。'); }
  function closePromptModal(){ settings.promptModalOpen=false; saveJson(LS_SETTINGS,settings); renderDrawer(); }
  function savePromptEdit(id){ toast('此版已取消编辑页面，请使用虚拟按键开关或模式管理。','info'); }
  function getPresetModes(){ return loadJson(LS_PRESET_MODES, []); }
  function savePresetModes(modes){ rootWin.localStorage.setItem(LS_PRESET_MODES, JSON.stringify(Array.isArray(modes)?modes:[])); }
  function saveCurrentAsMode(){ const name=String(rootWin.prompt('给这个模式命名：','')).trim(); if(!name)return; const ps=getPrompts(); const mode={name, time:nowIso(), enabledIds:ps.filter(p=>p.enabled!==false).map(p=>String(promptId(p))), order:ps.map(p=>String(promptId(p)))}; const modes=getPresetModes().filter(m=>m.name!==name); modes.unshift(mode); savePresetModes(modes); addLog('success','已保存预设模式',name); toast('已保存模式：'+name); renderDrawer(); }
  async function applyPresetMode(name){
    const modes=getPresetModes(); const mode=modes.find(m=>m.name===name); if(!mode)return;
    const ps=clone(getPrompts());
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    const enabled=new Set((mode.enabledIds||[]).map(String));
    ps.forEach(p=>{ p.enabled = enabled.has(String(promptId(p))); });
    const order=(mode.order||[]).map(String); const score=new Map(order.map((id,i)=>[id,i]));
    ps.sort((a,b)=>{ const ai=score.has(String(promptId(a)))?score.get(String(promptId(a))):999999; const bi=score.has(String(promptId(b)))?score.get(String(promptId(b))):999999; return ai-bi; });
    const ok = await savePrompts(ps);
    if(ok){ addLog('success','已应用预设模式',name); toast('已应用模式：'+name); renderDrawer(); }
  }
  function deletePresetMode(name){ if(!rootWin.confirm('删除模式「'+name+'」？'))return; savePresetModes(getPresetModes().filter(m=>m.name!==name)); renderDrawer(); }
  async function movePrompt(id,dir){
    const ps=clone(getPrompts()); const i=ps.findIndex(p=>String(promptId(p))===String(id)); if(i<0)return; const j=i+Number(dir||0); if(j<0||j>=ps.length)return;
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    const tmp=ps[i]; ps[i]=ps[j]; ps[j]=tmp;
    const ok = await savePrompts(ps); if(ok) renderDrawer();
  }

  function togglePromptSelection(id){
    const set=selectedPromptSet();
    id=String(id);
    if(set.has(id)) set.delete(id); else set.add(id);
    settings.selectedPromptIds=[...set]; saveJson(LS_SETTINGS,settings); renderDrawer();
  }
  function clearPromptSelection(){ settings.selectedPromptIds=[]; saveJson(LS_SETTINGS,settings); renderDrawer(); }
  function toggleArrangeMode(){ settings.arrangeMode=!settings.arrangeMode; if(!settings.arrangeMode) settings.selectedPromptIds=[]; saveJson(LS_SETTINGS,settings); renderDrawer(); }
  async function createFolderFromSelected(){
    const raw = String(rootWin.prompt('请输入文件夹名，格式必须为：emoji + 标题\n例如：🐳思维链、🫧水月、❄️文风', '🐳思维链') || '').trim();
    const info = parseFolderNameInput(raw);
    if(!info){ toast('文件夹名必须是 emoji + 标题，例如：🐳思维链。', 'error'); return; }

    const selected = selectedPromptSet();
    const ps = clone(getPrompts());
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();

    const markerIds = new Set(ps.filter(isFolderMarker).map(p=>String(promptId(p))));
    const chosen = [];
    let firstIndex = -1;
    ps.forEach((p,i)=>{
      const id = String(promptId(p));
      if(selected.has(id) && !markerIds.has(id)){
        if(firstIndex < 0) firstIndex = i;
        chosen.push(p);
      }
    });

    const startPrompt = makeFolderPrompt(info.emoji, info.name, 'start');
    const endPrompt = makeFolderPrompt(info.emoji, info.name, 'end');

    let next;
    if(chosen.length){
      const chosenIds = new Set(chosen.map(p=>String(promptId(p))));
      const rest = ps.filter(p=>!chosenIds.has(String(promptId(p))));
      let insertAt = 0;
      for(let i=0;i<firstIndex;i++) if(!chosenIds.has(String(promptId(ps[i])))) insertAt++;
      next = rest;
      next.splice(insertAt,0,startPrompt,...chosen,endPrompt);
    }else{
      next = ps.concat([startPrompt,endPrompt]);
    }

    const ok = await savePrompts(next);
    if(ok){
      settings.selectedPromptIds=[];
      settings.arrangeMode=true;
      saveJson(LS_SETTINGS,settings);
      addLog('success','已创建预设文件夹',`${info.emoji}${info.name} · ${chosen.length} 个条目`);
      toast('已创建文件夹：'+info.emoji+info.name+'。现在可以拖动 App 放进去。');
      renderDrawer();
    }
  }

  async function createPromptEntry(){
    const name = String(rootWin.prompt('请输入新条目名称：\n例如：🧩新功能、角色分析、剧情提示', '🧩新建条目') || '').trim();
    if(!name){ toast('已取消新建条目。','info'); return; }
    const roleRaw = String(rootWin.prompt('请输入 role：system / user / assistant', 'system') || 'system').trim().toLowerCase();
    const role = ['system','user','assistant'].includes(roleRaw) ? roleRaw : 'system';
    const depthRaw = String(rootWin.prompt('请输入注入深度 depth：', '4') || '4').trim();
    const depth = Number.isFinite(Number(depthRaw)) ? Number(depthRaw) : 4;
    const content = String(rootWin.prompt('请输入条目内容，可留空：', '') || '');

    const ps = clone(getPrompts());
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    const prompt = makeNormalPresetPrompt(name, role, depth, content);

    // 如果当前打开了某个文件夹，就把新条目直接放进该文件夹末尾（结束标记之前）。
    const range = promptFolderRangeByIds(ps, settings.openFolderStartId, settings.openFolderEndId);
    if(range) ps.splice(range.end, 0, prompt);
    else ps.push(prompt);

    const ok = await savePrompts(ps);
    if(ok){
      addLog('success','已新建预设条目',`${prompt.name} · ${prompt.role} · D${prompt.injection_depth}${range?' · 已放入当前文件夹':''}`);
      toast(range ? '已在当前文件夹中新建条目。' : '已在预设末尾新建条目。');
      renderDrawer();
    }
  }

  async function dissolveFolder(startId,endId,title){
    if(!rootWin.confirm('解散文件夹「'+(title||'')+'」？条目会留在原位置，只删除首尾文件夹标记。')) return;
    const ids=new Set([String(startId),String(endId)]);
    const ps=clone(getPrompts()).filter(p=>!ids.has(String(promptId(p))));
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    const ok=await savePrompts(ps);
    if(ok){ addLog('success','已解散预设文件夹',title||''); renderDrawer(); }
  }

  async function renamePromptName(id){
    const ps=clone(getPrompts());
    const p=ps.find(x=>String(promptId(x))===String(id));
    if(!p){ toast('没有找到这个 App。','error'); return; }
    const next=String(rootWin.prompt('重命名 App：', p.name || '') || '').trim();
    if(!next || next===p.name) return;
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    p.name=next;
    const ok=await savePrompts(ps);
    if(ok){ addLog('success','已重命名 App', next); toast('已重命名：'+next); renderDrawer(); }
  }

  async function renameFolderOrDissolve(startId,endId,title){
    const ps=clone(getPrompts());
    const range=findFolderRange(ps,startId,endId);
    if(!range){ toast('没有找到这个文件夹。','error'); return; }
    const st=folderStartInfo(ps[range.start]);
    const current=st ? st.emoji + st.name : (title||'');
    const raw=String(rootWin.prompt(`文件夹操作：
- 输入新的文件夹名可重命名，格式必须为 emoji+标题，例如：🐳思维链
- 输入 DELETE 可解散文件夹
- 留空取消`, current) || '').trim();
    if(!raw) return;
    if(raw === 'DELETE') return dissolveFolder(startId,endId,current);
    const info=parseFolderNameInput(raw);
    if(!info){ toast('文件夹名必须是 emoji + 标题，例如：🐳思维链。', 'error'); return; }
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    const start=ps[range.start], end=ps[range.end];
    start.name = `${info.emoji}${info.name}`;
    end.name = `${info.emoji}/${info.name}`;
    start.extra = Object.assign({}, start.extra||{}, {xueyueFolder:true,type:'start',folderName:info.name,emoji:info.emoji});
    end.extra = Object.assign({}, end.extra||{}, {xueyueFolder:true,type:'end',folderName:info.name,emoji:info.emoji});
    const ok=await savePrompts(ps);
    if(ok){ addLog('success','已重命名文件夹', `${current} → ${info.emoji}${info.name}`); toast('已重命名文件夹：'+info.emoji+info.name); renderDrawer(); }
  }

  function extractBlocks(text){ const re=/<XUEYUE>\s*([\s\S]*?)\s*<\/XUEYUE>/gi, arr=[]; let m; while((m=re.exec(text))) arr.push(m[1].trim()); return arr; }
  function removeXueyue(text){ return String(text||'').replace(/\n?\s*<XUEYUE>\s*[\s\S]*?\s*<\/XUEYUE>\s*/gi,'\n').replace(/\n{3,}/g,'\n\n').trim(); }

  const STORY_TAGS = ['FixedAppendix','DynamicAppendix','RouteOptions','RouteOptionA','RouteOptionB','RouteOptionC','XUEYUE'];
  function boundaryIndex(text, start) {
    if (!settings.tagBoundaryProtect) return -1;
    const src = String(text || '');
    const tags = ['UpdateVariable','Variables','Analysis','JSONPatch','Tips','Status','Lore','Memory','WorldState','visual_cards','CG','XUEYUE','FixedAppendix','DynamicAppendix','RouteOptions'];
    let best = -1;
    for (const t of tags) {
      const re = new RegExp(`<${t}(?:\\s[^>]*)?>|<\\/${t}>`, 'ig');
      let m;
      while ((m = re.exec(src))) {
        if (m.index > start && (best < 0 || m.index < best)) best = m.index;
      }
    }
    return best;
  }
  function repairOneTag(text, tag) {
    let src = String(text || '');
    let changed = false;
    // 修复 <Tag> ... <Tag> 这种同名开闭错误：第二个同名开标签视为闭合。
    if (settings.sameOpenAsCloseFix) {
      const openRe = new RegExp(`<${tag}\\s*>`, 'ig');
      const closeRe = new RegExp(`<\\/${tag}>`, 'ig');
      let search = 0;
      while (true) {
        openRe.lastIndex = search;
        const first = openRe.exec(src);
        if (!first) break;
        closeRe.lastIndex = first.index + first[0].length;
        const close = closeRe.exec(src);
        openRe.lastIndex = first.index + first[0].length;
        const second = openRe.exec(src);
        if (second && (!close || second.index < close.index)) {
          src = src.slice(0, second.index) + `</${tag}>` + src.slice(second.index + second[0].length);
          changed = true;
          search = second.index + tag.length + 3;
        } else search = first.index + first[0].length;
      }
    }
    // 自动补齐最后一个未闭合标签，边界保护避免吞掉后续 UpdateVariable / Analysis 等标签。
    if (settings.autoCloseTags) {
      const openRe = new RegExp(`<${tag}\\s*>`, 'ig');
      const closeRe = new RegExp(`<\\/${tag}>`, 'ig');
      const opens = [...src.matchAll(openRe)].map(m => m.index);
      const closes = [...src.matchAll(closeRe)].map(m => m.index);
      if (opens.length > closes.length) {
        const lastOpen = opens[opens.length - 1];
        const b = boundaryIndex(src, lastOpen + 1);
        const insertAt = b > 0 ? b : src.length;
        src = src.slice(0, insertAt).trimEnd() + `\n</${tag}>` + src.slice(insertAt);
        changed = true;
      }
    }
    return { text: src, changed };
  }
  function repairStoryTagsText(text) {
    let src = String(text || ''), changed = false;
    for (const tag of STORY_TAGS) {
      const r = repairOneTag(src, tag);
      src = r.text; changed = changed || r.changed;
    }
    return { text: src, changed };
  }

  function tagBlocks(text,tag){ const re=new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`,'gi'), a=[]; let m; while((m=re.exec(String(text||'')))) a.push({raw:m[0],content:m[1].trim()}); return a; }
  function removeTag(text,tag){ return String(text||'').replace(new RegExp(`\\n?\\s*<${tag}>[\\s\\S]*?<\\/${tag}>\\s*\\n?`,'gi'),'\n').replace(/\n{3,}/g,'\n\n').trim(); }
  function field(text,name){ const m=String(text||'').match(new RegExp(`${name}\\s*[:：]\\s*[\"“]?([^\"”\\n\\r]+)[\"”]?`,'i')); return m?m[1].trim():''; }
  function parseRoutes(txt){ return ['A','B','C'].map(l=>{ const b=tagBlocks(txt,`RouteOption${l}`)[0]; if(!b) return null; return {id:(field(b.content,'路线ID')||l).toUpperCase(),title:field(b.content,'按钮标题')||`路线 ${l}`,desc:field(b.content,'按钮描述'),instruction:field(b.content,'下一章指令'),raw:b.content}; }).filter(Boolean); }
  function stripRouteOptionsFromText(text){
    return String(text||'')
      .replace(/\n?\s*<RouteOptions>[\s\S]*?<\/RouteOptions>\s*\n?/gi,'\n')
      .replace(/\n?\s*<RouteOption[A-Z]>[\s\S]*?<\/RouteOption[A-Z]>\s*\n?/gi,'\n')
      .replace(/\n{3,}/g,'\n\n')
      .trim();
  }
  function extractEmbeddedRouteOptions(text){
    const blocks = tagBlocks(text,'RouteOptions');
    const routes=[];
    let raw='';
    for(const b of blocks){ raw = b.raw; routes.push(...parseRoutes(b.content)); }
    return { raw, routes };
  }
  function displayVal(value){
    const v = String(value||'').trim().replace(/^['\"“”]+|['\"“”]+$/g,'');
    return v || '未记录';
  }
  function archiveEmptyValue(value){
    const v = displayVal(value);
    return /^(无|否|未激活|不生成|0\/4|未记录|none|null|false)$/i.test(v);
  }
  function chipHtml(label,value,accent=false){
    const v=displayVal(value);
    const cls = archiveEmptyValue(v) ? ' muted' : (accent ? ' accent' : '');
    return `<span class="xy-archive-chip${cls}"><em>${esc(label)}</em>${esc(v)}</span>`;
  }
  function firstNonEmpty(){
    for(const v of arguments){ const s=displayVal(v); if(s && s!=='未记录') return s; }
    return '未记录';
  }
  function shortText(text,n=68){
    const s=String(text||'').replace(/\s+/g,' ').trim();
    if(!s) return '未记录';
    return s.length>n ? s.slice(0,n-1)+'…' : s;
  }
  function dynamicSummaryInfo(content){
    const c=stripRouteOptionsFromText(content);
    const mode=field(c,'当前模式');
    const frozen=field(c,'主线冻结');
    const route=field(c,'当前执行路线');
    const status=field(c,'状态说明');
    const title=field(c,'本卷标题');
    const state=field(c,'当前状态');
    return {clean:c, mode, frozen, route, status, title, state};
  }
  function archiveSectionHtml(title, lines){
    const body = (lines||[]).filter(Boolean).map(line=>{
      const m=String(line).match(/^\s*([^：:]{1,18})\s*[:：]\s*(.*)$/);
      if(m){
        const val = displayVal(m[2]);
        const muted = archiveEmptyValue(val) ? ' muted' : '';
        return `<div class="xy-archive-line${muted}"><span>${esc(m[1])}</span><b>${esc(val)}</b></div>`;
      }
      return `<div class="xy-archive-textline">${esc(line)}</div>`;
    }).join('');
    return `<section class="xy-archive-section"><h4>${esc(title)}</h4>${body || '<div class="xy-archive-textline muted">无</div>'}</section>`;
  }
  function dynamicDetailHtml(content){
    const clean=stripRouteOptionsFromText(content);
    const lines=clean.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const sections=[]; let currentTitle='剧情运行状态'; let current=[];
    const push=()=>{ if(current.length) sections.push(archiveSectionHtml(currentTitle,current)); current=[]; };
    for(const line of lines){
      if(/^(.{2,24})[:：]\s*$/.test(line) && !/["“”]/.test(line)){
        push(); currentTitle=line.replace(/[:：]\s*$/,'');
      }else current.push(line);
    }
    push();
    return sections.join('') || archiveSectionHtml('剧情档案',[clean]);
  }

  function cgHash(text){
    const s=String(text||''); let h=0;
    for(let i=0;i<s.length;i++) h=((h<<5)-h+s.charCodeAt(i))|0;
    return Math.abs(h);
  }
  function processCgText(text){
    let cleaned=String(text||''), changed=false, extracted=false;
    const blocks=[];
    const stamp=Date.now();
    let idx=0;
    // CG 是正文演出内容，不能像 DynamicAppendix 一样统一塞到楼层末尾。
    // 因此这里把原始 [CG]/<CG> 区块替换为轻量占位符，后续显示层在原位置渲染虚拟 CG 卡。
    cleaned = cleaned.replace(/\[CG\]\s*([\s\S]*?)\s*\[\/CG\]|<CG>\s*([\s\S]*?)\s*<\/CG>/gi, (raw, b1, b2) => {
      const content=String(b1||b2||'').trim();
      if(!content) return '';
      const id='cg_'+stamp+'_'+idx+'_'+cgHash(content).toString(36);
      const tag=b1!=null?'[CG]':'<CG>';
      blocks.push({ id, content, tag, slot:`<xueyue-cg-slot data-id="${id}"></xueyue-cg-slot>` });
      idx++;
      extracted=true;
      if(settings.cgRemoveOutput === false) return raw;
      changed=true;
      return `\n<xueyue-cg-slot data-id="${id}"></xueyue-cg-slot>\n`;
    }).replace(/\n{3,}/g,'\n\n').trim();
    const cgVirtual={ blocks, savedAt:Date.now(), inlineSlots:true };
    if(blocks.length) addLog('success','CG 已提取',`共 ${blocks.length} 个 CG 区块，已保留原位占位符`);
    return {cleaned, changed, extracted, cgVirtual};
  }

  function cgDataFromResult(prevData, cgResult){
    const old=prevData&&typeof prevData==='object'?prevData:{};
    const v=cgResult&&cgResult.cgVirtual?cgResult.cgVirtual:{};
    const blocks=Array.isArray(v.blocks)&&v.blocks.length?v.blocks:(Array.isArray(old.blocks)?old.blocks:[]);
    if(!blocks.length) return old;
    return { blocks, savedAt:Date.now() };
  }
  function getCgVirtualData(messageId){
    const data=getRawMessageData(messageId);
    const v=data && data[CG_DATA_KEY];
    return v && typeof v==='object' ? v : null;
  }
  function cgCssUrl(url){
    const u=String(url||'').trim();
    if(!u) return 'none';
    return `url("${u.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}")`;
  }
  function chooseCgBackground(content, messageId){
    const mode=settings.cgBackgroundMode||'smart';
    if(mode==='none') return '';
    if(mode==='fixed') return settings.cgFixedBackgroundUrl||'';
    const lib=Array.isArray(CG_BACKGROUND_LIBRARY)?CG_BACKGROUND_LIBRARY.filter(x=>x&&x.url):[];
    if(!lib.length) return settings.cgFixedBackgroundUrl||'';
    const seed=cgHash(String(content||'')+String(messageId));
    if(mode==='random') return lib[seed%lib.length].url;
    const text=String(content||'').toLowerCase();
    let best=null;
    for(const item of lib){
      let score=0;
      for(const kw of item.keywords||[]){ const k=String(kw).toLowerCase().trim(); if(k&&text.includes(k)) score+=Math.max(1,Math.min(4,k.length)); }
      if(!best||score>best.score) best={item,score};
    }
    if(best&&best.score>0) return best.item.url;
    return lib[seed%lib.length].url;
  }
  function cgCardHtml(block, messageId, index){
    const content=String(block&&block.content||'').trim();
    const bg=chooseCgBackground(content,messageId);
    const collapsed=settings.cgDefaultCollapsed!==false?'':' open';
    const style=`--xy-cg-bg:${cgCssUrl(bg)};--xy-cg-opacity:${clamp(Number(settings.cgBackgroundOpacity)||70,0,100,70)/100};--xy-cg-blur:${clamp(Number(settings.cgBackgroundBlur)||0,0,30,0)}px`;
    const body=esc(content).replace(/\n/g,'<br>');
    return `<details class="xueyue-cg-card" data-xy-cg-index="${index}" style="${style}"${collapsed}><summary class="xueyue-cg-head"><span class="xy-cg-sigil">${esc(settings.cgSigil||'✦')}</span><span class="xy-cg-title"><b>${esc(settings.cgTitle||'世界回响')}</b><em>${esc(settings.cgSubtitle||'LORE SIGNAL')}</em></span><span class="xy-cg-click">点击展开</span></summary><div class="xueyue-cg-body">${body}</div><div class="xueyue-cg-foot"><span>CG</span><span>VIRTUAL CARD</span></div></details>`;
  }
  function cgInlineNode(block,messageId,index){
    const wrap=rootDoc.createElement('div');
    wrap.className='xueyue-cg-inline';
    wrap.dataset.xyMessageId=String(messageId);
    wrap.dataset.xyCgId=String(block&&block.id||'');
    wrap.dataset.xyCgIndex=String(index);
    wrap.innerHTML=cgCardHtml(block,messageId,index);
    return wrap;
  }

  function updateExistingInlineCgCards(root,messageId,blocks){
    let count=0;
    const byId=new Map((blocks||[]).map((b,i)=>[String(b.id||''),{block:b,index:i}]));
    root.querySelectorAll?.(`.xueyue-cg-inline[data-xy-message-id="${messageId}"]`).forEach(el=>{
      const id=String(el.dataset.xyCgId||'');
      const item=byId.get(id);
      if(!item) return;
      el.innerHTML=cgCardHtml(item.block,messageId,item.index);
      count++;
    });
    return count;
  }

  function replaceNativeCgSlots(root,messageId,blocks){
    let count=0;
    const byId=new Map((blocks||[]).map((b,i)=>[String(b.id||''),{block:b,index:i}]));
    root.querySelectorAll?.('xueyue-cg-slot').forEach((slot,order)=>{
      const id=String(slot.getAttribute('data-id')||'');
      const item=byId.get(id) || {block:blocks[order],index:order};
      if(!item.block) return;
      slot.replaceWith(cgInlineNode(item.block,messageId,item.index));
      count++;
    });
    return count;
  }

  function replaceTextCgSlots(root,messageId,blocks){
    let count=0;
    const byId=new Map((blocks||[]).map((b,i)=>[String(b.id||''),{block:b,index:i}]));
    const walker=rootDoc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const v=String(node.nodeValue||'');
        return /<xueyue-cg-slot\b/i.test(v) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    for(const node of nodes){
      const text=String(node.nodeValue||'');
      const re=/<xueyue-cg-slot\b[^>]*data-id=["']([^"']+)["'][^>]*><\/xueyue-cg-slot>/ig;
      let last=0, m, frag=rootDoc.createDocumentFragment(), hit=false;
      while((m=re.exec(text))){
        const before=text.slice(last,m.index); if(before) frag.appendChild(rootDoc.createTextNode(before));
        const item=byId.get(String(m[1]));
        if(item&&item.block){ frag.appendChild(cgInlineNode(item.block,messageId,item.index)); count++; hit=true; }
        else frag.appendChild(rootDoc.createTextNode(m[0]));
        last=re.lastIndex;
      }
      if(!hit) continue;
      const after=text.slice(last); if(after) frag.appendChild(rootDoc.createTextNode(after));
      node.parentNode.replaceChild(frag,node);
    }
    return count;
  }

  function renderVirtualCgCards(root,messageId){
    if(!settings.cgEnabled || !settings.cgVirtualCard) return 0;
    const data=getCgVirtualData(messageId);
    const blocks=data&&Array.isArray(data.blocks)?data.blocks:[];
    if(!blocks.length) return 0;

    // 先更新已经在原位渲染过的 CG 卡；不要移除它们，否则占位符已经不存在会导致卡片丢失。
    let count=updateExistingInlineCgCards(root,messageId,blocks);

    // 新渲染楼层时，原文中的 <xueyue-cg-slot> 会重新出现；在原位置替换为 CG 卡。
    count += replaceNativeCgSlots(root,messageId,blocks);
    count += replaceTextCgSlots(root,messageId,blocks);

    // 兼容旧版本数据：旧数据没有原位占位符，只能作为兜底追加到末尾。
    if(!count){
      root.querySelectorAll?.(`.xueyue-cg-virtual[data-xy-message-id="${messageId}"]`).forEach(x=>x.remove());
      const wrap=rootDoc.createElement('div');
      wrap.className='xueyue-cg-virtual';
      wrap.dataset.xyMessageId=String(messageId);
      wrap.innerHTML=blocks.map((b,i)=>cgCardHtml(b,messageId,i)).join('');
      root.appendChild(wrap);
      count=blocks.length;
    }else{
      // 如果从旧版迁移过来，已经有尾部兜底卡，原位渲染成功后要清理它。
      root.querySelectorAll?.(`.xueyue-cg-virtual[data-xy-message-id="${messageId}"]`).forEach(x=>x.remove());
    }
    return count;
  }

  function processStoryText(text){
    let cleaned=String(text||''), changed=false, extracted=false;
    const archiveVirtual = { dynamicText:'', routeOptionsText:'', routes:[], savedAt:Date.now() };
    if(settings.tagRepairEnabled){
      const rr=repairStoryTagsText(cleaned);
      cleaned=rr.text;
      changed=changed||rr.changed;
      if(rr.changed) addLog('success','已自动修复剧情标签','补齐或修正了未闭合/同名闭合标签');
    }
    const m=getStory();
    const fb=tagBlocks(cleaned,'FixedAppendix');
    if(fb.length){
      m.fixedText=fb.at(-1).content;
      extracted=true;
      if(settings.storyRemoveFixedOutput){ cleaned=removeTag(cleaned,'FixedAppendix'); changed=true; }
    }
    const db=tagBlocks(cleaned,'DynamicAppendix');
    let embeddedRouteRaw='', embeddedRoutes=[];
    if(db.length){
      const rawDynamic = db.at(-1).content;
      const embedded = extractEmbeddedRouteOptions(rawDynamic);
      embeddedRouteRaw = embedded.raw || '';
      embeddedRoutes = embedded.routes || [];
      m.dynamicText=stripRouteOptionsFromText(rawDynamic);
      archiveVirtual.dynamicText=m.dynamicText;
      const frozen=/限制级事件中|主线冻结\s*[:：]\s*["“]?是|事件进行中|当前模式\s*[:：]\s*["“]?限制级事件中/.test(m.dynamicText);
      if(settings.freezeModeEnabled){ m.freezeActive=!!frozen; if(m.freezeActive) m.eventText=m.dynamicText; }
      extracted=true;
      if(settings.dynamicArchiveRemoveOutput !== false){ cleaned=removeTag(cleaned,'DynamicAppendix'); changed=true; }
    }
    const rb=tagBlocks(cleaned,'RouteOptions');
    if(rb.length || embeddedRoutes.length){
      const lastRouteBlock=rb.at(-1);
      const routeRaw = lastRouteBlock ? lastRouteBlock.raw : embeddedRouteRaw;
      const routes = lastRouteBlock ? parseRoutes(lastRouteBlock.content) : embeddedRoutes;
      m.routeOptionsText=routeRaw || '';
      m.lastRoutes=routes || [];
      archiveVirtual.routeOptionsText=routeRaw || '';
      archiveVirtual.routes=m.lastRoutes;
      extracted=true;
      if(rb.length && settings.routeOptionsRemoveOutput !== false){ cleaned=removeTag(cleaned,'RouteOptions'); changed=true; }
    }
    if(extracted){
      m.lastExtractedAt=Date.now();
      saveStory(m);
      addLog('success','剧情档案已提取',`固定:${fb.length} 动态:${db.length} 路线:${rb.length}`);
    }
    return {cleaned,changed,extracted,archiveVirtual};
  }

  function processPayloads(payloads,messageId){ const s=getState(); let changed=0; for(const p of payloads){ if(!p||typeof p!=='object') continue; if(p.type==='character_register'){ const c=p.character||{}; const name=String(c.name||'').trim(); if(!name) continue; if(!s.characters[name]){s.characters[name]=createChar(c); addToGroup(s,name,'newCharacters'); if(settings.registerNewAsActive) addToGroup(s,name,'active'); changed++;} } else if(p.type==='state_patch'){ for(const path of Object.keys(p.updates||{})){ if(!path.startsWith('characters.')) continue; const cn=path.split('.')[1]; if(!s.characters[cn]) continue; let val=p.updates[path], old=getByPath(s,path); if(typeof val==='string'&&/^[+-]\d+/.test(val.trim())) val=path.includes('.metrics.')?clamp(Number(old||0)+Number(val),0,100,0):Number(old||0)+Number(val); else if(path.includes('.metrics.')) val=clamp(val,0,100,0); setByPath(s,path,val); s.characters[cn].meta.updatedAt=nowIso(); s.characters[cn].meta.lastTouchedMessageId=messageId; changed++; } } else if(p.type==='foreshadow_update'){ for(const u of p.updates||[]){ const c=s.characters[u.character]; if(!c) continue; c.foreshadows=c.foreshadows||[]; const id=u.id||('fs_'+Date.now()); let f=c.foreshadows.find(x=>x.id===id); if(!f){f={id,title:u.title||'未命名伏笔',hint:u.hint||'',schemaType:u.schemaType||'relationshipSchema',status:u.status||'unresolved',intensity:clamp(u.intensity,1,5,1),lastTouched:u.lastTouched||''}; c.foreshadows.push(f);} else Object.assign(f,u); changed++; } } }
    if(changed) saveState(s); return changed; }

  async function latestAssistant(){ if(!api.getChatMessages) return null; try{ const last=api.getLastMessageId?Number(api.getLastMessageId()):null; if(Number.isFinite(last)){ for(let i=last;i>=Math.max(0,last-30);i--){ const m=(api.getChatMessages(i)||[])[0]; if(m&&m.role==='assistant') return m; } } return (api.getChatMessages(-1)||[])[0]; } catch(e){ addLog('error','读取聊天消息失败',e.message); return null; } }
  async function processLatest(){
    const msg=await latestAssistant();
    if(!msg||msg.role!=='assistant'){addLog('info','未找到助手消息');return;}
    const st=settings.storyArchiveEnabled&&settings.storyAutoProcess?processStoryText(msg.message):{cleaned:msg.message,changed:false,extracted:false,archiveVirtual:null};
    if(settings.cgEnabled && settings.cgAutoProcess){
      const cg = processCgText(st.cleaned);
      st.cleaned = cg.cleaned;
      st.changed = st.changed || cg.changed;
      st.extracted = st.extracted || cg.extracted;
      st.cgVirtual = cg.cgVirtual;
    }
    const blocks=extractBlocks(st.cleaned);
    if(blocks.length){
      try{
        const payloads=blocks.map(x=>JSON.parse(x));
        const n=processPayloads(payloads,msg.message_id);
        const cleaned=removeXueyue(st.cleaned);
        if(settings.removeTagAfterParse&&api.setChatMessages) await api.setChatMessages([messagePatchWithArchiveData(msg, cleaned, st)],{refresh:'affected'});
        addLog('success','XUEYUE 已处理',`更新 ${n} 项`);
      } catch(e){ addLog('error','XUEYUE 解析失败',e.message); toast('XUEYUE 解析失败','error'); }
    } else if(st.changed&&api.setChatMessages){
      await api.setChatMessages([messagePatchWithArchiveData(msg, st.cleaned, st)],{refresh:'affected'});
    } else if(!st.extracted) addLog('info','未发现可处理标签');
    renderIfOpen();
    setTimeout(()=>beautifyMessageArchives(msg.message_id,{forceVirtual:true}),180);
  }


  function ensureArchiveStyle(){
    if(rootDoc.getElementById('xueyue-archive-display-style-v0622')) return;
    const st=rootDoc.createElement('style');
    st.id='xueyue-archive-display-style-v0622';
    st.textContent=`
.xueyue-archive-card{position:relative;margin:12px 0;border:1px solid rgba(127,252,255,.34);border-radius:18px;background:linear-gradient(145deg,rgba(9,16,34,.86),rgba(32,25,54,.74));box-shadow:0 0 20px rgba(127,252,255,.10),inset 0 0 20px rgba(178,140,255,.04);overflow:hidden;color:#eefbff;max-width:100%;touch-action:auto;overscroll-behavior:auto}
.xueyue-archive-card::before{content:'';position:absolute;inset:0;background:var(--xy-archive-bg,none) center/cover no-repeat;opacity:var(--xy-archive-opacity,.2);filter:blur(var(--xy-archive-blur,0px));transform:scale(1.03);pointer-events:none}.xueyue-archive-card::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(255,255,255,.035) 0 1px,transparent 1px 5px);opacity:.12;pointer-events:none}.xueyue-archive-inner{position:relative;z-index:1}.xueyue-archive-summary{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;padding:10px 12px;font-weight:900;color:#bffcf2;letter-spacing:.04em;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;list-style:none}.xueyue-archive-summary::-webkit-details-marker{display:none}.xueyue-archive-card.collapsed .xueyue-archive-inner,.xueyue-archive-card.collapsed .xueyue-archive-glance{display:none!important}.xueyue-archive-card.collapsed .xueyue-archive-summary{border-bottom-color:transparent}.xy-archive-mark{font-size:18px;filter:drop-shadow(0 0 8px rgba(127,252,255,.38))}.xy-archive-title{font-size:15px;line-height:1.25}.xy-archive-click{font-size:10px;color:rgba(238,251,255,.56);font-weight:800;letter-spacing:.10em;text-transform:uppercase}.xueyue-archive-glance{position:relative;z-index:1;padding:0 12px 11px;display:grid;gap:8px}.xy-archive-chips{display:flex;gap:6px;flex-wrap:wrap}.xy-archive-chip{display:inline-flex;gap:5px;align-items:center;border:1px solid rgba(127,252,255,.22);border-radius:999px;background:rgba(0,0,0,.18);padding:3px 8px;font-size:11px;line-height:1.35;color:#effcff}.xy-archive-chip em{font-style:normal;color:rgba(191,252,242,.74)}.xy-archive-chip.muted{opacity:.58}.xy-archive-chip.accent{border-color:rgba(255,230,109,.36);color:#fff5c2;background:rgba(255,230,109,.08)}.xy-archive-brief{font-size:12px;line-height:1.55;color:rgba(238,251,255,.78);padding:7px 9px;border-radius:12px;background:rgba(0,0,0,.14);border:1px solid rgba(255,255,255,.06)}.xueyue-archive-body{position:relative;z-index:2;border-top:1px solid rgba(127,252,255,.16);padding:10px 12px;max-height:min(56dvh,460px);overflow-y:auto!important;overflow-x:hidden!important;background:rgba(0,0,0,.13);-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior:contain!important;pointer-events:auto!important;scrollbar-width:thin}.xy-archive-section{border:1px solid rgba(127,252,255,.12);border-radius:14px;background:rgba(0,0,0,.12);padding:9px;margin:0 0 9px}.xy-archive-section h4{margin:0 0 7px;color:#bffcf2;font-size:13px;letter-spacing:.04em}.xy-archive-line{display:grid;grid-template-columns:minmax(82px,34%) 1fr;gap:8px;align-items:start;padding:4px 0;border-top:1px solid rgba(255,255,255,.035);font-size:12px;line-height:1.5}.xy-archive-line:first-of-type{border-top:0}.xy-archive-line span{color:rgba(191,252,242,.72)}.xy-archive-line b{font-weight:600;color:rgba(238,251,255,.9)}.xy-archive-line.muted b,.xy-archive-textline.muted{color:rgba(238,251,255,.48);font-weight:500}.xy-archive-textline{font-size:12px;line-height:1.55;color:rgba(238,251,255,.86);padding:3px 0}.xueyue-archive-card.fixed{border-color:rgba(202,255,144,.28);box-shadow:0 0 18px rgba(202,255,144,.07),inset 0 0 22px rgba(202,255,144,.035)}.xueyue-archive-card.fixed .xueyue-archive-summary{color:#d9ffb6}.xueyue-route-card{margin:12px 0;padding:13px;border:1px solid rgba(178,140,255,.38);border-radius:18px;background:linear-gradient(135deg,rgba(9,14,32,.88),rgba(46,25,76,.64));box-shadow:0 0 22px rgba(178,140,255,.10),inset 0 0 24px rgba(127,252,255,.035);position:relative;overflow:hidden}.xueyue-route-card:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(127,252,255,.08),transparent);opacity:.38;pointer-events:none}.xueyue-route-title{position:relative;font-weight:900;color:#f0e7ff;letter-spacing:.08em;margin-bottom:9px}.xueyue-route-grid{position:relative;display:grid;gap:9px}.xueyue-route-btn{width:100%;text-align:left;border:1px solid rgba(127,252,255,.35);border-radius:15px;background:rgba(0,0,0,.26);color:#eefbff;padding:10px 12px;cursor:pointer;box-shadow:inset 0 0 18px rgba(127,252,255,.04);font:inherit}.xueyue-route-btn:hover{border-color:rgba(127,252,255,.75);box-shadow:0 0 18px rgba(127,252,255,.18)}.xueyue-route-btn.selected{border-color:#ffe66d;color:#fff7c7;background:rgba(255,230,109,.10)}.xueyue-route-id{display:inline-block;color:#7ffcff;font-weight:900;margin-right:8px}.xueyue-route-desc{display:block;margin-top:4px;color:rgba(238,251,255,.66);font-size:12px;line-height:1.45}
@media(max-width:560px){.xueyue-archive-summary{padding:9px 10px}.xy-archive-title{font-size:14px}.xy-archive-chip{font-size:10px;padding:3px 7px}.xy-archive-line{grid-template-columns:1fr;gap:2px}.xueyue-archive-body{max-height:54dvh!important;padding:9px}}

.xueyue-event-card{margin:12px 0;padding:13px;border:1px solid rgba(127,252,255,.34);border-radius:18px;background:linear-gradient(135deg,rgba(5,16,30,.88),rgba(26,22,58,.62));box-shadow:0 0 22px rgba(127,252,255,.09),inset 0 0 24px rgba(255,255,255,.035);position:relative;overflow:hidden}.xueyue-event-card:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(127,252,255,.08),transparent);opacity:.32;pointer-events:none}.xueyue-event-title{position:relative;font-weight:950;color:#bffcf2;letter-spacing:.08em;margin-bottom:9px}.xueyue-event-grid{position:relative;display:grid;gap:9px}.xueyue-event-item{border:1px solid rgba(127,252,255,.24);border-radius:16px;background:rgba(0,0,0,.20);padding:10px}.xueyue-event-item.active{border-color:rgba(255,230,109,.58);background:rgba(255,230,109,.07)}.xueyue-event-head{display:flex;gap:8px;align-items:center;justify-content:space-between;font-weight:900;color:#effcff}.xueyue-event-tag{font-size:10px;border:1px solid rgba(127,252,255,.28);border-radius:999px;padding:2px 7px;color:#7ffcff;background:rgba(127,252,255,.08)}.xueyue-event-desc{margin-top:6px;color:rgba(238,251,255,.70);font-size:12px;line-height:1.5}.xueyue-event-btn,.xueyue-return-btn{margin-top:8px;border:1px solid rgba(127,252,255,.38);border-radius:13px;background:rgba(0,0,0,.24);color:#eefbff;padding:7px 10px;cursor:pointer;font:inherit}.xueyue-event-btn:hover,.xueyue-return-btn:hover{border-color:rgba(127,252,255,.8);box-shadow:0 0 16px rgba(127,252,255,.18)}.xueyue-return-btn{border-color:rgba(255,230,109,.36);color:#fff3b2;background:rgba(255,230,109,.08)}
.xueyue-cg-card{position:relative;margin:12px 0;border:1px solid rgba(218,201,157,.28);border-left:3px solid rgba(127,252,255,.62);border-radius:17px;background:linear-gradient(135deg,rgba(10,14,25,.90),rgba(24,27,38,.78));box-shadow:0 14px 32px rgba(0,0,0,.30),0 0 24px rgba(127,252,255,.09),inset 0 0 30px rgba(255,255,255,.035);overflow:hidden;color:#f7f8fa;isolation:isolate}.xueyue-cg-card:before{content:'';position:absolute;inset:0;z-index:-2;background-image:var(--xy-cg-bg,none);background-size:cover;background-position:center;opacity:var(--xy-cg-opacity,.7);filter:blur(var(--xy-cg-blur,0px)) saturate(1.04) contrast(1.04);transform:scale(1.02)}.xueyue-cg-card:after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(4,7,13,.58),rgba(4,6,12,.86)),repeating-linear-gradient(180deg,rgba(255,255,255,.026) 0 1px,transparent 1px 5px);pointer-events:none}.xueyue-cg-head{display:flex;align-items:center;gap:10px;padding:10px 13px;cursor:pointer;list-style:none;border-bottom:1px solid rgba(127,252,255,.16);background:linear-gradient(90deg,rgba(0,0,0,.22),rgba(255,255,255,.035),rgba(0,0,0,.1))}.xueyue-cg-head::-webkit-details-marker{display:none}.xy-cg-sigil{width:26px;height:26px;display:grid;place-items:center;border-radius:9px;border:1px solid rgba(127,252,255,.24);background:rgba(127,252,255,.08);color:#bffcf2;text-shadow:0 0 10px rgba(127,252,255,.45)}.xy-cg-title{flex:1;min-width:0}.xy-cg-title b{display:block;font-size:14px;letter-spacing:.08em;color:#fffaf0}.xy-cg-title em{display:block;font-style:normal;font-size:10px;letter-spacing:.16em;color:rgba(235,231,220,.52);text-transform:uppercase}.xy-cg-click{font-size:10px;color:rgba(238,251,255,.52);letter-spacing:.12em}.xueyue-cg-body{padding:13px 15px;max-height:420px;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior:contain!important;line-height:1.78;color:rgba(247,248,250,.93);text-shadow:0 1px 8px rgba(0,0,0,.38);white-space:normal}.xueyue-cg-foot{display:flex;justify-content:space-between;padding:7px 14px 9px;border-top:1px solid rgba(127,252,255,.13);font-size:10px;letter-spacing:.12em;color:rgba(235,231,220,.42);background:rgba(0,0,0,.16)}
`;
    rootDoc.head.appendChild(st);
  }

  function archiveCssVars(){
    const bg=(settings.archiveFoldBgUrl||'').trim();
    const op=clamp(Number(settings.archiveFoldBgOpacity)||0,0,100,20)/100;
    const blur=clamp(Number(settings.archiveFoldBgBlur)||0,0,30,0);
    return `--xy-archive-bg:${bg?`url(&quot;${esc(bg)}&quot;)`:'none'};--xy-archive-opacity:${op};--xy-archive-blur:${blur}px`;
  }

  function archiveCardHtml(kind,title,content){
    const key = 'archive_' + String(kind || 'card') + '_' + cgHash(String(content || '')).toString(36);
    const defaultOpen = settings.dynamicArchiveDefaultCollapsed ? false : true;
    const isOpen = archiveOpenStates.has(key) ? !!archiveOpenStates.get(key) : defaultOpen;
    const collapsed = isOpen ? '' : ' collapsed';
    const clickText = isOpen ? '点击收起' : '点击展开';
    if(kind === 'dynamic'){
      const info = dynamicSummaryInfo(content);
      const status = firstNonEmpty(info.status, info.title, info.clean);
      const brief = shortText(status, 76);
      const chips = [
        chipHtml('模式', info.mode || '未记录', true),
        chipHtml('冻结', info.frozen || '否'),
        chipHtml('路线', info.route || '无'),
        chipHtml('状态', info.state || '未记录')
      ].join('');
      return `<div class="xueyue-archive-card dynamic${collapsed}" data-xy-archive-card="true" data-xy-archive-key="${esc(key)}" style="${archiveCssVars()}"><div class="xueyue-archive-summary" data-xy-archive-toggle="true" role="button" tabindex="0"><span class="xy-archive-mark">❄</span><b class="xy-archive-title">${esc(title || '动态剧情档案')}</b><span class="xy-archive-click">${clickText}</span></div><div class="xueyue-archive-glance"><div class="xy-archive-chips">${chips}</div><div class="xy-archive-brief">${esc(brief)}</div></div><div class="xueyue-archive-inner"><div class="xueyue-archive-body">${dynamicDetailHtml(info.clean)}</div></div></div>`;
    }
    const fixed = stripRouteOptionsFromText(content);
    return `<div class="xueyue-archive-card fixed${collapsed}" data-xy-archive-card="true" data-xy-archive-key="${esc(key)}" style="${archiveCssVars()}"><div class="xueyue-archive-summary" data-xy-archive-toggle="true" role="button" tabindex="0"><span class="xy-archive-mark">✦</span><b class="xy-archive-title">${esc(title || '固定剧情档案')}</b><span class="xy-archive-click">${clickText}</span></div><div class="xueyue-archive-inner"><div class="xueyue-archive-body">${esc(fixed)}</div></div></div>`;
  }

  function renderInlineMarkdown(text,messageId){
    const src=String(text||'').trim();
    if(!src) return '';
    try{ if(api.formatAsDisplayedMessage) return api.formatAsDisplayedMessage(src,{message_id: messageId}); }catch(_){ }
    return `<p>${esc(src).replace(/\n/g,'<br>')}</p>`;
  }


  function eventCardHtml(dynamicText){
    const events=parseEventTracks(dynamicText||'');
    const story=getStory();
    const active=story.activeEvent;
    if(!events.length && !active) return '';
    const activeId=active&&active.id;
    const items=events.map(ev=>`<div class="xueyue-event-item ${activeId===ev.id?'active':''}"><div class="xueyue-event-head"><span>${esc(ev.id)} · ${esc(ev.title)}</span><span class="xueyue-event-tag">${esc(eventModeLabel(ev))}</span></div><div class="xueyue-event-desc">${esc(ev.type||'事件')} · ${esc(ev.status||'available')} · 风险 ${esc(ev.risk||'未记录')}<br>${esc(ev.summary||ev.entry||'')}</div><button class="xueyue-event-btn" data-xy-event-id="${esc(ev.id)}">${activeId===ev.id?'继续事件':esc(eventButtonText(ev))}</button></div>`).join('');
    const ret=active?`<button class="xueyue-return-btn" data-xy-return-mainline="true">返回主线</button>`:'';
    return `<div class="xueyue-event-card"><div class="xueyue-event-title">副本事件</div><div class="xueyue-event-grid">${items||'<div class="xueyue-event-item active"><div class="xueyue-event-head"><span>'+esc(active.id||'ACTIVE')+' · '+esc(active.title||'当前事件')+'</span><span class="xueyue-event-tag">'+esc(eventModeLabel(active))+'</span></div></div>'}</div>${ret}</div>`;
  }

  function routeCardHtml(content) {
    if (!settings.routeButtonsEnabled) return '';
    const src = String(content||'');
    if(/生成状态\s*[:：]\s*["“]?不生成/i.test(src)) return '';
    const routes = parseRoutes(src);
    if (!routes.length) return '';
    const story = getStory();
    const selectedId = story.selectedRoute && story.selectedRoute.id;
    return `<div class="xueyue-route-card"><div class="xueyue-route-title">${esc(settings.routeTitle || '路线选择')}</div><div class="xueyue-route-grid">${routes.map(r=>`<button class="xueyue-route-btn ${selectedId===r.id?'selected':''}" data-xy-route-id="${esc(r.id)}"><span class="xueyue-route-id">${esc(r.id)}</span>${esc(r.title||('路线 '+r.id))}${r.desc?`<span class="xueyue-route-desc">${esc(r.desc)}</span>`:''}</button>`).join('')}</div></div>`;
  }

  function getDisplayedMessageEl(messageId){
    try{
      if(api.retrieveDisplayedMessage){
        const $mes = api.retrieveDisplayedMessage(messageId);
        if($mes && $mes.length) return $mes[0];
      }
    }catch(_){ }
    return rootDoc.querySelector(`.mes[mesid="${messageId}"] .mes_text, .mes[mesid="${messageId}"] .mes_block .mes_text`);
  }

  function getRawMessageText(messageId){
    try{
      if(!api.getChatMessages) return '';
      const arr = api.getChatMessages(Number(messageId));
      const msg = arr && arr[0];
      return msg && typeof msg.message === 'string' ? msg.message : '';
    }catch(_){ return ''; }
  }


  function getRawMessageData(messageId){
    try{
      if(!api.getChatMessages) return {};
      const arr = api.getChatMessages(Number(messageId));
      const msg = arr && arr[0];
      return msg && msg.data && typeof msg.data === 'object' ? msg.data : {};
    }catch(_){ return {}; }
  }

  function archiveVirtualDataFromStoryResult(prevData, storyResult){
    const old = prevData && typeof prevData === 'object' ? prevData : {};
    const v = storyResult && storyResult.archiveVirtual ? storyResult.archiveVirtual : {};
    const dynamicText = v.dynamicText || old.dynamicText || '';
    const routeOptionsText = v.routeOptionsText || old.routeOptionsText || '';
    const routes = Array.isArray(v.routes) && v.routes.length ? v.routes : (Array.isArray(old.routes) ? old.routes : []);
    if(!dynamicText && !routeOptionsText && !routes.length) return old;
    return { dynamicText, routeOptionsText, routes, savedAt: Date.now() };
  }

  function messagePatchWithArchiveData(msg, messageText, storyResult){
    const data = Object.assign({}, (msg && msg.data) || {});
    data.xueyueArchiveVirtual = archiveVirtualDataFromStoryResult(data.xueyueArchiveVirtual, storyResult);
    if(storyResult && storyResult.cgVirtual) data[CG_DATA_KEY] = cgDataFromResult(data[CG_DATA_KEY], storyResult);
    return { message_id: msg.message_id, message: messageText, data };
  }

  function getArchiveVirtualData(messageId){
    const data = getRawMessageData(messageId);
    const v = data && data.xueyueArchiveVirtual;
    return v && typeof v === 'object' ? v : null;
  }

  function htmlFragment(html){
    const t = rootDoc.createElement('template');
    t.innerHTML = String(html || '').trim();
    return t.content.cloneNode(true);
  }

  function updateRouteButtonSelection(scope){
    try{
      const story = getStory();
      const selectedId = story.selectedRoute && story.selectedRoute.id;
      (scope || rootDoc).querySelectorAll?.('.xueyue-route-btn[data-xy-route-id]').forEach(btn=>{
        btn.classList.toggle('selected', !!selectedId && btn.dataset.xyRouteId === String(selectedId));
      });
    }catch(_){ }
  }

  function extractArchiveBlocksFromRaw(raw){
    const map = { FixedAppendix: [], DynamicAppendix: [], RouteOptions: [] };
    const re = /<(FixedAppendix|DynamicAppendix|RouteOptions)>\s*([\s\S]*?)\s*<\/\1>/gi;
    let m;
    while((m = re.exec(String(raw||'')))){
      const tag = m[1];
      map[tag].push({ tag, raw: m[0], content: (m[2] || '').trim(), index: m.index });
    }
    return map;
  }


  function normalizeArchiveTagName(name){
    const n = String(name || '').toLowerCase();
    if(n === 'fixedappendix') return 'FixedAppendix';
    if(n === 'dynamicappendix') return 'DynamicAppendix';
    if(n === 'routeoptions') return 'RouteOptions';
    return '';
  }

  function renderVirtualArchiveCards(root, messageId, rawText, force=false){
    const rawHasTags = !!(rawText && /<(?:DynamicAppendix|RouteOptions)>/i.test(rawText));
    const virtualData = getArchiveVirtualData(messageId);
    if(!rawHasTags && !virtualData) return 0;
    root.querySelectorAll?.(`.xueyue-archive-virtual[data-xy-message-id="${messageId}"], .xueyue-archive-virtual:not([data-xy-message-id])`).forEach(x=>x.remove());
    if(!force && root.querySelector?.('.xueyue-archive-card,.xueyue-route-card')) return 0;
    const frag = rootDoc.createDocumentFragment();
    let count = 0;
    if(rawHasTags){
      const blocks = extractArchiveBlocksFromRaw(rawText);
      for(const b of blocks.DynamicAppendix){
        if(!settings.dynamicArchiveBeautify) continue;
        frag.appendChild(htmlFragment(archiveCardHtml('dynamic', settings.dynamicArchiveTitle || '动态剧情档案', b.content)));
        const evh=eventCardHtml(b.content); if(evh){ frag.appendChild(htmlFragment(evh)); count++; }
        count++;
      }
      for(const b of blocks.RouteOptions){
        if(!settings.routeButtonsEnabled) continue;
        frag.appendChild(htmlFragment(routeCardHtml(b.content)));
        count++;
      }
    } else if(virtualData){
      if(settings.dynamicArchiveBeautify && virtualData.dynamicText){
        frag.appendChild(htmlFragment(archiveCardHtml('dynamic', settings.dynamicArchiveTitle || '动态剧情档案', virtualData.dynamicText)));
        const evh=eventCardHtml(virtualData.dynamicText); if(evh){ frag.appendChild(htmlFragment(evh)); count++; }
        count++;
      }
      if(settings.routeButtonsEnabled){
        const routeText = virtualData.routeOptionsText || (Array.isArray(virtualData.routes) && virtualData.routes.length ? virtualData.routes.map(r=>`<RouteOption${r.id||''}>\n路线ID: ${r.id||''}\n按钮标题: ${r.title||''}\n按钮描述: ${r.desc||''}\n下一章指令: ${r.instruction||''}\n</RouteOption${r.id||''}>`).join('\n') : '');
        if(routeText){ frag.appendChild(htmlFragment(routeCardHtml(routeText))); count++; }
      }
    }
    if(!count) return 0;
    const wrap = rootDoc.createElement('div');
    wrap.className = 'xueyue-archive-virtual';
    wrap.dataset.xyMessageId = String(messageId);
    wrap.appendChild(frag);
    root.appendChild(wrap);
    return count;
  }

  function removeVirtualArchiveCards(root, messageId){
    let removed = 0;
    try{
      root.querySelectorAll?.(`.xueyue-archive-virtual[data-xy-message-id="${messageId}"], .xueyue-archive-virtual:not([data-xy-message-id])`).forEach(x=>{ x.remove(); removed++; });
    }catch(_){ }
    return removed;
  }
  function decorateDisplayedMessageArchives(messageId, options={}){
    const root = getDisplayedMessageEl(messageId);
    if(!root) return false;
    const rawText = getRawMessageText(messageId);
    const forceVirtual = !!options.forceVirtual;

    // 最终策略：剧情档案/路线以“缓存 + 删除原文 + 虚拟卡”呈现。
    // 这里不再尝试原地替换 DynamicAppendix 文本，避免和其它美化 DOM 互相抢楼层。
    removeVirtualArchiveCards(root, messageId);
    const virtualCount = renderVirtualArchiveCards(root, messageId, rawText, forceVirtual || true);
    const cgCount = renderVirtualCgCards(root, messageId);
    updateRouteButtonSelection(root);
    if(virtualCount || cgCount) root.dataset.xyArchiveDecorated = VERSION;
    return !!(virtualCount || cgCount || root.querySelector?.('.xueyue-archive-card,.xueyue-route-card,.xueyue-cg-card'));
  }

  function beautifyMessageArchives(messageId, options={}){
    if(!settings.archiveDisplayEnabled) return false;
    try{
      ensureArchiveStyle();
      // 只基于当前页面 DOM 的文本节点局部替换；不重写整条消息，避免让其他美化失效。
      return decorateDisplayedMessageArchives(messageId, options);
    }catch(err){ addLog('error','剧情档案美化失败',err.message||String(err)); return false; }
  }

  function beautifyRecentArchives(limit=30, options={}){
    if(!settings.archiveDisplayEnabled || !api.getLastMessageId || !api.getChatMessages) return 0;
    let last=0; try{ last=Number(api.getLastMessageId())||0; }catch(_){ return 0; }
    const start=Math.max(0,last-limit+1);
    let count=0;
    for(let i=start;i<=last;i++) if(beautifyMessageArchives(i, options)) count++;
    return count;
  }

  async function manualBeautifyRecentArchives(limit=50){
    if(!settings.archiveDisplayEnabled){ toast('剧情档案折叠美化未启用。','warning'); return; }
    if(!api.getLastMessageId || !api.getChatMessages){ toast('无法读取聊天楼层。','error'); return; }
    let last=0; try{ last=Number(api.getLastMessageId())||0; }catch(_){ return; }
    const start=Math.max(0,last-limit+1);
    const refreshOnly=[];
    const updates=[];
    let tagCount=0, cleanedFixed=0, extracted=0;
    for(let i=start;i<=last;i++){
      const raw = getRawMessageText(i);
      if(!raw || !/(<(?:FixedAppendix|DynamicAppendix|RouteOptions)>|\[CG\]|<CG>)/i.test(raw)) continue;
      tagCount++;
      let nextText = raw;
      try{
        const processed = settings.storyArchiveEnabled ? processStoryText(raw) : {cleaned: raw, changed:false, extracted:false};
        if(settings.cgEnabled){
          const cg = processCgText(processed.cleaned || raw);
          processed.cleaned = cg.cleaned;
          processed.changed = processed.changed || cg.changed;
          processed.extracted = processed.extracted || cg.extracted;
          processed.cgVirtual = cg.cgVirtual;
        }
        nextText = processed.cleaned || raw;
        if(processed.extracted) extracted++;
        if(nextText !== raw){
          if(/<FixedAppendix>/i.test(raw) && !/<FixedAppendix>/i.test(nextText)) cleanedFixed++;
          const oldData = getRawMessageData(i);
          const nextData = Object.assign({}, oldData, { xueyueArchiveVirtual: archiveVirtualDataFromStoryResult(oldData.xueyueArchiveVirtual, processed) });
          if(processed.cgVirtual) nextData[CG_DATA_KEY] = cgDataFromResult(oldData[CG_DATA_KEY], processed);
          updates.push({message_id:i, message:nextText, data:nextData});
        } else {
          refreshOnly.push({message_id:i});
        }
      }catch(err){
        addLog('error','手动美化前处理失败',`#${i}: ${err.message||String(err)}`);
        refreshOnly.push({message_id:i});
      }
    }
    try{
      if(api.setChatMessages){
        if(updates.length) await api.setChatMessages(updates,{refresh:'affected'});
        if(refreshOnly.length) await api.setChatMessages(refreshOnly,{refresh:'affected'});
      }
    }catch(err){
      addLog('error','手动美化刷新楼层失败',err.message||String(err));
    }
    setTimeout(()=>{
      let ok=0;
      for(let i=start;i<=last;i++) if(beautifyMessageArchives(i,{forceVirtual:true})) ok++;
      addLog('success','手动剧情美化完成',`扫描:${limit}楼 含标签:${tagCount} 成功美化:${ok} 摘除固定:${cleanedFixed} 提取缓存:${extracted}`);
      toast(`手动美化完成：${ok} 楼；固定档案摘除 ${cleanedFixed} 楼。`);
      renderIfOpen();
    }, updates.length||refreshOnly.length ? 360 : 80);
  }


  function getNarrativeModel(id){ return NARRATIVE_MODELS.find(m=>m.id===id||m.name===id) || null; }
  function setNarrativeModel(id){ const m=getStory(); m.narrativeModel=getNarrativeModel(id); saveStory(m); addLog('success','已选择叙事模型',m.narrativeModel?m.narrativeModel.name:'未选择'); renderDrawer(); }
  function clearNarrativeModel(){ const m=getStory(); m.narrativeModel=null; saveStory(m); renderDrawer(); }

  function fieldValue(block, names){
    const arr=Array.isArray(names)?names:[names];
    for(const name of arr){
      const re=new RegExp('^\\s*'+String(name).replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')+'\\s*[:：]\\s*["“]?([^"”\\n\\r]+)["”]?\\s*$', 'im');
      const mm=String(block||'').match(re);
      if(mm && mm[1]) return mm[1].trim();
    }
    return '';
  }
  function parseCompactEventLine(id, line){
    const v=String(line||'').replace(/^\s*"|"\s*$/g,'').trim();
    if(!v || v==='无') return null;
    const parts=v.split(/[｜|]/).map(x=>x.trim());
    return {id, title:parts[0]||id, status:parts[1]||'available', entryMode:'user', povCharacter:'无', type:'事件', narrativeStage:'', entry:parts[2]||'', summary:parts[3]||'', mainlineRelation:parts[3]||'', risk:'middle', progress:'not_started'};
  }
  function parseEventTracks(text){
    const src=String(text||'');
    const list=[];
    const re=/^\s*(E-\d{3})\s*[:：]\s*([\s\S]*?)(?=^\s*E-\d{3}\s*[:：]|^\s*(?:限制级事件|限制级事件结算|RouteOptions|剧情运行状态|本卷剧情规划|详细章节规划)\s*[:：]|$)/gmi;
    let m;
    while((m=re.exec(src))){
      const id=m[1].trim();
      const block=(m[2]||'').trim();
      if(!block) continue;
      let title=fieldValue(block,['事件名','标题','事件名称']);
      if(!title){ const one=block.split(/\n/).find(Boolean)||''; const compact=parseCompactEventLine(id, one); if(compact){ list.push(compact); continue; } }
      if(!title || title==='无') continue;
      const ev={
        id,
        title,
        status:fieldValue(block,'状态')||'available',
        entryMode:fieldValue(block,'进入方式')||'user',
        povCharacter:fieldValue(block,'视点角色')||'无',
        type:fieldValue(block,'类型')||'事件',
        narrativeStage:fieldValue(block,'叙事阶段')||'',
        entry:fieldValue(block,['触发条件','入口'])||'',
        summary:fieldValue(block,['事件摘要','摘要'])||'',
        mainlineRelation:fieldValue(block,'主线关联')||'',
        risk:fieldValue(block,'风险')||'',
        progress:fieldValue(block,'进度')||''
      };
      if(ev.status==='无') continue;
      list.push(ev);
    }
    return list.slice(0,4);
  }
  function mainlineReturnPoint(text){ return fieldValue(text,'主线返回点') || fieldValue(text,'主线冻结点') || dynamicSummaryInfo(text||'').brief || '未记录'; }
  function eventButtonText(ev){ const mode=String(ev.entryMode||'user'); if(mode==='character_pov') return '切入视角'; if(mode==='world') return '观看事件'; return '进入事件'; }
  function eventModeLabel(ev){ const mode=String(ev.entryMode||'user'); if(mode==='character_pov') return 'POV：'+(ev.povCharacter&&ev.povCharacter!=='无'?ev.povCharacter:'角色'); if(mode==='world') return 'WORLD'; return 'USER'; }
  function buildEventPrompt(){
    if(!settings.eventInjectEnabled) return '';
    const m=getStory();
    if(m.returnMainlineNotice){
      const rp=m.returnMainlineNotice.returnPoint||mainlineReturnPoint(m.dynamicText||'');
      return `【雪月 · 返回主线】\n用户已结束或暂离当前副本事件。下一轮请回到 user 所在主线。\n\n主线返回点：\n${rp}\n\n要求：\n- 不要继续推进已退出的副本事件。\n- 可保留事件造成的结果、伏笔和角色记忆。\n- 若副本事件是角色视角或世界镜头，其中信息不等于 user 已知信息，除非剧情自然传递。`;
    }
    const ev=m.activeEvent;
    if(!ev || !ev.id) return '';
    return `【雪月 · 当前副本事件】\n用户选择进入以下副本事件：\n\n事件ID：${ev.id}\n标题：${ev.title||''}\n进入方式：${ev.entryMode||'user'}\n视点角色：${ev.povCharacter||'无'}\n类型：${ev.type||''}\n叙事阶段：${ev.narrativeStage||''}\n入口：${ev.entry||''}\n主线关联：${ev.mainlineRelation||''}\n\n推进要求：\n- 下一轮优先推进该副本事件。\n- 暂停正常主线推进，但不要遗忘主线状态。\n- 事件结束或用户点击返回主线前，不要自动切回主线。\n- 若进入方式为 character_pov 或 world，则该事件中的信息不等于 user 已知信息，除非后续剧情自然传递。`;
  }
  function buildNarrativePrompt(){
    if(!settings.narrativeInjectEnabled) return '';
    const m=getStory(); const nm=m.narrativeModel;
    if(!nm || !nm.name) return '';
    return `【雪月 · 叙事模型】\n当前用户选择的叙事模型：${nm.name}\n结构目标：${nm.goal||''}\n副本事件倾向：${nm.eventStyle||''}\n\n要求：本卷规划、当前叙事阶段与副本事件应围绕该模型组织。`;
  }
  function selectEvent(id){
    const m=getStory(); const events=parseEventTracks(m.dynamicText||''); const ev=events.find(x=>x.id===id);
    if(!ev){ toast('没有找到该副本事件。','error'); return; }
    m.activeEvent=ev; m.returnMainlineNotice=null; saveStory(m); addLog('success','已进入副本事件',`${ev.id} · ${ev.title}`); toast('已选择副本事件：'+ev.title); renderDrawer(); beautifyRecentArchives(50,{forceVirtual:true});
  }
  function returnMainline(){
    const m=getStory(); const ev=m.activeEvent;
    m.returnMainlineNotice={from:ev||null, returnPoint:mainlineReturnPoint(m.dynamicText||''), savedAt:Date.now()};
    m.activeEvent=null; saveStory(m); addLog('success','已设置返回主线',m.returnMainlineNotice.returnPoint); toast('下一轮将注入返回主线提示。'); renderDrawer(); beautifyRecentArchives(50,{forceVirtual:true});
  }
  function clearActiveEvent(){ const m=getStory(); m.activeEvent=null; m.returnMainlineNotice=null; saveStory(m); renderDrawer(); }
  function buildActiveState(){ const s=getState(); let names=settings.onlyInjectActiveCharacters?s.activeCharacters:[...(s.activeCharacters||[]),...(s.characterGroups.globalImportant||[]),...(s.characterGroups.arcImportant||[])]; names=uniq(names).filter(n=>s.characters[n]&&s.characters[n].status!=='archived').slice(0,Number(settings.maxInjectedCharacters)||5); if(!names.length) return ''; return names.map(n=>{ const c=s.characters[n], m=getByPath(c,'relationshipToUser.metrics')||{}; let lines=[`【角色：${c.displayName||n}】`,`定位：${c.role||''}`,`人格基底：${getByPath(c,'corePersonality.base')||''}`,`人格偏移：${getByPath(c,'corePersonality.currentShift')||''}`,`关系图式：${getByPath(c,'schemas.relationshipSchema')||''}`,`防御模式：${getByPath(c,'defensePatterns.primaryDefense')||''}`,`对 user 稳定印象：${getByPath(c,'relationshipToUser.stableImpression')||''}`,`信任模型：${getByPath(c,'relationshipToUser.trustModel')||''}`,`边界模型：${getByPath(c,'relationshipToUser.boundaryModel')||''}`,`关系指标：${METRICS.map(k=>`${k} ${m[k]||0}/100（${metricStage(k,m[k])}）`).join('；')}`]; if(c.foreshadows&&c.foreshadows.length) lines.push('角色伏笔：'+c.foreshadows.filter(f=>f.status!=='closed').slice(0,settings.maxInjectedForeshadows).map(f=>`${f.title}（${f.status}）`).join('；')); return lines.join('\n'); }).join('\n\n'); }
  function buildStoryPrompt(){ if(!settings.storyArchiveEnabled||!settings.storyInjectEnabled) return ''; const m=getStory(), sec=[]; const fixed=[m.fixedText,m.semiFixedText].filter(x=>x&&x.trim()).join('\n\n'); if(fixed) sec.push('【固定/半固定剧情基准】\n'+fixed); if(!sec.length) return ''; return (templates.storyInjection||DEFAULT_TEMPLATES.storyInjection).replace(/{{archiveAppendix}}/g,sec.join('\n\n')); }
  function buildDynamicStoryPrompt(){ if(!settings.storyArchiveEnabled||!settings.storyInjectEnabled||!settings.storyInjectDynamic) return ''; const m=getStory(); if(!m.dynamicText||!String(m.dynamicText).trim()) return ''; return '【动态剧情档案｜仅作当前剧情状态参考】\n'+m.dynamicText; }
  function buildSelectedRoutePrompt(){ if(!settings.storyArchiveEnabled||!settings.storyInjectRoutes) return ''; const m=getStory(); if(!m.selectedRoute) return ''; return (templates.selectedRoute||DEFAULT_TEMPLATES.selectedRoute).replace(/{{routeId}}/g,m.selectedRoute.id||'').replace(/{{title}}/g,m.selectedRoute.title||'').replace(/{{instruction}}/g,m.selectedRoute.instruction||''); }
  function buildFreezePrompt(){ if(!settings.storyArchiveEnabled||!settings.freezeInjectEnabled) return ''; const m=getStory(); if(!m.freezeActive||!m.eventText) return ''; return (templates.freeze||DEFAULT_TEMPLATES.freeze)+'\n\n'+m.eventText; }
  function applyRecommendedInjectionSettings(){ Object.assign(settings,{roleStateDepth:0,formatDepth:1,storyInjectDepth:4,storyInjectDynamicDepth:2,routeInjectDepth:0,freezeInjectDepth:0,labelInjectDepth:0,narrativeInjectDepth:0,eventInjectDepth:0,injectRole:'system',storyInjectRole:'system',routeInjectRole:'system',freezeInjectRole:'system',labelInjectRole:'system',narrativeInjectRole:'system',eventInjectRole:'system',storyInjectDynamic:false,storyInjectRoutes:true,freezeInjectEnabled:true}); saveJson(LS_SETTINGS,settings); addLog('success','已应用推荐注入深度','标签/路线/角色 depth0；XUEYUE格式 depth1；动态剧情 depth2；固定剧情 depth4'); toast('已应用推荐注入深度。'); renderDrawer(); }
  function injectNow(){ if(!settings.enabled||!settings.autoInject||!api.injectPrompts) return; const prompts=[]; const sp=buildStoryPrompt(); if(sp) prompts.push({id:PROMPT_STORY_ID,position:'in_chat',depth:Number(settings.storyInjectDepth)||4,role:settings.storyInjectRole||'system',content:sp,should_scan:true}); const dp=buildDynamicStoryPrompt(); if(dp) prompts.push({id:PROMPT_DYNAMIC_ID,position:'in_chat',depth:Number(settings.storyInjectDynamicDepth)||2,role:settings.storyInjectRole||'system',content:dp,should_scan:true}); const active=buildActiveState(); if(settings.statePromptEnabled) prompts.push({id:PROMPT_STATE_ID,position:'in_chat',depth:Number(settings.roleStateDepth)||0,role:settings.injectRole||'system',content:active?(templates.roleState||DEFAULT_TEMPLATES.roleState).replace(/{{ACTIVE_CHARACTER_STATE}}/g,active):(templates.empty||DEFAULT_TEMPLATES.empty),should_scan:false}); if(settings.formatPromptEnabled&&settings.formatMode!=='off') prompts.push({id:PROMPT_FORMAT_ID,position:'in_chat',depth:Number(settings.formatDepth)||1,role:settings.injectRole||'system',content:templates.formatCompact||DEFAULT_TEMPLATES.formatCompact,should_scan:false}); const np=buildNarrativePrompt(); if(np) prompts.push({id:PROMPT_NARRATIVE_ID,position:'in_chat',depth:Number(settings.narrativeInjectDepth)||0,role:settings.narrativeInjectRole||'system',content:np,should_scan:false}); const rp=buildSelectedRoutePrompt(); if(rp) prompts.push({id:PROMPT_ROUTE_ID,position:'in_chat',depth:Number(settings.routeInjectDepth)||0,role:settings.routeInjectRole||'system',content:rp,should_scan:false}); const ep=buildEventPrompt(); if(ep) prompts.push({id:PROMPT_EVENT_ID,position:'in_chat',depth:Number(settings.eventInjectDepth)||0,role:settings.eventInjectRole||'system',content:ep,should_scan:false}); const fp=buildFreezePrompt(); if(fp) prompts.push({id:PROMPT_FREEZE_ID,position:'in_chat',depth:Number(settings.freezeInjectDepth)||0,role:settings.freezeInjectRole||'system',content:fp,should_scan:false}); const lp=labelInjectPrompt(); if(lp) prompts.push({id:PROMPT_LABEL_ID,position:'in_chat',depth:Number(settings.labelInjectDepth)||0,role:settings.labelInjectRole||'system',content:lp,should_scan:false}); try{api.uninjectPrompts&&api.uninjectPrompts([PROMPT_STATE_ID,PROMPT_FORMAT_ID,PROMPT_STORY_ID,PROMPT_LABEL_ID,PROMPT_DYNAMIC_ID,PROMPT_ROUTE_ID,PROMPT_FREEZE_ID,PROMPT_NARRATIVE_ID,PROMPT_EVENT_ID]); api.injectPrompts(prompts,{once:true}); addLog('success','已注入下一轮生成提示',`共 ${prompts.length} 条`);}catch(e){addLog('error','注入失败',e.message);} }

  function cleanupOldUi(){ for(const id of [IDS.float,IDS.drawer,IDS.style,'xueyue-v066-float','xueyue-v066-drawer','xueyue-v066-style','xueyue-v0520-float','xueyue-v0520-drawer','xueyue-v0520-style','xueyue-v0510-float','xueyue-v0510-drawer','xueyue-v0510-style','xueyue-v059-float','xueyue-v059-drawer','xueyue-v059-style','xueyue-v058-float','xueyue-v058-drawer','xueyue-v057-float','xueyue-v057-drawer','xueyue-v056-float','xueyue-v056-drawer','xueyue-v055-float','xueyue-v055-drawer','xueyue-v040-float','xueyue-v040-drawer','xueyue-v030-float','xueyue-v030-drawer','xueyue-schema-float','xueyue-schema-panel','xueyue-archive-display-style-v0614','xueyue-archive-display-style-v0622','xueyue-archive-display-style-v0621','cg-universal-lore-card-style-cg-universal-lore-card-adaptive-tone']){ try{rootDoc.getElementById(id)?.remove();}catch(_){}} try{rootDoc.querySelectorAll('[id^="xueyue-archive-display-style-"],[id^="cg-universal-lore-card-style-"]').forEach(x=>x.remove());}catch(_){} }
  function ensureStyle(){ if(rootDoc.getElementById(IDS.style)) return; const st=rootDoc.createElement('style'); st.id=IDS.style; st.textContent=`
#${IDS.float}{position:fixed!important;right:-6px!important;top:${Math.max(72,Number(settings.floatTop)||320)}px;width:50px!important;height:50px!important;border-radius:50% 0 0 50%!important;z-index:2147483600!important;display:flex!important;align-items:center!important;justify-content:center!important;background:radial-gradient(circle at 38% 38%,rgba(50,66,82,.98),rgba(10,17,28,.98))!important;border:4px solid rgba(190,252,244,.9)!important;border-right-width:2px!important;color:#effffb!important;font-size:24px!important;box-shadow:0 10px 26px rgba(0,0,0,.45),inset 0 0 18px rgba(190,252,244,.16)!important;cursor:grab!important;touch-action:none!important;user-select:none!important}#${IDS.float}.open{filter:brightness(1.14)}
#${IDS.drawer}{position:fixed!important;left:${Math.max(2,(100-(Number(settings.panelWidthVw)||75))/2)}vw;top:${Math.max(2,(100-(Number(settings.panelHeightVh)||75))/2)}dvh;height:${Math.max(45,Math.min(96,Number(settings.panelHeightVh)||75))}dvh!important;width:${Math.max(45,Math.min(96,Number(settings.panelWidthVw)||75))}vw!important;max-width:calc(100vw - 16px)!important;min-width:min(280px,calc(100vw - 24px))!important;max-height:calc(100dvh - 16px)!important;z-index:2147483599!important;transform:translateY(10px) scale(.985)!important;opacity:0!important;pointer-events:none!important;transition:transform .22s ease,opacity .18s ease!important;color:#eefbff!important;background:radial-gradient(circle at 20% 5%,rgba(190,252,244,.16),transparent 33%),linear-gradient(180deg,rgba(20,32,50,.96),rgba(10,15,28,.97))!important;border:1px solid rgba(190,252,244,.36)!important;border-radius:28px!important;box-shadow:0 24px 72px rgba(0,0,0,.56),0 0 0 1px rgba(255,255,255,.04) inset!important;overflow:hidden!important;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans SC',sans-serif!important}#${IDS.drawer}.open{transform:translateY(0) scale(1)!important;opacity:1!important;pointer-events:auto!important}.xy-head{padding:16px 16px 11px 18px;border-bottom:1px solid rgba(190,252,244,.18);display:flex;justify-content:space-between;align-items:flex-start;cursor:move;user-select:none;touch-action:none}.xy-title{font-size:30px;font-weight:900;letter-spacing:.16em;color:#f1fffc}.xy-sub{font-size:12px;color:rgba(238,251,255,.72);line-height:1.45}.xy-close{width:46px;height:46px;border-radius:16px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:#fff;font-size:30px}.xy-body{height:calc(100% - 91px);overflow:auto;padding:12px 12px calc(22px + env(safe-area-inset-bottom))}.xy-overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}.xy-stat,.xy-card{background:rgba(255,255,255,.07);border:1px solid rgba(190,252,244,.17);border-radius:18px;padding:12px}.xy-stat b{display:block;color:#bffcf2;font-size:18px}.xy-tabs{display:flex;gap:6px;overflow:auto;margin:0 0 12px;padding-bottom:4px}.xy-tab{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;border-radius:999px;padding:8px 11px;white-space:nowrap}.xy-tab.active{background:rgba(190,252,244,.18);border-color:rgba(190,252,244,.48);color:#dffffa}.xy-card{margin-bottom:12px}.xy-card h3{margin:0 0 10px;color:#d9ffb6;font-size:17px}.xy-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.xy-prompt,.xy-char{background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:10px}.xy-prompt-icon{font-size:25px}.xy-prompt-name,.xy-char-name{font-weight:800}.xy-muted,.xy-desc{color:rgba(238,251,255,.72);font-size:12px;line-height:1.45}.xy-badge{font-size:11px;color:#bffcf2;border:1px solid rgba(190,252,244,.3);border-radius:999px;padding:2px 6px}.xy-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}.xy-btn{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;border-radius:12px;padding:7px 10px;font-size:12px}.xy-btn.primary{background:rgba(128,185,255,.22);border-color:rgba(128,185,255,.45)}.xy-btn.good{background:rgba(190,252,244,.14);border-color:rgba(190,252,244,.38)}.xy-btn.danger{background:rgba(255,100,120,.18);border-color:rgba(255,100,120,.4)}.xy-field{display:block;margin:8px 0}.xy-field span{display:block;font-size:12px;color:rgba(238,251,255,.75);margin-bottom:4px}.xy-field input,.xy-field select,.xy-search,textarea{width:100%;box-sizing:border-box;background:rgba(0,0,0,.28);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:8px}textarea{min-height:160px;font-family:ui-monospace,Consolas,monospace;font-size:12px;resize:vertical}.xy-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.xy-pre{white-space:pre-wrap;max-height:260px;overflow:auto;background:rgba(0,0,0,.22);border-radius:14px;padding:10px;font-size:12px}@media(max-width:560px){#${IDS.float}{width:46px!important;height:46px!important;font-size:22px!important}.xy-title{font-size:26px}.xy-grid,.xy-two{grid-template-columns:1fr}.xy-body{padding:10px}.xy-tab{padding:7px 10px}}
.xy-card.xy-preset-shell{background:linear-gradient(180deg,rgba(5,10,24,.72),rgba(8,12,28,.58));border-color:rgba(127,252,255,.28);box-shadow:0 0 28px rgba(127,252,255,.06), inset 0 0 26px rgba(178,140,255,.04)}
.xy-cyber-title{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#7ffcff;font-weight:900;letter-spacing:.12em;text-transform:uppercase;text-shadow:0 0 14px rgba(127,252,255,.38)}
.xy-module-bar{margin:18px 0 10px;padding:9px 10px;border:1px solid rgba(127,252,255,.34);border-left:4px solid rgba(127,252,255,.85);background:linear-gradient(90deg,rgba(127,252,255,.13),rgba(178,140,255,.08),transparent);color:#e8ffff;font-weight:900;letter-spacing:.08em;box-shadow:0 0 20px rgba(127,252,255,.08);display:flex;justify-content:space-between;align-items:center}
.xy-module-count{font-size:11px;color:#a8faff;opacity:.82;font-weight:700}
.xy-app-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:10px;margin-bottom:8px}.xy-prompt.xy-app-key{position:relative;min-height:112px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px 7px;border-radius:18px;overflow:hidden;cursor:pointer;isolation:isolate;transition:transform .16s ease,filter .16s ease,border-color .16s ease,box-shadow .16s ease;background:linear-gradient(145deg,rgba(5,12,25,.88),rgba(17,12,38,.68));border:1px solid rgba(127,252,255,.28);box-shadow:inset 0 0 18px rgba(255,255,255,.035),0 0 0 rgba(0,0,0,0)}
.xy-prompt.xy-app-key::before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 0 35%,rgba(127,252,255,.13) 48%,transparent 62%);transform:translateX(-140%);transition:transform .45s ease;z-index:-1}.xy-prompt.xy-app-key:hover{transform:translateY(-2px);filter:brightness(1.08)}.xy-prompt.xy-app-key:hover::before{transform:translateX(140%)}
.xy-prompt.xy-app-key.on{border-color:rgba(127,252,255,.78);box-shadow:0 0 16px rgba(127,252,255,.18),inset 0 0 22px rgba(127,252,255,.08)}.xy-prompt.xy-app-key.off{border-color:rgba(178,140,255,.42);filter:saturate(.78) brightness(.88);opacity:1;background:linear-gradient(145deg,rgba(11,13,30,.88),rgba(32,18,58,.58));box-shadow:inset 0 0 14px rgba(178,140,255,.045)}.xy-prompt.xy-app-key.off .xy-app-icon,.xy-prompt.xy-app-key.off .xy-app-name{opacity:.82}.xy-prompt.xy-app-key.off:hover{border-color:rgba(178,140,255,.68);box-shadow:0 0 16px rgba(178,140,255,.13),inset 0 0 18px rgba(178,140,255,.06)}.xy-prompt.xy-app-key .xy-app-icon{width:44px;height:44px;border-radius:15px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;font-size:24px;background:radial-gradient(circle at 40% 30%,rgba(127,252,255,.2),rgba(178,140,255,.13) 44%,rgba(0,0,0,.24));border:1px solid rgba(127,252,255,.28);box-shadow:0 0 18px rgba(127,252,255,.11)}.xy-app-name{font-size:12px;font-weight:900;line-height:1.2;color:#f4ffff;max-width:100%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.xy-app-meta{font-size:10px;line-height:1.2;color:#9eefff;margin-top:5px;opacity:.82}.xy-app-state{position:absolute;top:6px;right:6px;font-size:9px;padding:2px 5px;border-radius:999px;border:1px solid rgba(127,252,255,.36);color:#7ffcff;background:rgba(0,0,0,.28)}.xy-prompt.xy-app-key.off .xy-app-state{color:#a9a9c8;border-color:rgba(169,169,200,.25)}.xy-mini-actions{position:absolute;left:6px;bottom:6px;right:6px;display:flex;justify-content:center;gap:4px;opacity:0;transform:translateY(4px);transition:opacity .15s ease,transform .15s ease}.xy-app-key:hover .xy-mini-actions,.xy-app-key:focus-within .xy-mini-actions{opacity:1;transform:translateY(0)}.xy-mini{min-width:24px;height:22px;padding:0 5px;border-radius:8px;border:1px solid rgba(127,252,255,.28);background:rgba(3,8,18,.72);color:#dfffff;font-size:11px}.xy-folder-module{border:1px solid rgba(178,140,255,.24);border-radius:20px;padding:0 8px 8px;background:linear-gradient(180deg,rgba(178,140,255,.06),rgba(127,252,255,.035))}.xy-folder-module .xy-module-bar{border-color:rgba(178,140,255,.45);border-left-color:rgba(178,140,255,.88);background:linear-gradient(90deg,rgba(178,140,255,.18),rgba(127,252,255,.09),transparent)}.xy-folder-tools{margin-left:auto}.xy-app-key.selected{border-color:rgba(255,230,109,.85)!important;box-shadow:0 0 0 2px rgba(255,230,109,.18),0 0 26px rgba(255,230,109,.26)!important}.xy-app-key.selected .xy-app-state{color:#ffe66d;border-color:rgba(255,230,109,.65)}.xy-btn:disabled{opacity:.45;filter:grayscale(.4);cursor:not-allowed}
.xy-folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,138px));gap:12px;padding:8px 4px 10px}.xy-folder-app{position:relative;min-height:132px;border-radius:22px;border:1px solid rgba(178,140,255,.54);background:linear-gradient(145deg,rgba(14,12,42,.86),rgba(8,25,40,.72));display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;cursor:pointer;box-shadow:0 0 24px rgba(178,140,255,.13),inset 0 0 24px rgba(127,252,255,.06);overflow:hidden}.xy-folder-app::before{content:'';position:absolute;inset:-40%;background:radial-gradient(circle at 20% 10%,rgba(127,252,255,.2),transparent 28%),radial-gradient(circle at 80% 85%,rgba(178,140,255,.24),transparent 30%);opacity:.72}.xy-folder-app:hover{transform:translateY(-2px);box-shadow:0 0 32px rgba(178,140,255,.22),0 0 18px rgba(127,252,255,.12),inset 0 0 24px rgba(127,252,255,.08)}.xy-folder-icon{width:58px;height:52px;border-radius:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:4px;padding:8px;align-items:center;justify-items:center;border:1px solid rgba(127,252,255,.34);background:linear-gradient(135deg,rgba(127,252,255,.16),rgba(178,140,255,.16));box-shadow:0 0 18px rgba(127,252,255,.14);z-index:1}.xy-folder-icon span{grid-column:1/3;font-size:24px;line-height:1}.xy-folder-icon i{display:block;width:10px;height:10px;border-radius:4px;background:rgba(127,252,255,.45);box-shadow:0 0 8px rgba(127,252,255,.28)}.xy-folder-name{z-index:1;margin-top:10px;color:#f3ffff;font-weight:900;font-size:13px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.xy-folder-meta{z-index:1;margin-top:4px;font-size:10px;color:#b8efff;opacity:.88}.xy-folder-pop-layer{position:fixed;inset:0;z-index:2147483644;display:flex;align-items:center;justify-content:center;padding:18px}.xy-folder-pop-backdrop{position:absolute;inset:0;background:rgba(2,5,13,.42);backdrop-filter:blur(7px)}.xy-folder-pop{position:relative;width:min(680px,88vw);max-height:min(78dvh,720px);overflow:auto;border-radius:28px;border:1px solid rgba(127,252,255,.42);background:linear-gradient(145deg,rgba(8,14,33,.94),rgba(21,11,48,.9));box-shadow:0 22px 80px rgba(0,0,0,.56),0 0 42px rgba(127,252,255,.16),inset 0 0 34px rgba(178,140,255,.08);padding:16px}.xy-folder-pop-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.xy-folder-pop-title{font-size:24px;color:#dfffff;font-weight:1000;letter-spacing:.06em;text-shadow:0 0 16px rgba(127,252,255,.32)}.xy-folder-pop-title span{display:inline-block;margin-right:8px}.xy-close2{width:42px;height:42px;border-radius:16px;border:1px solid rgba(127,252,255,.32);background:rgba(255,255,255,.08);color:#fff;font-size:30px;line-height:1;cursor:pointer}.xy-folder-inside-grid{grid-template-columns:repeat(auto-fill,minmax(94px,1fr));padding-bottom:8px}@media(max-width:560px){.xy-folder-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.xy-folder-app{min-height:116px;border-radius:18px;padding:10px}.xy-folder-icon{width:50px;height:46px}.xy-folder-pop-layer{padding:10px}.xy-folder-pop{width:94vw;max-height:82dvh;border-radius:24px;padding:13px}.xy-folder-pop-title{font-size:21px}.xy-folder-inside-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.xy-narrative-grid{grid-template-columns:repeat(auto-fit,minmax(170px,1fr));}
.xy-narrative-card{appearance:none;-webkit-appearance:none;text-align:left;border:1px solid rgba(151,255,255,.26);border-radius:16px;padding:12px;background:linear-gradient(145deg,rgba(7,16,31,.72),rgba(22,29,50,.52));color:#eefbff;box-shadow:inset 0 0 18px rgba(127,252,255,.06),0 0 14px rgba(124,210,255,.06);cursor:pointer;min-height:150px;font-family:inherit;transition:.16s transform,.16s border-color,.16s box-shadow,.16s background;}
.xy-narrative-card:hover,.xy-narrative-card.selected{border-color:rgba(151,255,255,.78);box-shadow:0 0 20px rgba(127,252,255,.22),inset 0 0 24px rgba(127,252,255,.10);transform:translateY(-1px);}
.xy-narrative-title{font-size:20px;font-weight:900;color:#caffc7;text-shadow:0 0 10px rgba(196,255,199,.25);margin-bottom:4px;}
.xy-narrative-name{font-size:12px;color:rgba(245,250,255,.74);letter-spacing:.06em;margin-bottom:8px;}
.xy-narrative-desc{font-size:13px;line-height:1.55;color:rgba(255,255,255,.86);margin-bottom:8px;}
.xy-narrative-meta{font-size:11px;line-height:1.45;color:rgba(184,255,255,.70);margin-top:4px;}
.xy-narrative-current{border:1px solid rgba(151,255,255,.25);border-radius:14px;padding:10px 12px;background:rgba(0,0,0,.16);margin:8px 0 12px;line-height:1.65;color:rgba(255,255,255,.86);}
.xy-narrative-current b{color:#caffc7;font-size:18px;}.xy-narrative-current span{color:rgba(184,255,255,.76);}
@media(max-width:560px){.xy-narrative-grid{grid-template-columns:1fr}.xy-narrative-card{min-height:auto}.xy-narrative-title{font-size:18px}}
.xy-mode-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(135px,1fr));gap:9px}.xy-mode{border:1px solid rgba(178,140,255,.34);background:linear-gradient(145deg,rgba(178,140,255,.12),rgba(127,252,255,.07));border-radius:16px;padding:10px;box-shadow:0 0 18px rgba(178,140,255,.08)}.xy-mode-name{font-weight:900;color:#e6d9ff}.xy-scanline{position:relative}.xy-scanline::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,rgba(255,255,255,.035) 0 1px,transparent 1px 4px);opacity:.14;border-radius:inherit}
.xy-phone-shell{position:relative;margin-top:12px;padding:16px 12px 22px;border-radius:30px;border:1px solid rgba(127,252,255,.24);background:radial-gradient(circle at 16% 0%,rgba(127,252,255,.12),transparent 30%),radial-gradient(circle at 82% 18%,rgba(178,140,255,.14),transparent 34%),linear-gradient(180deg,rgba(3,9,22,.74),rgba(6,10,24,.62));box-shadow:inset 0 0 34px rgba(255,255,255,.035),0 0 28px rgba(127,252,255,.055);overflow:hidden}
.xy-phone-shell::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(90deg,rgba(127,252,255,.028) 0 1px,transparent 1px 18px),repeating-linear-gradient(180deg,rgba(178,140,255,.022) 0 1px,transparent 1px 18px);opacity:.55}
.xy-phone-home{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:16px 12px;align-items:start}.xy-phone-home .xy-app-key{margin:0}.xy-phone-folder{position:relative;min-height:108px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;border:0;background:transparent;color:#f6ffff;cursor:pointer;padding:3px 2px}.xy-phone-folder:hover{filter:brightness(1.12);transform:translateY(-2px)}
.xy-phone-folder-icon{position:relative;width:68px;height:68px;border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(127,252,255,.08) 42%,rgba(178,140,255,.1));border:1px solid rgba(127,252,255,.28);box-shadow:0 10px 22px rgba(0,0,0,.28),0 0 18px rgba(127,252,255,.1),inset 0 0 20px rgba(255,255,255,.05);display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:8px;box-sizing:border-box;backdrop-filter:blur(8px)}
.xy-phone-mini{display:flex;align-items:center;justify-content:center;border-radius:7px;font-size:11px;background:linear-gradient(145deg,rgba(5,12,25,.94),rgba(24,15,50,.72));border:1px solid rgba(127,252,255,.22);box-shadow:inset 0 0 8px rgba(127,252,255,.04);overflow:hidden}.xy-phone-folder-emoji{position:absolute;right:-5px;top:-7px;width:28px;height:28px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(8,16,30,.94);border:1px solid rgba(127,252,255,.38);box-shadow:0 0 14px rgba(127,252,255,.16);font-size:18px}.xy-phone-folder-name{font-weight:900;font-size:12px;line-height:1.18;max-width:86px;text-shadow:0 0 12px rgba(127,252,255,.18);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.xy-phone-folder-meta{font-size:10px;color:#9eefff;opacity:.82}.xy-phone-folder{touch-action:manipulation}.xy-phone-folder-actions{position:absolute;left:50%;bottom:-5px;transform:translateX(-50%);display:flex;gap:4px;opacity:0;transition:opacity .14s ease}.xy-phone-folder:hover .xy-phone-folder{touch-action:manipulation}.xy-phone-folder-actions{opacity:1}
.xy-drag-ghost{position:fixed;z-index:2147483647;pointer-events:none;width:90px;height:108px;border-radius:22px;border:1px solid rgba(127,252,255,.75);background:linear-gradient(145deg,rgba(5,12,25,.92),rgba(30,12,58,.78));box-shadow:0 0 28px rgba(127,252,255,.3),0 18px 40px rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;font-size:28px;color:#dfffff;transform:translate(-50%,-50%) scale(1.02)}
.xy-app-drag-ready{outline:2px solid rgba(255,230,109,.7)!important;box-shadow:0 0 30px rgba(255,230,109,.28)!important}.xy-arrange .xy-app-key,.xy-arrange .xy-phone-folder{touch-action:none!important;user-select:none!important;-webkit-user-select:none!important}.xy-app-dragging{opacity:.42!important;filter:brightness(.8) saturate(.8)!important}.xy-drop-hover{outline:2px solid rgba(255,230,109,.82)!important;box-shadow:0 0 0 3px rgba(255,230,109,.14),0 0 32px rgba(255,230,109,.28)!important;filter:brightness(1.12)!important}.xy-phone-home.xy-drop-hover,.xy-folder-pop.xy-drop-hover,.xy-folder-inside-grid.xy-drop-hover{outline:1px dashed rgba(127,252,255,.8)!important;outline-offset:-6px}
.xy-folder-pop-layer{position:fixed;inset:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:18px}.xy-folder-pop-backdrop{position:absolute;inset:0;background:rgba(3,7,16,.44);backdrop-filter:blur(7px) saturate(1.16)}.xy-folder-pop{position:relative;width:min(520px,calc(100vw - 28px));max-height:min(76dvh,680px);overflow:auto;border-radius:34px;padding:18px;background:linear-gradient(180deg,rgba(15,22,42,.88),rgba(7,12,26,.92));border:1px solid rgba(127,252,255,.32);box-shadow:0 28px 86px rgba(0,0,0,.58),0 0 36px rgba(127,252,255,.12),inset 0 0 34px rgba(255,255,255,.035)}.xy-folder-pop-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px}.xy-folder-pop-title{font-size:24px;font-weight:950;color:#f2fffc;text-shadow:0 0 18px rgba(127,252,255,.26)}.xy-folder-pop-title span{display:inline-flex;align-items:center;justify-content:center;margin-right:8px;width:38px;height:38px;border-radius:15px;background:rgba(127,252,255,.12);border:1px solid rgba(127,252,255,.28)}.xy-close2{width:42px;height:42px;border-radius:16px;border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.1);color:#fff;font-size:28px}.xy-folder-inside-grid{grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:12px}.xy-folder-pop .xy-app-key{min-height:118px}
@media(max-width:560px){.xy-app-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.xy-phone-home{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 8px}.xy-phone-shell{padding:14px 8px 20px;border-radius:24px}.xy-phone-folder-icon{width:62px;height:62px;border-radius:20px}.xy-phone-folder{min-height:112px}.xy-prompt.xy-app-key{min-height:104px;border-radius:16px}.xy-prompt.xy-app-key .xy-app-icon{width:40px;height:40px;font-size:22px}.xy-app-name{font-size:11px}.xy-mini-actions{opacity:1;position:static;margin-top:6px;transform:none}.xy-mini{height:21px}}
`; rootDoc.head.appendChild(st); applyBg(); }
  function applyBg(){ const drawer=rootDoc.getElementById(IDS.drawer); if(!drawer) return; drawer.style.setProperty('--xy-bg-url', settings.backgroundUrl?`url("${settings.backgroundUrl}")`:'none'); if(settings.backgroundUrl){ drawer.style.backgroundImage=`linear-gradient(rgba(10,15,28,${1-settings.backgroundOpacity/100}),rgba(10,15,28,${1-settings.backgroundOpacity/100})),url("${settings.backgroundUrl}")`; drawer.style.backgroundSize='cover'; drawer.style.backgroundPosition='center'; drawer.style.backdropFilter=`blur(${settings.backgroundBlur}px)`; } }
  function createUi(){ ensureStyle(); ensureArchiveStyle(); const btn=rootDoc.createElement('button'); btn.id=IDS.float; btn.type='button'; btn.innerHTML='❄'; btn.title='雪月'; btn.style.top=(Number(settings.floatTop)||320)+'px'; bindFloat(btn); rootDoc.body.appendChild(btn); const drawer=rootDoc.createElement('div'); drawer.id=IDS.drawer; drawer.innerHTML=`<div class="xy-head"><div><div class="xy-title">雪月</div><div class="xy-sub">预设控制台 · by@冬月</div></div><button class="xy-close" data-action="close">×</button></div><div class="xy-body"></div>`; drawer.addEventListener('click',onClick,true); drawer.addEventListener('change',onChange,true); drawer.addEventListener('input',onInput,true); bindAppDrag(drawer); rootDoc.body.appendChild(drawer); applyPanelSize(drawer); bindPanelDrag(drawer); applyBg(); }
  function viewportSize(){ return { w: rootWin.innerWidth || rootDoc.documentElement.clientWidth || 800, h: rootWin.innerHeight || rootDoc.documentElement.clientHeight || 700 }; }
  function applyPanelSize(drawer){
    if(!drawer) return;
    const w=clamp(Number(settings.panelWidthVw)||75,45,96,75);
    const h=clamp(Number(settings.panelHeightVh)||75,45,96,75);
    settings.panelWidthVw=w; settings.panelHeightVh=h;
    // 旧版 CSS 里 width/height/left/top 带 !important；普通 inline style 会被压住。
    // 这里必须用 setProperty(..., 'important')，否则滑条看起来能动但窗口不会变。
    drawer.style.setProperty('width', w+'vw', 'important');
    drawer.style.setProperty('height', h+'dvh', 'important');
    drawer.style.setProperty('max-width', 'calc(100vw - 16px)', 'important');
    drawer.style.setProperty('max-height', 'calc(100dvh - 16px)', 'important');
    placeDrawer(drawer);
  }
  function placeDrawer(drawer, forceCenter=false){
    if(!drawer) return;
    const vp=viewportSize();
    const w=drawer.getBoundingClientRect().width || drawer.offsetWidth || Math.round(vp.w*0.75);
    const h=drawer.getBoundingClientRect().height || drawer.offsetHeight || Math.round(vp.h*0.75);
    let x=Number(settings.panelX), y=Number(settings.panelY);
    if(forceCenter || !Number.isFinite(x) || !Number.isFinite(y)){
      x=Math.round((vp.w-w)/2);
      y=Math.round((vp.h-h)/2);
    }
    x=clamp(x,8,Math.max(8,vp.w-w-8),8);
    y=clamp(y,8,Math.max(8,vp.h-h-8),8);
    drawer.style.setProperty('left', x+'px', 'important');
    drawer.style.setProperty('top', y+'px', 'important');
    drawer.style.setProperty('right', 'auto', 'important');
  }
  function bindPanelDrag(drawer){
    const head=drawer.querySelector('.xy-head');
    if(!head) return;
    head.addEventListener('pointerdown',e=>{
      if(e.target && e.target.closest && e.target.closest('[data-action]')) return;
      panelStart={id:e.pointerId,x:e.clientX,y:e.clientY,left:drawer.getBoundingClientRect().left,top:drawer.getBoundingClientRect().top};
      try{head.setPointerCapture(e.pointerId)}catch(_){}
      e.preventDefault(); e.stopPropagation();
    },true);
    head.addEventListener('pointermove',e=>{
      if(!panelStart||panelStart.id!==e.pointerId) return;
      const vp=viewportSize();
      const r=drawer.getBoundingClientRect();
      const x=clamp(panelStart.left+(e.clientX-panelStart.x),8,Math.max(8,vp.w-r.width-8),8);
      const y=clamp(panelStart.top+(e.clientY-panelStart.y),8,Math.max(8,vp.h-r.height-8),8);
      drawer.style.setProperty('left', x+'px', 'important'); drawer.style.setProperty('top', y+'px', 'important'); drawer.style.setProperty('right', 'auto', 'important');
      e.preventDefault(); e.stopPropagation();
    },true);
    head.addEventListener('pointerup',e=>{
      if(!panelStart||panelStart.id!==e.pointerId) return;
      try{head.releasePointerCapture(e.pointerId)}catch(_){}
      settings.panelX=Math.round(drawer.getBoundingClientRect().left);
      settings.panelY=Math.round(drawer.getBoundingClientRect().top);
      saveJson(LS_SETTINGS,settings);
      panelStart=null;
      e.preventDefault(); e.stopPropagation();
    },true);
    head.addEventListener('pointercancel',()=>{panelStart=null;},true);
    rootWin.addEventListener('resize',()=>placeDrawer(drawer));
  }

  function findPromptIndex(ps,id){ return ps.findIndex(p=>String(promptId(p))===String(id)); }
  function findFolderRange(ps,startId,endId){
    const s=ps.findIndex(p=>String(promptId(p))===String(startId));
    const e=ps.findIndex(p=>String(promptId(p))===String(endId));
    return s>=0 && e>s ? {start:s,end:e} : null;
  }
  function currentDragIcon(target){
    const icon = target?.querySelector?.('.xy-app-icon')?.textContent || target?.querySelector?.('.xy-phone-folder-emoji')?.textContent || target?.querySelector?.('.xy-folder-name')?.textContent || '❄';
    return String(icon || '❄').trim().slice(0,4);
  }
  function clearDropHover(){ rootDoc.querySelectorAll('.xy-drop-hover').forEach(el=>el.classList.remove('xy-drop-hover')); }
  function dragTargetFromPoint(x,y){
    const el = rootDoc.elementFromPoint(x,y);
    if(!el) return null;
    const promptEl = el.closest?.('[data-drag-prompt-id]');
    if(promptEl) return {type:'prompt', id:promptEl.dataset.dragPromptId, el:promptEl};
    const folderEl = el.closest?.('[data-drop-folder-start]');
    if(folderEl) return {type:'folder', start:folderEl.dataset.dropFolderStart, end:folderEl.dataset.dropFolderEnd, el:folderEl};
    const rootEl = el.closest?.('[data-drop-root]');
    if(rootEl) return {type:'root', el:rootEl};
    return null;
  }
  function movePromptBeforeArray(ps,dragId,targetId){
    if(String(dragId)===String(targetId)) return ps;
    const from=findPromptIndex(ps,dragId); if(from<0) return ps;
    const item=ps[from]; if(isFolderMarker(item)) return ps;
    ps.splice(from,1);
    let to=findPromptIndex(ps,targetId); if(to<0) { ps.push(item); return ps; }
    ps.splice(to,0,item);
    return ps;
  }
  function movePromptIntoFolderArray(ps,dragId,startId,endId){
    const from=findPromptIndex(ps,dragId); if(from<0) return ps;
    const item=ps[from]; if(isFolderMarker(item)) return ps;
    const fid=String(dragId);
    const range=findFolderRange(ps,startId,endId); if(!range) return ps;
    if(from>=range.start && from<=range.end) return ps;
    ps.splice(from,1);
    const endIndex=findPromptIndex(ps,endId); if(endIndex<0) { ps.push(item); return ps; }
    ps.splice(endIndex,0,item);
    return ps;
  }
  function movePromptToRootEndArray(ps,dragId){
    const from=findPromptIndex(ps,dragId); if(from<0) return ps;
    const item=ps[from]; if(isFolderMarker(item)) return ps;
    ps.splice(from,1); ps.push(item); return ps;
  }
  function moveFolderBeforeArray(ps,startId,endId,targetId){
    const range=findFolderRange(ps,startId,endId); if(!range) return ps;
    const target=findPromptIndex(ps,targetId); if(target<0) return ps;
    if(target>=range.start && target<=range.end) return ps;
    const block=ps.splice(range.start,range.end-range.start+1);
    let to=findPromptIndex(ps,targetId); if(to<0) to=ps.length;
    ps.splice(to,0,...block); return ps;
  }
  function moveFolderToRootEndArray(ps,startId,endId){
    const range=findFolderRange(ps,startId,endId); if(!range) return ps;
    const block=ps.splice(range.start,range.end-range.start+1);
    ps.push(...block); return ps;
  }

  function previousLogicalBlockStart(ps, index){
    if(index <= 0) return -1;
    const prev = index - 1;
    const endInfo = folderEndInfo(ps[prev]);
    if(endInfo){
      let level = 0;
      for(let i = prev; i >= 0; i--){
        if(sameFolderInfo(folderEndInfo(ps[i]), endInfo)) level++;
        if(sameFolderInfo(folderStartInfo(ps[i]), endInfo)){
          level--;
          if(level === 0) return i;
        }
      }
    }
    return prev;
  }
  function nextLogicalBlockEnd(ps, index){
    const next = index + 1;
    if(next >= ps.length) return -1;
    const startInfo = folderStartInfo(ps[next]);
    if(startInfo){
      const end = findFolderEnd(ps, next, startInfo);
      return end >= 0 ? end : next;
    }
    return next;
  }
  function moveFolderBlockArray(ps,startId,endId,dir){
    const range = findFolderRange(ps,startId,endId); if(!range) return ps;
    const len = range.end - range.start + 1;
    if(Number(dir) < 0){
      const prevStart = previousLogicalBlockStart(ps, range.start);
      if(prevStart < 0) return ps;
      const block = ps.splice(range.start, len);
      ps.splice(prevStart, 0, ...block);
      return ps;
    }
    const nextEnd = nextLogicalBlockEnd(ps, range.end);
    if(nextEnd < 0) return ps;
    const block = ps.splice(range.start, len);
    const insertAt = Math.max(0, nextEnd - len + 1);
    ps.splice(insertAt, 0, ...block);
    return ps;
  }
  async function moveFolderBlock(startId,endId,dir){
    const ps = clone(getPrompts());
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    moveFolderBlockArray(ps,startId,endId,dir);
    const ok = await savePrompts(ps);
    if(ok){ addLog('success','已移动文件夹', Number(dir)<0?'文件夹整体上移':'文件夹整体下移'); renderDrawer(); }
  }
  async function performAppDrop(target){
    if(!appDrag || !target) return;
    const ps=clone(getPrompts());
    if(!rootWin.localStorage.getItem(LS_PRESET_BACKUP)) backupPrompts();
    if(appDrag.type==='prompt'){
      if(target.type==='prompt') movePromptBeforeArray(ps, appDrag.id, target.id);
      else if(target.type==='folder') movePromptIntoFolderArray(ps, appDrag.id, target.start, target.end);
      else if(target.type==='root') movePromptToRootEndArray(ps, appDrag.id);
    }else if(appDrag.type==='folder'){
      if(target.type==='prompt') moveFolderBeforeArray(ps, appDrag.start, appDrag.end, target.id);
      else if(target.type==='folder' && (String(target.start)!==String(appDrag.start) || String(target.end)!==String(appDrag.end))) moveFolderBeforeArray(ps, appDrag.start, appDrag.end, target.start);
      else if(target.type==='root') moveFolderToRootEndArray(ps, appDrag.start, appDrag.end);
    }
    const ok=await savePrompts(ps);
    if(ok){ addLog('success','已调整预设排列','拖动改变了 prompts 顺序'); renderDrawer(); }
  }
  function bindAppDrag(drawer){
    function clearDragTimers(){
      if(folderLongPressTimer){ clearTimeout(folderLongPressTimer); folderLongPressTimer=null; }
      if(appDrag && appDrag.dragTimer){ clearTimeout(appDrag.dragTimer); appDrag.dragTimer=null; }
      if(appDrag && appDrag.dissolveTimer){ clearTimeout(appDrag.dissolveTimer); appDrag.dissolveTimer=null; }
    }
    function cancelPendingDrag(suppressClick){
      clearDragTimers();
      if(appDrag){
        appDrag.cancelled = true;
        appDrag.promptEl?.classList.remove('xy-app-drag-ready','xy-app-dragging');
        if(suppressClick) ignoreClickUntil = Date.now() + 450;
      }
    }

    drawer.addEventListener('pointerdown',e=>{
      // 拖动只在“排列模式”中启用；普通模式只负责点击开关/打开文件夹。
      if(!settings.arrangeMode) return;
      const actionEl = e.target.closest?.('button,input,textarea,select,.xy-tab,.xy-close,.xy-close2,.xy-mini-actions,.xy-mini');
      if(actionEl) return;
      const pEl=e.target.closest?.('[data-drag-prompt-id]');
      const fEl=e.target.closest?.('[data-drag-folder-start]');
      if(!pEl && !fEl) return;
      clearDragTimers();
      appDrag={ id:e.pointerId, x:e.clientX, y:e.clientY, moved:false, ready:false, cancelled:false, type:pEl?'prompt':'folder',
        promptEl:pEl||fEl, idValue:pEl?.dataset.dragPromptId, start:fEl?.dataset.dragFolderStart, end:fEl?.dataset.dragFolderEnd, title:fEl?.dataset.folderTitle, ghost:null, lastTarget:null, longPressed:false, dragTimer:null, dissolveTimer:null };

      // 排列模式下立即捕获指针，防止手机浏览器把长按当成滚动/选中文字，导致 3 秒计时中断。
      try{ (pEl||fEl).setPointerCapture?.(e.pointerId); }catch(_){ }
      e.preventDefault();
      e.stopPropagation();

      appDrag.dragTimer=setTimeout(()=>{
        if(appDrag && appDrag.id===e.pointerId && !appDrag.cancelled && !appDrag.longPressed){
          appDrag.ready=true;
          appDrag.promptEl?.classList.add('xy-app-drag-ready');
          ignoreClickUntil = Date.now() + 500;
          toast('已进入拖动状态，继续拖动图标。');
        }
      }, APP_DRAG_HOLD_MS);

      appDrag.dissolveTimer=setTimeout(()=>{
        if(appDrag && appDrag.id===e.pointerId && !appDrag.cancelled && !appDrag.moved){
          appDrag.longPressed=true;
          ignoreClickUntil=Date.now()+1100;
          appDrag.promptEl?.classList.remove('xy-app-drag-ready','xy-app-dragging');
          clearDragTimers();
          try{ (pEl||fEl).releasePointerCapture?.(e.pointerId); }catch(_){ }
          if(appDrag.type==='folder') renameFolderOrDissolve(appDrag.start, appDrag.end, appDrag.title || '');
          else renamePromptName(appDrag.idValue);
        }
      }, FOLDER_DISSOLVE_HOLD_MS);
    },true);

    drawer.addEventListener('pointermove',e=>{
      if(!appDrag || appDrag.id!==e.pointerId || appDrag.cancelled) return;
      const dx=e.clientX-appDrag.x, dy=e.clientY-appDrag.y;
      const dist=Math.hypot(dx,dy);

      // 未满 3 秒时不拖动；允许轻微手抖。移动过大才取消，避免误把滚动当成拖拽。
      if(!appDrag.ready){
        if(dist>72){ cancelPendingDrag(true); }
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if(!appDrag.moved && dist>6){
        appDrag.moved=true;
        if(folderLongPressTimer){ clearTimeout(folderLongPressTimer); folderLongPressTimer=null; }
        if(appDrag.dissolveTimer){ clearTimeout(appDrag.dissolveTimer); appDrag.dissolveTimer=null; }
        appDrag.promptEl?.classList.remove('xy-app-drag-ready');
        appDrag.promptEl?.classList.add('xy-app-dragging');
        appDrag.ghost=rootDoc.createElement('div');
        appDrag.ghost.className='xy-drag-ghost';
        appDrag.ghost.textContent=currentDragIcon(appDrag.promptEl);
        rootDoc.body.appendChild(appDrag.ghost);
      }
      if(appDrag.moved){
        e.preventDefault(); e.stopPropagation();
        if(appDrag.ghost){ appDrag.ghost.style.left=e.clientX+'px'; appDrag.ghost.style.top=e.clientY+'px'; }
        clearDropHover();
        const target=dragTargetFromPoint(e.clientX,e.clientY);
        appDrag.lastTarget=target;
        target?.el?.classList.add('xy-drop-hover');
      }
    },true);

    const end=e=>{
      if(!appDrag || appDrag.id!==e.pointerId) return;
      const wasMoved=appDrag.moved;
      const wasReady=appDrag.ready;
      const wasLongPressed=appDrag.longPressed;
      const wasCancelled=appDrag.cancelled;
      const target=appDrag.lastTarget;
      const el=appDrag.promptEl;
      clearDragTimers();
      el?.classList.remove('xy-app-drag-ready','xy-app-dragging');
      try{ el?.releasePointerCapture?.(e.pointerId); }catch(_){ }
      appDrag.ghost?.remove();
      clearDropHover();
      if(wasLongPressed){ ignoreClickUntil=Date.now()+1100; e.preventDefault(); e.stopPropagation(); }
      else if(wasMoved){ ignoreClickUntil=Date.now()+700; e.preventDefault(); e.stopPropagation(); performAppDrop(target); }
      else if(wasReady || wasCancelled){ ignoreClickUntil=Date.now()+450; e.preventDefault(); e.stopPropagation(); }
      appDrag=null;
    };
    drawer.addEventListener('pointerup',end,true);
    drawer.addEventListener('pointercancel',e=>{ clearDragTimers(); if(appDrag){ appDrag.promptEl?.classList.remove('xy-app-drag-ready','xy-app-dragging'); appDrag.ghost?.remove(); clearDropHover(); appDrag=null; } },true);
  }

  function bindFloat(btn){ btn.addEventListener('pointerdown',e=>{pointerStart={id:e.pointerId,x:e.clientX,y:e.clientY,top:btn.getBoundingClientRect().top};dragged=false;try{btn.setPointerCapture(e.pointerId)}catch(_){} e.preventDefault();e.stopPropagation();},true); btn.addEventListener('pointermove',e=>{if(!pointerStart||pointerStart.id!==e.pointerId)return; const dy=e.clientY-pointerStart.y, dx=e.clientX-pointerStart.x; if(Math.abs(dx)>4||Math.abs(dy)>4) dragged=true; if(dragged){const top=clamp(pointerStart.top+dy,60,rootWin.innerHeight-60,320); btn.style.top=top+'px'; e.preventDefault();}},true); btn.addEventListener('pointerup',e=>{if(!pointerStart||pointerStart.id!==e.pointerId)return; if(dragged){settings.floatTop=Math.round(btn.getBoundingClientRect().top); saveJson(LS_SETTINGS,settings); ignoreClickUntil=Date.now()+300;} else {openDrawer(); ignoreClickUntil=Date.now()+300;} pointerStart=null; e.preventDefault();e.stopPropagation();},true); btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation(); if(Date.now()>ignoreClickUntil) openDrawer();},true); }
  function openDrawer(){ const d=rootDoc.getElementById(IDS.drawer), b=rootDoc.getElementById(IDS.float); if(!d)return; renderDrawer(); placeDrawer(d); d.classList.add('open'); b&&b.classList.add('open'); }
  function closeDrawer(){ rootDoc.getElementById(IDS.drawer)?.classList.remove('open'); rootDoc.getElementById(IDS.float)?.classList.remove('open'); }
  function isOpen(){ return rootDoc.getElementById(IDS.drawer)?.classList.contains('open'); }
  function renderIfOpen(){ if(isOpen()) renderDrawer(); }

  function renderDrawer(){ const body=rootDoc.querySelector(`#${IDS.drawer} .xy-body`); if(!body) return; const s=getState(), story=getStory(), ps=getPrompts(); const active=(s.activeCharacters||[]).length; const pending=(s.characterGroups?.newCharacters||[]).length; body.innerHTML=`${renderOverview(ps,s,story)}${renderTabs()}<div class="xy-content">${renderTab()}</div>`; applyBg(); }
  function renderOverview(ps,s,story){ return `<div class="xy-overview"><div class="xy-stat"><b>${ps.filter(p=>p.enabled!==false).length}/${ps.length}</b><span class="xy-muted">预设条目</span></div><div class="xy-stat"><b>${activeSafe(s)}</b><span class="xy-muted">活跃角色</span></div><div class="xy-stat"><b>${(s.characterGroups?.newCharacters||[]).length}</b><span class="xy-muted">待确认</span></div><div class="xy-stat"><b>${story.fixedText||story.dynamicText?'已缓存':'空'}</b><span class="xy-muted">剧情档案</span></div></div>`; }
  function activeSafe(s){return (s.activeCharacters||[]).length;}
  function renderTabs(){ const tabs=[['preset','预设'],['roles','角色'],['story','剧情'],['labels','标签'],['cg','CG'],['inject','注入'],['templates','模板'],['logs','日志'],['settings','设置']]; return `<div class="xy-tabs">${tabs.map(([id,n])=>`<button class="xy-tab ${settings.currentTab===id?'active':''}" data-action="tab" data-tab="${id}">${n}</button>`).join('')}</div>`; }
  function renderTab(){ const t=settings.currentTab||'preset'; if(t==='preset')return renderPreset(); if(t==='roles')return renderRoles(); if(t==='story')return renderStory(); if(t==='labels')return renderLabels(); if(t==='cg')return renderCg(); if(t==='inject')return renderInject(); if(t==='templates')return renderTemplates(); if(t==='logs')return renderLogs(); return renderSettings(); }

  function promptIcon(n){ const m=String(n||'').match(/^\s*([^\w\s\u4e00-\u9fff])/u); return m?m[1]:'❄'; }
  function buildPhoneEntries(prompts){
    const entries=[];
    for(let i=0;i<prompts.length;i++){
      const p=prompts[i];
      const st=folderStartInfo(p);
      const end=st?findFolderEnd(prompts,i,st):-1;
      if(st && end>i){
        entries.push({type:'folder', title:st.title, folderName:st.name, folderEmoji:st.emoji, folderStartId:String(promptId(prompts[i])), folderEndId:String(promptId(prompts[end])), items:prompts.slice(i+1,end)});
        i=end;
      }else{
        entries.push({type:'prompt', prompt:p});
      }
    }
    return entries;
  }

  function entryMatchesQuery(entry,q){
    if(!q) return true;
    q=String(q).toLowerCase();
    if(entry.type==='prompt'){
      const p=entry.prompt||{};
      return String(p.name||'').toLowerCase().includes(q)||String(p.content||'').toLowerCase().includes(q);
    }
    return String(entry.title||'').toLowerCase().includes(q)||String(entry.folderName||'').toLowerCase().includes(q)||entry.items.some(p=>String(p.name||'').toLowerCase().includes(q)||String(p.content||'').toLowerCase().includes(q));
  }

  function renderPreset(){
    const ps=getPrompts();
    const q=String(settings.presetSearch||'').toLowerCase();
    const allEntries=buildPhoneEntries(ps);
    const entries=allEntries.filter(e=>entryMatchesQuery(e,q));
    const modes=getPresetModes();
    const enabledCount=ps.filter(p=>p.enabled!==false).length;
    const selectedCount=(settings.selectedPromptIds||[]).length;
    return `<div class="xy-card xy-preset-shell xy-scanline"><div class="xy-cyber-title"><span>PRESET // 雪月</span><span>${enabledCount}/${ps.length} ACTIVE</span></div><input class="xy-search" data-setting-live="presetSearch" placeholder="搜索预设条目 / 文件夹..." value="${esc(settings.presetSearch||'')}"><div class="xy-actions"><button class="xy-btn primary" data-action="save-current-mode">保存当前为模式</button><button class="xy-btn ${settings.arrangeMode?'danger':'good'}" data-action="toggle-arrange-mode">${settings.arrangeMode?'退出排列':'排列模式'}</button><button class="xy-btn primary" data-action="create-prompt-folder">新建文件夹</button><button class="xy-btn primary" data-action="create-prompt-entry">新建条目</button><button class="xy-btn" data-action="clear-prompt-selection" ${settings.arrangeMode?'':'disabled'}>清空选择</button><button class="xy-btn" data-action="backup-preset">备份当前预设</button><button class="xy-btn" data-action="copy-preset-summary">复制条目清单</button></div><div class="xy-muted">${settings.arrangeMode?`手机桌面排列模式：短按选择；长按 3 秒进入拖动；长按 5 秒打开重命名/解散菜单。已选择 ${selectedCount} 个条目。`:'手机 App 桌面：点击 App 开关；拖动 App 到文件夹会改变预设顺序；拖动文件夹可移动整个文件夹。'}</div></div>${renderPresetModes(modes)}<div class="xy-phone-shell xy-scanline ${settings.arrangeMode?'xy-arrange':''}"><div class="xy-phone-home" data-drop-root="1">${entries.map(renderPhoneEntry).join('')}</div></div>${renderFolderPopup(allEntries)}`;
  }

  function renderPhoneEntry(entry){
    if(entry.type==='folder') return renderPhoneFolder(entry);
    return renderPromptCard(entry.prompt);
  }

  function renderPhoneFolder(entry){
    const total=entry.items.length;
    const on=entry.items.filter(p=>p.enabled!==false).length;
    const minis=entry.items.slice(0,9).map(p=>`<span class="xy-phone-mini">${esc(promptIcon(p.name||''))}</span>`).join('');
    const fill=Array.from({length:Math.max(0,9-entry.items.slice(0,9).length)},()=>'<span class="xy-phone-mini"></span>').join('');
    return `<div class="xy-phone-folder" data-action="open-folder" data-folder-start="${esc(entry.folderStartId)}" data-folder-end="${esc(entry.folderEndId)}" data-drop-folder-start="${esc(entry.folderStartId)}" data-drop-folder-end="${esc(entry.folderEndId)}" data-drag-folder-start="${esc(entry.folderStartId)}" data-drag-folder-end="${esc(entry.folderEndId)}" data-folder-title="${esc(entry.title)}" title="点击打开文件夹；排列模式长按3秒后拖动；长按超过5秒可重命名/解散"><div class="xy-phone-folder-icon">${minis}${fill}<span class="xy-phone-folder-emoji">${esc(entry.folderEmoji||'◇')}</span></div><div class="xy-phone-folder-name">${esc(entry.folderName||entry.title||'文件夹')}</div><div class="xy-phone-folder-meta">${total} ITEMS · ${on} ON</div></div>`;
  }

  function renderFolderPopup(entries){
    const start=String(settings.openFolderStartId||'');
    const end=String(settings.openFolderEndId||'');
    if(!start || !end) return '';
    const sec=(entries||[]).find(s=>s.type==='folder' && String(s.folderStartId)===start && String(s.folderEndId)===end);
    if(!sec) return '';
    const total=sec.items.length;
    const on=sec.items.filter(p=>p.enabled!==false).length;
    return `<div class="xy-folder-pop-layer"><div class="xy-folder-pop-backdrop" data-action="close-folder"></div><div class="xy-folder-pop xy-scanline" data-drop-folder-start="${esc(sec.folderStartId)}" data-drop-folder-end="${esc(sec.folderEndId)}"><div class="xy-folder-pop-head"><div><div class="xy-folder-pop-title"><span>${esc(sec.folderEmoji||'◇')}</span>${esc(sec.folderName||sec.title||'文件夹')}</div><div class="xy-muted">${total} ITEMS · ${on} ACTIVE · ${settings.arrangeMode?'排列模式中可选中内部条目':'点击内部 App 可开关'}</div></div><button class="xy-close2" data-action="close-folder">×</button></div><div class="xy-app-grid xy-folder-inside-grid" data-drop-folder-start="${esc(sec.folderStartId)}" data-drop-folder-end="${esc(sec.folderEndId)}">${sec.items.map(renderPromptCard).join('')}</div><div class="xy-actions"><span class="xy-muted">长按 App 3 秒后可拖动排序；长按超过 5 秒可重命名，文件夹可在菜单里解散。</span><button class="xy-btn primary" data-action="create-prompt-entry">在此新建条目</button><button class="xy-btn" data-action="close-folder">关闭</button></div></div></div>`;
  }

  function renderPresetModes(modes){ return `<div class="xy-card xy-preset-shell"><h3>MODE // 模式设置</h3>${modes&&modes.length?`<div class="xy-mode-grid">${modes.map(m=>`<div class="xy-mode"><div class="xy-mode-name">${esc(m.name)}</div><div class="xy-muted">${esc((m.enabledIds||[]).length)} ACTIVE · ${esc((m.order||[]).length)} ORDER</div><div class="xy-actions"><button class="xy-btn primary" data-action="apply-preset-mode" data-mode-name="${esc(m.name)}">LOAD</button><button class="xy-btn danger" data-action="delete-preset-mode" data-mode-name="${esc(m.name)}">DEL</button></div></div>`).join('')}</div>`:'<div class="xy-muted">还没有保存的模式。先用虚拟按键开关条目、拖动调整顺序，再点“保存当前为模式”。</div>'}</div>`; }
  function renderPromptCard(p){
    const rawId=String(promptId(p)); const id=esc(rawId); const on=p.enabled!==false; const name=p.name||'(未命名)';
    const selected=selectedPromptSet().has(rawId);
    const action=settings.arrangeMode?'select-prompt':'toggle-prompt';
    return `<div class="xy-prompt xy-app-key ${on?'on':'off'} ${selected?'selected':''}" data-action="${action}" data-prompt-id="${id}" data-drag-prompt-id="${id}" title="${settings.arrangeMode?'点击选择/取消选择；长按3秒拖动，长按5秒重命名':'点击开启/关闭；拖动可排序或放入文件夹'}"><span class="xy-app-state">${settings.arrangeMode?(selected?'SEL':'PICK'):(on?'ON':'OFF')}</span><span class="xy-app-icon">${esc(promptIcon(name))}</span><span class="xy-app-name">${esc(cleanPromptDisplayName(name))}</span><span class="xy-app-meta">${esc(promptMetaLine(p))}</span><span class="xy-mini-actions"><button type="button" class="xy-mini" data-action="copy-prompt" data-prompt-id="${id}">CP</button></span></div>`;
  }
  function cleanPromptDisplayName(name){
    let n=String(name||'').trim();
    n=n.replace(/^\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u,'').trim();
    n=n.replace(/[（(]\s*开始\s*[)）]/g,'').replace(/[（(]\s*结束\s*[)）]/g,'').trim();
    return n || String(name||'').trim() || '未命名';
  }
  function openFolder(startId,endId){
    settings.openFolderStartId=String(startId||'');
    settings.openFolderEndId=String(endId||'');
    saveJson(LS_SETTINGS,settings);
    renderDrawer();
  }
  function closeFolder(){
    settings.openFolderStartId='';
    settings.openFolderEndId='';
    saveJson(LS_SETTINGS,settings);
    renderDrawer();
  }


  function renderRoles(){ const s=getState(); return GROUPS.map(([key,title])=>{ const names=key==='active'?s.activeCharacters:(s.characterGroups[key]||[]); return `<div class="xy-card"><h3>${title} · ${names.length}</h3>${names.length?`<div class="xy-grid">${names.map(n=>renderChar(s,n,key)).join('')}</div>`:'<div class="xy-muted">暂无</div>'}</div>`; }).join('')+`<div class="xy-card"><button class="xy-btn primary" data-action="add-char">手动新增角色</button></div>`; }
  function renderChar(s,n,g){ const c=s.characters[n]; if(!c)return''; const active=(s.activeCharacters||[]).includes(n), m=getByPath(c,'relationshipToUser.metrics')||{}; return `<div class="xy-char"><div class="xy-char-name">${esc(c.displayName||n)} <span class="xy-badge">${esc(c.scope)} / ${esc(c.category)}</span></div><div class="xy-desc">${esc(c.role||'')}<br>信任 ${m.trust||0} / 戒备 ${m.guard||0}</div><div class="xy-actions">${active?`<button class="xy-btn" data-action="deactivate" data-char="${esc(n)}">移出活跃</button>`:`<button class="xy-btn good" data-action="activate" data-char="${esc(n)}">加入活跃</button>`}<button class="xy-btn" data-action="move" data-group="globalImportant" data-char="${esc(n)}">全局</button><button class="xy-btn" data-action="move" data-group="arcImportant" data-char="${esc(n)}">本卷</button><button class="xy-btn" data-action="move" data-group="npc" data-char="${esc(n)}">NPC</button><button class="xy-btn" data-action="edit-char" data-char="${esc(n)}">编辑</button><button class="xy-btn danger" data-action="delete-char" data-char="${esc(n)}">删除</button></div></div>`; }

  function renderStory(){
    // 核心剧情处理策略固定内置，不再在界面暴露一堆开发者开关：
    // FixedAppendix：提取缓存 → 删除原文 → 不显示
    // DynamicAppendix：提取缓存 → 删除原文 → 显示虚拟卡
    // RouteOptions：提取缓存 → 删除原文 → 显示虚拟按钮
    settings.archiveDisplayEnabled = true;
    settings.dynamicArchiveBeautify = true;
    settings.dynamicArchiveRemoveOutput = true;
    settings.routeOptionsRemoveOutput = true;
    settings.dynamicArchiveDefaultCollapsed = true;
    settings.storyRemoveFixedOutput = true;
    settings.fixedArchiveDisplay = 'hidden';
    settings.routeButtonsEnabled = true;
    settings.tagRepairEnabled = true;
    settings.autoCloseTags = true;
    settings.sameOpenAsCloseFix = true;
    settings.tagBoundaryProtect = true;

    const m=getStory();
    const routes=m.lastRoutes||[];
    const info=dynamicSummaryInfo(m.dynamicText||'');
    const fixedOk=!!(m.fixedText&&m.fixedText.trim());
    const dynamicOk=!!(m.dynamicText&&m.dynamicText.trim());
    const routeCount=routes.length;
    const selected=m.selectedRoute?`${m.selectedRoute.id} · ${m.selectedRoute.title||''}`:'无';
    const brief=info.brief || (dynamicOk ? '已缓存动态剧情档案。' : '暂无动态剧情档案。');
    const routeHtml=routes.length?`<div class="xy-grid">${routes.map(r=>`<div class="xy-char"><div class="xy-char-name">${esc(r.id)} · ${esc(r.title)}</div><div class="xy-desc">${esc(r.desc||r.instruction||'')}</div><div class="xy-actions"><button class="xy-btn ${m.selectedRoute&&m.selectedRoute.id===r.id?'good':'primary'}" data-action="select-route" data-route="${esc(r.id)}">${m.selectedRoute&&m.selectedRoute.id===r.id?'已选择':'选择'}</button></div></div>`).join('')}</div>`:'<div class="xy-muted">暂无路线候选。</div>';
    const nm=m.narrativeModel||null;
    const modelHtml=`<div class="xy-grid xy-narrative-grid">${NARRATIVE_MODELS.map(x=>`<button class="xy-narrative-card ${nm&&nm.id===x.id?'selected':''}" data-action="select-narrative" data-narrative-id="${esc(x.id)}"><div class="xy-narrative-title">${esc(x.short||x.name)}</div><div class="xy-narrative-name">${esc(x.name)}</div><div class="xy-narrative-desc">${esc(x.desc||x.goal||'')}</div><div class="xy-narrative-meta">目标：${esc(x.goal||'')}</div><div class="xy-narrative-meta">副本倾向：${esc(x.eventStyle||'')}</div></button>`).join('')}</div>`;
    const events=parseEventTracks(m.dynamicText||'');
    const activeEv=m.activeEvent;
    const eventHtml=events.length?`<div class="xy-grid">${events.map(ev=>`<div class="xy-char"><div class="xy-char-name">${esc(ev.id)} · ${esc(ev.title)} <span class="xy-badge">${esc(eventModeLabel(ev))}</span></div><div class="xy-desc">${esc(ev.type)} · ${esc(ev.status)} · ${esc(ev.summary||ev.entry||'')}</div><div class="xy-actions"><button class="xy-btn ${activeEv&&activeEv.id===ev.id?'good':'primary'}" data-action="enter-event" data-event-id="${esc(ev.id)}">${activeEv&&activeEv.id===ev.id?'继续事件':esc(eventButtonText(ev))}</button></div></div>`).join('')}</div>`:'<div class="xy-muted">暂无副本事件。</div>';
    return `<div class="xy-card">
      <h3>剧情状态</h3>
      <div class="xy-grid">
        <div class="xy-char"><div class="xy-char-name">固定档案</div><div class="xy-desc">${fixedOk?'已缓存':'未缓存'} · 默认删除原文，不显示</div></div>
        <div class="xy-char"><div class="xy-char-name">动态档案</div><div class="xy-desc">${dynamicOk?'已缓存':'未缓存'} · 删除原文，显示虚拟卡</div></div>
        <div class="xy-char"><div class="xy-char-name">当前路线</div><div class="xy-desc">${esc(selected)}</div></div>
        <div class="xy-char"><div class="xy-char-name">路线候选</div><div class="xy-desc">${routeCount} 条</div></div>
      </div>
    </div>
    <div class="xy-card">
      <h3>叙事模型</h3>
      <div class="xy-muted">当前：${esc(nm?nm.name:'未选择')}。规则与输出模板由你的预设负责，这里只注入已选择的模型。</div>
      ${nm?`<div class="xy-narrative-current"><b>${esc(nm.short||nm.name)}</b><br>${esc(nm.desc||nm.goal||'')}<br><span>副本倾向：${esc(nm.eventStyle||'')}</span></div>`:''}
      ${modelHtml}
      <div class="xy-actions"><button class="xy-btn" data-action="clear-narrative">清除选择</button></div>
    </div>
    <div class="xy-card">
      <h3>副本事件</h3>
      ${eventHtml}
      <div class="xy-muted">当前激活：${esc(activeEv?activeEv.id+' · '+(activeEv.title||''):'无')}</div>
      <div class="xy-actions"><button class="xy-btn" data-action="return-mainline">返回主线</button><button class="xy-btn" data-action="clear-active-event">清除事件状态</button></div>
    </div>
    <div class="xy-card">
      <h3>最新动态摘要</h3>
      <div class="xy-grid">
        <div class="xy-char"><div class="xy-char-name">当前模式</div><div class="xy-desc">${esc(info.mode||'未记录')}</div></div>
        <div class="xy-char"><div class="xy-char-name">主线冻结</div><div class="xy-desc">${esc(info.freeze||'未记录')}</div></div>
        <div class="xy-char"><div class="xy-char-name">执行路线</div><div class="xy-desc">${esc(info.route||'未记录')}</div></div>
        <div class="xy-char"><div class="xy-char-name">当前状态</div><div class="xy-desc">${esc(info.state||'未记录')}</div></div>
      </div>
      <div class="xy-pre" style="margin-top:10px;white-space:pre-wrap;">${esc(brief)}</div>
    </div>
    <div class="xy-card">
      <h3>路线</h3>
      ${routeHtml}
      <div class="xy-muted">当前已选：${esc(selected)}</div>
      <div class="xy-actions"><button class="xy-btn" data-action="clear-route">清除已选路线</button><button class="xy-btn" data-action="clear-routes">清除候选路线</button></div>
    </div>
    <div class="xy-card">
      <h3>剧情显示</h3>
      <div class="xy-muted">核心处理已固定开启：Fixed 删除隐藏；Dynamic 删除原文后显示虚拟卡；RouteOptions 删除原文后显示虚拟按钮。</div>
      <label class="xy-field"><span>动态卡标题</span><input data-setting="dynamicArchiveTitle" value="${esc(settings.dynamicArchiveTitle||'动态剧情档案')}"></label>
      <div class="xy-two"><label class="xy-field"><span>虚拟卡背景 URL</span><input data-setting="archiveFoldBgUrl" value="${esc(settings.archiveFoldBgUrl||'')}"></label><label class="xy-field"><span>背景透明度 0-100</span><input type="number" min="0" max="100" data-setting="archiveFoldBgOpacity" value="${esc(settings.archiveFoldBgOpacity)}"></label></div>
      <div class="xy-actions"><button class="xy-btn primary" data-action="beautify-recent-archives">手动美化</button><button class="xy-btn" data-action="repair-latest-tags">修复最新楼层标签</button></div>
      <div class="xy-muted">手动美化会重新缓存并清理最近楼层，只处理 FixedAppendix / DynamicAppendix / RouteOptions / CG。</div>
    </div>
    <details class="xy-card">
      <summary><h3 style="display:inline">编辑剧情档案</h3></summary>
      <div class="xy-muted">用户手动润色后点击保存，下一轮注入会使用你保存后的缓存。</div>
      ${storyArea('固定剧情档案','fixedText',m.fixedText,true)}
      ${storyArea('半固定剧情档案','semiFixedText',m.semiFixedText,true)}
      ${storyArea('动态剧情档案','dynamicText',m.dynamicText,true)}
      ${storyArea('限制级事件 / 冻结状态','eventText',m.eventText,true)}
    </details>
    <details class="xy-card">
      <summary><h3 style="display:inline">高级 / 存档</h3></summary>
      <div class="xy-actions"><button class="xy-btn" data-action="export-story">复制剧情缓存</button><button class="xy-btn" data-action="import-story">导入剧情缓存</button><button class="xy-btn danger" data-action="clear-story">清空剧情缓存</button></div>
      <div class="xy-muted">独立缓存：${STORY_KEY}</div>
    </details>`;
  }

  function storyArea(title,key,val,inner){ const html=`${title?`<h3>${title}</h3>`:''}<textarea data-story="${key}">${esc(val||'')}</textarea><div class="xy-actions"><button class="xy-btn primary" data-action="save-story" data-field="${key}">保存</button><button class="xy-btn" data-action="copy-story" data-field="${key}">复制</button></div>`; return inner?html:`<div class="xy-card">${html}</div>`; }


  function renderLabels(){
    const text=getLabelText();
    return `<div class="xy-card"><h3>标签</h3><div class="xy-muted">从最后一条助手回复里按顺序提取标签，自动排除 FixedAppendix，并保留 &lt;&gt; 与闭合标签。生成前会按固定模板注入。</div><label><input type="checkbox" data-setting="labelInjectEnabled" ${settings.labelInjectEnabled?'checked':''}>启用标签注入</label><label class="xy-field"><span>标签内容</span><textarea data-label-text placeholder="<DynamicAppendix>\n</DynamicAppendix>\n\n<RouteOptions>\n</RouteOptions>\n\n<XUEYUE>\n</XUEYUE>">${esc(text)}</textarea></label><div class="xy-actions"><button class="xy-btn primary" data-action="extract-labels">提取标签</button><button class="xy-btn good" data-action="save-labels">保存标签</button><button class="xy-btn" data-action="copy-labels">复制标签</button><button class="xy-btn danger" data-action="clear-labels">清空标签</button></div></div><div class="xy-card"><h3>标签注入设置</h3><div class="xy-two"><label class="xy-field"><span>注入深度</span><input type="number" min="0" max="99" data-setting="labelInjectDepth" value="${esc(settings.labelInjectDepth)}"></label><label class="xy-field"><span>注入角色</span>${select('labelInjectRole',settings.labelInjectRole,['system','user','assistant'])}</label></div><div class="xy-pre">${esc(labelInjectPrompt() || 'Fuyutsuki，完整的响应应包含下列标签，且必须完全闭合：\n{{标签内容}}')}</div></div>`;
  }


  function renderCg(){
    const mode=settings.cgBackgroundMode||'smart';
    return `<div class="xy-card"><h3>CG 美化</h3><div class="xy-muted">CG 已并入雪月虚拟美化层：提取 [CG] / &lt;CG&gt; → 删除原文内容 → 在原位置插入虚拟 CG 卡，不再整楼层重绘。</div><label><input type="checkbox" data-setting="cgEnabled" ${settings.cgEnabled?'checked':''}>启用 CG 美化</label><label><input type="checkbox" data-setting="cgAutoProcess" ${settings.cgAutoProcess?'checked':''}>生成后自动提取 CG</label><label><input type="checkbox" data-setting="cgRemoveOutput" ${settings.cgRemoveOutput?'checked':''}>提取后删除原文 CG 标签</label><label><input type="checkbox" data-setting="cgVirtualCard" ${settings.cgVirtualCard?'checked':''}>显示虚拟 CG 卡</label><label><input type="checkbox" data-setting="cgDefaultCollapsed" ${settings.cgDefaultCollapsed?'checked':''}>CG 默认收起</label><div class="xy-two"><label class="xy-field"><span>标题</span><input data-setting="cgTitle" value="${esc(settings.cgTitle||'世界回响')}"></label><label class="xy-field"><span>副标题</span><input data-setting="cgSubtitle" value="${esc(settings.cgSubtitle||'LORE SIGNAL')}"></label><label class="xy-field"><span>标记</span><input data-setting="cgSigil" value="${esc(settings.cgSigil||'✦')}"></label><label class="xy-field"><span>背景模式</span>${select('cgBackgroundMode',mode,['smart','random','fixed','none'])}</label></div><label class="xy-field"><span>固定背景 URL</span><input data-setting="cgFixedBackgroundUrl" value="${esc(settings.cgFixedBackgroundUrl||'')}"></label><div class="xy-two"><label class="xy-field"><span>背景透明度 0-100</span><input type="number" min="0" max="100" data-setting="cgBackgroundOpacity" value="${esc(settings.cgBackgroundOpacity)}"></label><label class="xy-field"><span>背景模糊 px</span><input type="number" min="0" max="30" data-setting="cgBackgroundBlur" value="${esc(settings.cgBackgroundBlur)}"></label></div><div class="xy-actions"><button class="xy-btn primary" data-action="beautify-recent-archives">手动美化</button></div><div class="xy-muted">背景图库：${Array.isArray(CG_BACKGROUND_LIBRARY)?CG_BACKGROUND_LIBRARY.length:0} 张；智能模式会按 CG 内容关键词自动匹配背景。</div></div>`;
  }

  function renderInject(){ return `<div class="xy-card"><h3>推荐注入配置</h3><div class="xy-muted">当前轮强约束靠近最新消息；长期剧情背景放到较深位置。</div><div class="xy-pre">depth 0：标签、已选路线、角色图式、冻结提示
depth 1：XUEYUE 格式模板
depth 2：动态剧情档案（默认关闭）
depth 4：固定/半固定剧情档案</div><button class="xy-btn good" data-action="apply-recommended-injection">一键应用推荐注入深度</button></div><div class="xy-card"><h3>角色图式注入</h3><label><input type="checkbox" data-setting="statePromptEnabled" ${settings.statePromptEnabled?'checked':''}>注入角色状态</label><label><input type="checkbox" data-setting="formatPromptEnabled" ${settings.formatPromptEnabled?'checked':''}>注入 XUEYUE 格式</label><div class="xy-two"><label class="xy-field"><span>角色状态 depth</span><input type="number" min="0" max="99" data-setting="roleStateDepth" value="${esc(settings.roleStateDepth)}"></label><label class="xy-field"><span>XUEYUE格式 depth</span><input type="number" min="0" max="99" data-setting="formatDepth" value="${esc(settings.formatDepth)}"></label></div><label class="xy-field"><span>注入角色</span>${select('injectRole',settings.injectRole,['system','user','assistant'])}</label></div><div class="xy-card"><h3>剧情档案注入</h3><label><input type="checkbox" data-setting="storyArchiveEnabled" ${settings.storyArchiveEnabled?'checked':''}>启用剧情档案模块</label><label><input type="checkbox" data-setting="storyInjectEnabled" ${settings.storyInjectEnabled?'checked':''}>注入固定/半固定剧情档案</label><label><input type="checkbox" data-setting="storyInjectDynamic" ${settings.storyInjectDynamic?'checked':''}>注入动态剧情档案</label><label><input type="checkbox" data-setting="storyInjectRoutes" ${settings.storyInjectRoutes?'checked':''}>注入已选择路线</label><label><input type="checkbox" data-setting="freezeInjectEnabled" ${settings.freezeInjectEnabled?'checked':''}>注入冻结事件提示</label><div class="xy-two"><label class="xy-field"><span>固定/半固定 depth</span><input type="number" min="0" max="99" data-setting="storyInjectDepth" value="${esc(settings.storyInjectDepth)}"></label><label class="xy-field"><span>动态剧情 depth</span><input type="number" min="0" max="99" data-setting="storyInjectDynamicDepth" value="${esc(settings.storyInjectDynamicDepth)}"></label><label class="xy-field"><span>已选路线 depth</span><input type="number" min="0" max="99" data-setting="routeInjectDepth" value="${esc(settings.routeInjectDepth)}"></label><label class="xy-field"><span>冻结提示 depth</span><input type="number" min="0" max="99" data-setting="freezeInjectDepth" value="${esc(settings.freezeInjectDepth)}"></label></div><div class="xy-two"><label class="xy-field"><span>剧情注入角色</span>${select('storyInjectRole',settings.storyInjectRole,['system','user','assistant'])}</label><label class="xy-field"><span>路线注入角色</span>${select('routeInjectRole',settings.routeInjectRole,['system','user','assistant'])}</label><label class="xy-field"><span>冻结注入角色</span>${select('freezeInjectRole',settings.freezeInjectRole,['system','user','assistant'])}</label></div></div><div class="xy-card"><h3>叙事 / 副本注入</h3><label><input type="checkbox" data-setting="narrativeInjectEnabled" ${settings.narrativeInjectEnabled?'checked':''}>注入当前叙事模型</label><label><input type="checkbox" data-setting="eventInjectEnabled" ${settings.eventInjectEnabled?'checked':''}>注入当前副本事件 / 返回主线</label><div class="xy-two"><label class="xy-field"><span>叙事模型 depth</span><input type="number" min="0" max="99" data-setting="narrativeInjectDepth" value="${esc(settings.narrativeInjectDepth)}"></label><label class="xy-field"><span>副本事件 depth</span><input type="number" min="0" max="99" data-setting="eventInjectDepth" value="${esc(settings.eventInjectDepth)}"></label></div><div class="xy-two"><label class="xy-field"><span>叙事注入角色</span>${select('narrativeInjectRole',settings.narrativeInjectRole,['system','user','assistant'])}</label><label class="xy-field"><span>副本注入角色</span>${select('eventInjectRole',settings.eventInjectRole,['system','user','assistant'])}</label></div></div><div class="xy-card"><h3>手动操作</h3><button class="xy-btn primary" data-action="inject-now">立即注入一次</button><button class="xy-btn" data-action="process-now">处理最新回复</button></div>`; }
  function select(key,val,opts){ return `<select data-setting="${key}">${opts.map(o=>`<option value="${o}" ${o===val?'selected':''}>${o}</option>`).join('')}</select>`; }
  function renderTemplates(){ const cards=[['formatCompact','XUEYUE 输出格式模板'],['roleState','角色状态注入模板'],['empty','空状态模板'],['storyInjection','剧情档案注入模板'],['selectedRoute','已选路线模板'],['freeze','限制级事件冻结模板']]; return cards.map(([k,t])=>`<div class="xy-card"><h3>${t}</h3><textarea data-template="${k}">${esc(templates[k]||DEFAULT_TEMPLATES[k]||'')}</textarea><div class="xy-actions"><button class="xy-btn primary" data-action="save-template" data-template="${k}">保存</button><button class="xy-btn" data-action="reset-template" data-template="${k}">恢复默认</button><button class="xy-btn" data-action="copy-template" data-template="${k}">复制</button></div></div>`).join(''); }
  function renderLogs(){ return `<div class="xy-card"><h3>日志</h3><div class="xy-actions"><button class="xy-btn" data-action="copy-logs">复制日志</button><button class="xy-btn danger" data-action="clear-logs">清空日志</button></div>${logs.length?logs.map(l=>`<div class="xy-char"><div class="xy-char-name">${esc(l.title)} <span class="xy-badge">${esc(l.type)}</span></div><div class="xy-muted">${esc(l.time)}</div><div class="xy-desc">${esc(l.detail)}</div></div>`).join(''):'<div class="xy-muted">暂无日志。</div>'}</div>`; }
  function renderSettings(){ return `<div class="xy-card"><h3>界面设置</h3><label class="xy-field"><span>背景 URL</span><input data-setting="backgroundUrl" value="${esc(settings.backgroundUrl)}"></label><div class="xy-two"><label class="xy-field"><span>背景透明度</span><input type="number" data-setting="backgroundOpacity" value="${esc(settings.backgroundOpacity)}"></label><label class="xy-field"><span>背景模糊</span><input type="number" data-setting="backgroundBlur" value="${esc(settings.backgroundBlur)}"></label></div><div class="xy-card" style="margin-top:10px"><h3>界面大小</h3><div class="xy-muted">支持即时预览：拖动或输入后立刻改变窗口大小；本版修复了 !important 覆盖导致不生效的问题。</div><div class="xy-two"><label class="xy-field"><span>窗口宽度 vw</span><input type="range" min="45" max="96" step="1" data-setting="panelWidthVw" value="${esc(settings.panelWidthVw)}"><input type="number" min="45" max="96" data-setting="panelWidthVw" value="${esc(settings.panelWidthVw)}"></label><label class="xy-field"><span>窗口高度 dvh</span><input type="range" min="45" max="96" step="1" data-setting="panelHeightVh" value="${esc(settings.panelHeightVh)}"><input type="number" min="45" max="96" data-setting="panelHeightVh" value="${esc(settings.panelHeightVh)}"></label></div><div class="xy-actions"><button class="xy-btn" data-action="set-panel-size" data-w="60" data-h="65">小窗</button><button class="xy-btn primary" data-action="set-panel-size" data-w="75" data-h="75">默认 3/4</button><button class="xy-btn" data-action="set-panel-size" data-w="90" data-h="88">大窗</button><button class="xy-btn" data-action="set-panel-size" data-w="96" data-h="96">近全屏</button></div><div class="xy-muted">手机端建议 90×88 或近全屏；PC 端建议 75×75。</div></div><button class="xy-btn" data-action="reset-float">重置悬浮标位置</button><button class="xy-btn" data-action="reset-panel">重置面板位置</button></div><div class="xy-card"><h3>存档管理</h3><button class="xy-btn" data-action="export-state">导出角色图式</button><button class="xy-btn" data-action="import-state">导入角色图式</button><button class="xy-btn danger" data-action="clear-state">清空角色图式</button></div><div class="xy-card"><h3>关于</h3><div class="xy-muted">雪月 · by@冬月</div><a style="color:#bffcf2" href="https://discord.gg/WEMrpgr5" target="_blank">个人服务器，欢迎大家过来玩•͈ᴗ⁃͈ ✧</a></div>`; }

  function onChange(e){ const el=e.target; if(el.dataset.storyCheck){ const m=getStory(); m[el.dataset.storyCheck]=!!el.checked; saveStory(m); renderDrawer(); return; } if(el.dataset.setting){ const key=el.dataset.setting; settings[key]=el.type==='checkbox'?!!el.checked:((el.type==='number'||el.type==='range')?Number(el.value):el.value); if(key==='panelWidthVw'||key==='panelHeightVh'){ settings.panelX=null; settings.panelY=null; saveJson(LS_SETTINGS,settings); applyPanelSize(rootDoc.getElementById(IDS.drawer)); return; } saveJson(LS_SETTINGS,settings); if(key==='backgroundUrl'||key==='backgroundOpacity'||key==='backgroundBlur'){ applyBg(); return; } if(['archiveDisplayEnabled','dynamicArchiveBeautify','dynamicArchiveRemoveOutput','routeOptionsRemoveOutput','dynamicArchiveDefaultCollapsed','dynamicArchiveTitle','fixedArchiveDisplay','fixedArchiveTitle','archiveFoldBgUrl','archiveFoldBgOpacity','archiveFoldBgBlur','routeButtonsEnabled','routeTitle','tagRepairEnabled','autoCloseTags','sameOpenAsCloseFix','tagBoundaryProtect','freezeModeEnabled','freezeInjectEnabled','cgEnabled','cgAutoProcess','cgRemoveOutput','cgVirtualCard','cgTitle','cgSubtitle','cgSigil','cgDefaultCollapsed','cgBackgroundMode','cgFixedBackgroundUrl','cgBackgroundOpacity','cgBackgroundBlur'].includes(key)){ saveJson(LS_SETTINGS,settings); beautifyRecentArchives(50); renderDrawer(); return; } renderDrawer(); } }
  function onInput(e){
    const el=e.target;
    if(!el || !el.dataset) return;
    const key = el.dataset.setting || el.dataset.settingLive;
    if(!key) return;
    if(key==='panelWidthVw' || key==='panelHeightVh'){
      settings[key] = Number(el.value);
      settings.panelX = null;
      settings.panelY = null;
      saveJson(LS_SETTINGS, settings);
      const drawer = rootDoc.getElementById(IDS.drawer);
      applyPanelSize(drawer);
      // 同步同一设置项的 range / number 输入框，不重绘整个面板，避免输入框失焦。
      rootDoc.querySelectorAll(`#${IDS.drawer} [data-setting="${key}"]`).forEach(x=>{ if(x!==el) x.value = String(settings[key]); });
      return;
    }
    if(key==='backgroundUrl' || key==='backgroundOpacity' || key==='backgroundBlur'){
      settings[key] = el.type==='number' || el.type==='range' ? Number(el.value) : el.value;
      saveJson(LS_SETTINGS, settings);
      applyBg();
      return;
    }
    if(el.dataset.settingLive){ settings[key]=el.value; saveJson(LS_SETTINGS,settings); }
  }
  function onClick(e){ const btn=e.target.closest('[data-action]'); if(!btn)return; e.preventDefault(); e.stopPropagation(); const a=btn.dataset.action; if(Date.now()<ignoreClickUntil && ['toggle-prompt','select-prompt','open-folder'].includes(a)) return; if(a==='close') return closeDrawer(); if(a==='tab'){settings.currentTab=btn.dataset.tab; saveJson(LS_SETTINGS,settings); return renderDrawer();} if(a==='backup-preset') return backupPrompts(); if(a==='copy-preset-summary') return copyText(getPrompts().map(p=>`${p.enabled!==false?'✅':'⬜'} ${p.name}`).join('\n')); if(a==='save-current-mode') return saveCurrentAsMode(); if(a==='apply-preset-mode') return applyPresetMode(btn.dataset.modeName); if(a==='delete-preset-mode') return deletePresetMode(btn.dataset.modeName); if(a==='toggle-arrange-mode') return toggleArrangeMode(); if(a==='clear-prompt-selection') return clearPromptSelection(); if(a==='create-prompt-folder') return createFolderFromSelected(); if(a==='create-prompt-entry') return createPromptEntry(); if(a==='open-folder') return openFolder(btn.dataset.folderStart, btn.dataset.folderEnd); if(a==='close-folder') return closeFolder(); if(a==='select-prompt') return togglePromptSelection(btn.dataset.promptId); if(a==='dissolve-folder') return dissolveFolder(btn.dataset.folderStart,btn.dataset.folderEnd,btn.dataset.folderTitle); if(a==='move-folder') return moveFolderBlock(btn.dataset.folderStart,btn.dataset.folderEnd,btn.dataset.dir); if(a==='move-prompt') return movePrompt(btn.dataset.promptId, btn.dataset.dir); if(a==='toggle-prompt') return togglePrompt(btn.dataset.promptId); if(a==='copy-prompt') return copyPrompt(btn.dataset.promptId); if(a==='view-prompt') return togglePrompt(btn.dataset.promptId); if(a==='close-prompt-modal') return closePromptModal(); if(a==='save-prompt-edit') return savePromptEdit(btn.dataset.promptId); if(a==='select-narrative') return setNarrativeModel(btn.dataset.narrativeId); if(a==='clear-narrative') return clearNarrativeModel(); if(a==='enter-event') return selectEvent(btn.dataset.eventId); if(a==='return-mainline') return returnMainline(); if(a==='clear-active-event') return clearActiveEvent(); if(a==='repair-latest-tags') return repairLatestMessageTags(); if(a==='beautify-recent-archives'){ manualBeautifyRecentArchives(50).catch(err=>{addLog('error','手动美化失败',err.message||String(err));toast('手动美化失败','error');}); return; } if(a==='extract-labels') return extractLabelsFromLatestAssistant(); if(a==='save-labels') return saveLabelsFromTextarea(); if(a==='copy-labels'){ copyText(getLabelText()); toast('已复制标签。'); return; } if(a==='clear-labels') return clearLabels(); if(a==='apply-recommended-injection') return applyRecommendedInjectionSettings(); if(a==='inject-now') return injectNow(); if(a==='process-now') return processLatest(); if(a==='add-char') return addCharPrompt(); if(a==='activate'||a==='deactivate'||a==='move'||a==='edit-char'||a==='delete-char') return roleAction(btn); if(a==='save-story') return saveStoryField(btn.dataset.field); if(a==='copy-story'){const m=getStory(); copyText(m[btn.dataset.field]||''); return;} if(a==='select-route') return selectRoute(btn.dataset.route); if(a==='clear-route'){const m=getStory();m.selectedRoute=null;saveStory(m);return renderDrawer();} if(a==='clear-routes'){const m=getStory();m.lastRoutes=[];m.routeOptionsText='';m.selectedRoute=null;saveStory(m);return renderDrawer();} if(a==='export-story'){copyText(JSON.stringify(getStory(),null,2));toast('已复制剧情档案。');return;} if(a==='import-story')return importStory(); if(a==='clear-story')return clearStory(); if(a==='save-template')return saveTemplate(btn.dataset.template); if(a==='reset-template'){templates[btn.dataset.template]=DEFAULT_TEMPLATES[btn.dataset.template]; saveJson(LS_TEMPLATES,templates); return renderDrawer();} if(a==='copy-template'){copyText(templates[btn.dataset.template]||DEFAULT_TEMPLATES[btn.dataset.template]||'');return;} if(a==='copy-logs'){copyText(JSON.stringify(logs,null,2));return;} if(a==='clear-logs'){logs=[];saveJson(LS_LOGS,logs);return renderDrawer();} if(a==='set-panel-size'){settings.panelWidthVw=Number(btn.dataset.w)||75;settings.panelHeightVh=Number(btn.dataset.h)||75;settings.panelX=null;settings.panelY=null;saveJson(LS_SETTINGS,settings);applyPanelSize(rootDoc.getElementById(IDS.drawer));renderDrawer();toast('已调整界面大小。');return;} if(a==='reset-float'){settings.floatTop=320;saveJson(LS_SETTINGS,settings);rootDoc.getElementById(IDS.float).style.top='320px';return;} if(a==='reset-panel'){settings.panelX=null;settings.panelY=null;saveJson(LS_SETTINGS,settings);const d=rootDoc.getElementById(IDS.drawer); placeDrawer(d,true); toast('已重置面板位置。');return;} if(a==='export-state'){copyText(JSON.stringify(getState(),null,2));return;} if(a==='import-state')return importState(); if(a==='clear-state')return clearState(); }
  function addCharPrompt(){ const name=rootWin.prompt('输入角色名：'); if(!name)return; const s=getState(); if(s.characters[name])return toast('角色已存在','warning'); s.characters[name]=createChar({name,role:'手动新增角色'}); addToGroup(s,name,'newCharacters'); saveState(s); renderDrawer(); }
  function roleAction(btn){ const name=btn.dataset.char, s=getState(), a=btn.dataset.action; if(a==='activate') addToGroup(s,name,'active'); if(a==='deactivate') s.activeCharacters=(s.activeCharacters||[]).filter(x=>x!==name); if(a==='move') addToGroup(s,name,btn.dataset.group); if(a==='edit-char'){ const raw=rootWin.prompt('编辑角色 JSON：',JSON.stringify(s.characters[name],null,2)); if(raw){try{s.characters[name]=JSON.parse(raw)}catch(e){return toast(e.message,'error')}} } if(a==='delete-char'){ if(!rootWin.confirm(`确定删除「${name}」吗？`))return; delete s.characters[name]; removeFromGroups(s,name); } saveState(s); renderDrawer(); }
  function saveStoryField(field){ const el=rootDoc.querySelector(`[data-story="${field}"]`); const m=getStory(); if(el){m[field]=el.value; if(field==='dynamicText') m.freezeActive=/限制级事件中|主线冻结\s*[:：]\s*["“]?是/.test(m.dynamicText);} saveStory(m); renderDrawer(); }
  function selectRoute(id){ const m=getStory(); m.selectedRoute=(m.lastRoutes||[]).find(r=>String(r.id)===String(id))||null; saveStory(m); addLog('success','已选择剧情路线',m.selectedRoute?`${m.selectedRoute.id} · ${m.selectedRoute.title}`:'无'); renderDrawer(); setTimeout(()=>beautifyRecentArchives(50),80); }
  function importStory(){ const raw=rootWin.prompt('粘贴剧情档案 JSON：'); if(!raw)return; try{saveStory(JSON.parse(raw));renderDrawer();}catch(e){toast(e.message,'error')} }
  function clearStory(){ if(rootWin.prompt('输入 DELETE 清空剧情档案：')==='DELETE'){saveStory(baseStory());renderDrawer();} }
  function saveTemplate(k){ const el=rootDoc.querySelector(`[data-template="${k}"]`); if(!el)return; templates[k]=el.value; saveJson(LS_TEMPLATES,templates); toast('已保存模板。'); }
  function importState(){ const raw=rootWin.prompt('粘贴角色图式 JSON：'); if(!raw)return; try{saveState(JSON.parse(raw));renderDrawer();}catch(e){toast(e.message,'error')} }
  function clearState(){ if(rootWin.prompt('输入 DELETE 清空角色图式：')==='DELETE'){saveState(makeState());renderDrawer();} }


  async function repairLatestMessageTags(){
    if(!api.getChatMessages || !api.setChatMessages) return toast('缺少聊天消息接口。','error');
    const msg = await latestAssistant();
    if(!msg) return toast('未找到最新助手消息。','warning');
    const rr = repairStoryTagsText(msg.message || '');
    if(!rr.changed) { toast('最新楼层没有需要修复的标签。','info'); return; }
    await api.setChatMessages([{message_id: msg.message_id, message: rr.text}], {refresh:'affected'});
    addLog('success','已手动修复最新楼层标签',`楼层 ${msg.message_id}`);
    setTimeout(()=>beautifyMessageArchives(msg.message_id),120);
  }


  function isNodeInsideXueyueConsole(node){
    try{
      if(!node || node.nodeType !== 1) return false;
      const el = node;
      if(el.id === IDS.drawer || el.id === IDS.float || el.id === IDS.style) return true;
      return !!(el.closest && el.closest(`#${IDS.drawer},#${IDS.float},#${IDS.style}`));
    }catch(_){ return false; }
  }

  function isArchiveUiNode(node){
    try{
      if(!node || node.nodeType !== 1) return false;
      const el = node;
      return !!(el.matches && el.matches('.xueyue-archive-virtual,.xueyue-archive-card,.xueyue-route-card,.xueyue-cg-card,.xueyue-cg-inline,.xueyue-cg-virtual')) ||
        !!(el.closest && el.closest('.xueyue-archive-virtual,.xueyue-archive-card,.xueyue-route-card,.xueyue-cg-card,.xueyue-cg-inline,.xueyue-cg-virtual'));
    }catch(_){ return false; }
  }

  function mutationNeedsArchiveRepaint(mutations){
    let touchedMessage = false;
    let hasNonArchiveChange = false;
    for(const m of mutations || []){
      const target = m.target;
      if(isNodeInsideXueyueConsole(target)) continue;
      try{
        if(target && target.nodeType === 1 && target.closest && target.closest('.mes,.mes_text')) touchedMessage = true;
      }catch(_){ }
      if(m.type === 'characterData'){
        const p = target && target.parentElement;
        if(p && isNodeInsideXueyueConsole(p)) continue;
        if(p && isArchiveUiNode(p)) continue;
        if(p && p.closest && p.closest('.mes,.mes_text')) { touchedMessage = true; hasNonArchiveChange = true; }
        continue;
      }
      const nodes = [...(m.addedNodes || []), ...(m.removedNodes || [])];
      for(const n of nodes){
        if(isNodeInsideXueyueConsole(n)) continue;
        if(isArchiveUiNode(n)) continue;
        if(n.nodeType === 3){
          const p = n.parentElement || target;
          if(p && p.closest && p.closest('.mes,.mes_text')) { touchedMessage = true; hasNonArchiveChange = true; }
          continue;
        }
        if(n.nodeType !== 1) continue;
        const el = n;
        if(el.matches && el.matches('script,style,textarea,input,button,select')) continue;
        if(el.closest && el.closest('.mes,.mes_text')) touchedMessage = true;
        if(el.querySelector && el.querySelector('.mes,.mes_text')) touchedMessage = true;
        hasNonArchiveChange = true;
      }
    }
    return touchedMessage && hasNonArchiveChange;
  }

  function scheduleArchiveAutoRepaint(delay=320){
    if(!settings.archiveDisplayEnabled) return;
    clearTimeout(archiveRepaintTimer);
    archiveRepaintTimer = rootWin.setTimeout(()=>{
      if(archiveRepaintBusy) return;
      archiveRepaintBusy = true;
      try{
        beautifyRecentArchives(30,{forceVirtual:true});
      }catch(err){
        addLog('error','自动重建虚拟剧情卡失败',err.message||String(err));
      }finally{
        archiveRepaintBusy = false;
      }
    }, delay);
  }

  function startArchiveAutoRepaintObserver(){
    try{ archiveMutationObserver && archiveMutationObserver.disconnect(); }catch(_){ }
    archiveMutationObserver = null;
    const MO = rootWin.MutationObserver || window.MutationObserver;
    if(!MO || !rootDoc.body) return;
    archiveMutationObserver = new MO(mutations=>{
      if(mutationNeedsArchiveRepaint(mutations)) scheduleArchiveAutoRepaint(420);
    });
    archiveMutationObserver.observe(rootDoc.body,{childList:true,subtree:true,characterData:true});
    scheduleArchiveAutoRepaint(900);
  }

  let lastArchiveToggleAt = 0;
  let lastArchiveToggleKey = '';
  function handleArchiveCardToggle(event){
    const header = event.target && event.target.closest && event.target.closest('.xueyue-archive-summary[data-xy-archive-toggle="true"]');
    if(!header) return false;
    const card = header.closest && header.closest('.xueyue-archive-card[data-xy-archive-card="true"]');
    if(!card) return false;
    const key = card.dataset.xyArchiveKey || '';
    const now = Date.now();
    if(key && key === lastArchiveToggleKey && now - lastArchiveToggleAt < 280){
      event.stopPropagation();
      return true;
    }
    event.stopPropagation();
    const opening = card.classList.contains('collapsed');
    card.classList.toggle('collapsed', !opening);
    if(key) archiveOpenStates.set(key, opening);
    lastArchiveToggleKey = key;
    lastArchiveToggleAt = now;
    const label = card.querySelector('.xy-archive-click');
    if(label) label.textContent = opening ? '点击收起' : '点击展开';
    return true;
  }


  let archiveBodyScrollState = null;
  function getArchiveScrollableBody(target){
    try{
      const el = target && target.closest && target.closest('.xueyue-archive-body,.xueyue-cg-body');
      if(!el) return null;
      if(el.closest && el.closest('.xueyue-archive-card,.xueyue-cg-card')) return el;
    }catch(_){ }
    return null;
  }
  function bindArchiveBodyScrollGuard(){
    const optsPassiveCapture = {capture:true, passive:true};
    const optsActiveCapture = {capture:true, passive:false};
    addGlobalListener(rootDoc,'touchstart', e=>{
      const body = getArchiveScrollableBody(e.target);
      if(!body || !e.touches || !e.touches.length) return;
      archiveBodyScrollState = {
        body,
        startY:e.touches[0].clientY,
        startX:e.touches[0].clientX,
        startTop:body.scrollTop,
        max:Math.max(0, body.scrollHeight - body.clientHeight)
      };
      // touchstart 不拦截，避免阻断 SillyTavern 自身的滚动/点击准备；真正滚动时在 touchmove 中接管。
    }, optsPassiveCapture);
    addGlobalListener(rootDoc,'touchmove', e=>{
      const st = archiveBodyScrollState;
      if(!st || !st.body || !e.touches || !e.touches.length) return;
      const body = getArchiveScrollableBody(e.target);
      if(body !== st.body) return;
      const dx = Math.abs(e.touches[0].clientX - st.startX);
      const dyRaw = e.touches[0].clientY - st.startY;
      const dy = st.startY - e.touches[0].clientY;
      const max = Math.max(0, st.body.scrollHeight - st.body.clientHeight);
      if(max <= 1) return;
      // 横向手势交给外层，纵向手势由档案卡自己滚动。
      if(dx > Math.abs(dyRaw) + 8) return;
      const next = Math.max(0, Math.min(max, st.startTop + dy));
      const goingDown = dy > 0;
      const goingUp = dy < 0;
      const atTop = st.body.scrollTop <= 0;
      const atBottom = st.body.scrollTop >= max - 1;
      // 未到边界时，手动滚动内部内容，避免 ST 外层把 touchmove 吃掉。
      if((goingDown && !atBottom) || (goingUp && !atTop)){
        st.body.scrollTop = next;
        e.preventDefault();
        e.stopPropagation();
      }
    }, optsActiveCapture);
    addGlobalListener(rootDoc,'touchend', ()=>{ archiveBodyScrollState = null; }, true);
    addGlobalListener(rootDoc,'touchcancel', ()=>{ archiveBodyScrollState = null; }, true);
    addGlobalListener(rootDoc,'wheel', e=>{
      const body = getArchiveScrollableBody(e.target);
      if(!body) return;
      const max = Math.max(0, body.scrollHeight - body.clientHeight);
      if(max <= 1) return;
      const oldTop = body.scrollTop;
      const next = Math.max(0, Math.min(max, oldTop + e.deltaY));
      if(next !== oldTop){
        body.scrollTop = next;
        e.preventDefault();
        e.stopPropagation();
      }
    }, optsActiveCapture);
  }

  function bindEvents(){ bindArchiveBodyScrollGuard(); addGlobalListener(rootDoc,'click', e=>{ if(handleArchiveCardToggle(e)) return; const eb=e.target.closest&&e.target.closest('.xueyue-event-btn[data-xy-event-id]'); if(eb){ e.preventDefault(); e.stopPropagation(); selectEvent(eb.dataset.xyEventId); return; } const rb=e.target.closest&&e.target.closest('.xueyue-return-btn[data-xy-return-mainline]'); if(rb){ e.preventDefault(); e.stopPropagation(); returnMainline(); return; } const b=e.target.closest&&e.target.closest('.xueyue-route-btn[data-xy-route-id]'); if(!b) return; e.preventDefault(); e.stopPropagation(); selectRoute(b.dataset.xyRouteId); beautifyRecentArchives(50); }, false); const E=api.tavern_events||{}; const before=[E.GENERATION_AFTER_COMMANDS,E.GENERATE_BEFORE_COMBINE_PROMPTS,'GENERATION_AFTER_COMMANDS','GENERATE_BEFORE_COMBINE_PROMPTS']; const after=[E.GENERATION_ENDED,E.MESSAGE_RECEIVED,E.CHARACTER_MESSAGE_RENDERED,'GENERATION_ENDED','MESSAGE_RECEIVED','CHARACTER_MESSAGE_RENDERED']; before.forEach(ev=>{try{ev&&api.eventOn&&api.eventOn(ev,injectNow)}catch(_){}}); after.forEach(ev=>{try{ev&&api.eventOn&&api.eventOn(ev,()=>{clearTimeout(processTimer);processTimer=setTimeout(()=>settings.autoProcessAfterGeneration&&processLatest(),900);setTimeout(()=>beautifyRecentArchives(8),1200);})}catch(_){}}); try{ const ctx = rootWin.SillyTavern && rootWin.SillyTavern.getContext ? rootWin.SillyTavern.getContext() : null; const es=ctx&&ctx.eventSource, et=ctx&&ctx.event_types; if(es&&et){ [et.MESSAGE_UPDATED,et.MESSAGE_EDITED,et.MESSAGE_SWIPED,et.CHARACTER_MESSAGE_RENDERED,et.CHAT_CHANGED].filter(Boolean).forEach(ev=>{ try{ const h=()=>setTimeout(()=>beautifyRecentArchives(30,{forceVirtual:true}),220); es.on(ev,h); eventUnsubscribers.push(()=>{try{ if(es.off) es.off(ev,h); else if(es.removeListener) es.removeListener(ev,h); }catch(_){}}); }catch(_){} }); } }catch(_){} if(api.getButtonEvent&&api.eventOn){ const map={'打开雪月':openDrawer,'雪月面板':openDrawer,'处理XUEYUE':processLatest,'注入雪月':injectNow}; Object.keys(map).forEach(n=>{try{api.eventOn(api.getButtonEvent(n),map[n])}catch(_){}}); } startArchiveAutoRepaintObserver(); }
  function destroy(){ try{ eventAbortController && eventAbortController.abort(); }catch(_){} while(eventUnsubscribers.length){ try{ eventUnsubscribers.pop()(); }catch(_){} } try{ archiveMutationObserver && archiveMutationObserver.disconnect(); }catch(_){} clearTimeout(archiveRepaintTimer); cleanupOldUi(); }

  ensureStyle(); createUi(); bindEvents(); rootWin[NS]={version:VERSION,open:openDrawer,close:closeDrawer,destroy,getState,getStory}; try{ LEGACY_NS_KEYS.forEach(k=>{ rootWin[k]=rootWin[NS]; }); }catch(_){}
})();
