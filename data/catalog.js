/*
 * 数据来源：网盘数据库「网盘数据库」表（刊物 = Science / Bluey）+ 仓库内 How It Works 年份清单
 * 新增刊物或年份时，在下面的数组里加一行即可，站点会自动渲染。
 */
(function () {
  'use strict';

  var BD = function (id, code) { return { url: 'https://pan.baidu.com/s/' + id + '?pwd=' + code, code: code }; };
  var QK = function (id) { return { url: 'https://pan.quark.cn/s/' + id, code: '' }; };
  var CT = function (id) { return { url: 'https://url38.ctfile.com/d/3404238-' + id + '?p=2727', code: '2727' }; };
  var NONE = { url: '', code: '' };

  /* 年份, 百度ID, 百度码, 夸克ID, 城通ID */
  var science = [
    [2026, '12PlUHLMzqEQuooxqVc5NSA', 'k7k4', 'b6a52bec4875', '169122150-419353'],
    [2025, '1-rplyBYrTjJfb1BdwD0jWg', 'ekjr', '078017b2f929', '169122039-ea1fa3'],
    [2024, '1P9FVWFq1gqiU8RMIal13Jw', '8hij', '917e2bf895d6', '169121860-f19164'],
    [2023, '1_dPcUlstJRsDN1KNpl6ksw', 'y1al', '3c76312eba77', '169121673-08ebb2'],
    [2022, '13XEk8jd7t3mHo_CiiVfPJA', '3hup', '8dc7fee3c882', '169121467-b1b534'],
    [2021, '11iP-IFXLvkHkkjEHbg4V-A', 'b1a2', '8c540081b2d4', '169121298-f932b7'],
    [2020, '1d88gorhrhoDFtQa4cLbMLg', 's7k2', 'b134bd5ce0de', '169121143-0f9c0c'],
    [2019, '1xqZNShz8oupqA2u3ScUlDQ', 'fzw2', '3ef1a7786b3e', '169121033-e58ddb'],
    [2018, '1iFCea_LQDQSu9v4FV1gYlA', 'c8dg', '1d2b0db9e34f', '169120928-7aabad']
  ].map(function (r) {
    return {
      year: r[0],
      title: 'Science 科学杂志 ' + r[0] + '年合集 英文原版PDF',
      checked: '2026-10-28',
      links: { baidu: BD(r[1], r[2]), quark: QK(r[3]), ctfile: CT(r[4]) }
    };
  });

  /* 年份, 百度ID, 百度码, 夸克ID, 城通ID */
  var bluey = [
    [2026, '1ObdrnuUFF-Lz6A5vhYcKUw', 'gleu', '7d877775d139', '169131260-5da771'],
    [2025, '1Lrcl_Ara2pV7gBhyh4mkZA', '6i0u', 'a34993ad3021', '169131254-35c008'],
    [2024, '1WhjqbggCjBd-pdkg6eP27Q', '3a3y', 'b62c100a3272', '169131248-5ad240'],
    [2023, '1QlP0sa5DiPjOnXiJTMoxwg', 'dai0', '0b3d190c5217', '169131242-c742b6']
  ].map(function (r) {
    return {
      year: r[0],
      title: 'Bluey 布鲁伊儿童杂志 ' + r[0] + '年合集 英文原版PDF',
      checked: '2026-10-30',
      links: { baidu: BD(r[1], r[2]), quark: QK(r[3]), ctfile: CT(r[4]) }
    };
  });

  /* How It Works：全站共用一个分享，按年份给文件清单 */
  var hiwShare = { baidu: BD('1KnsJJ0tCPTf2sn5s6lFPgQ', 'dwbk'), quark: QK('f6319d2212dd'), ctfile: NONE };
  var hiwList = "https://github.com/zhongyuanqi/waikan-zazhi/blob/main/How%20it%20works/How%20It%20Works%20";
  var howItWorks = [
    [2025, 21, 1767],
    [2024, 36, 3152],
    [2023, 37, 3561],
    [2022, 36, 1445]
  ].map(function (r) {
    return {
      year: r[0],
      title: 'How It Works ' + r[0] + ' 全年合集',
      files: r[1],
      sizeMB: r[2],
      checked: '',
      listUrl: hiwList + r[0],
      links: hiwShare
    };
  });

  window.CATALOG = {
    updated: '2026-10-30',
    stats: { pubs: 3, entries: 17, hiwFiles: 130, hiwMB: 9925, span: '2018 — 2026' },
    pubs: [
      {
        key: 'how-it-works',
        name: 'How It Works',
        zh: '知识图解',
        category: 'science',
        categoryLabel: '科普',
        accent: '#D9472F',
        origin: '英国 · Immediate Media',
        intro: '英国科普月刊，用大幅剖面图、信息图和大量实拍拆解科技、历史、人体、宇宙。以单期杂志与主题专辑（Book of / Understanding 系列）出版。',
        span: '2022 — 2025',
        entries: howItWorks
      },
      {
        key: 'science',
        name: 'Science',
        zh: '科学',
        category: 'science',
        categoryLabel: '学术',
        accent: '#1D4ED8',
        origin: '美国 · AAAS',
        intro: '美国科学促进会（AAAS）出版的顶级同行评议周刊，覆盖生命科学、物理、地球科学等全部前沿领域，是科研工作者最常引用的综合期刊之一。',
        span: '2018 — 2026',
        entries: science
      },
      {
        key: 'bluey',
        name: 'Bluey',
        zh: '布鲁伊',
        category: 'kids',
        categoryLabel: '儿童',
        accent: '#E08A1E',
        origin: '澳大利亚 · BBC Studios',
        intro: '改编自同名动画的儿童杂志，围绕蓝色牧牛犬 Bluey 一家的日常，用游戏、贴纸、涂色和小故事做亲子共读与英语启蒙。',
        span: '2023 — 2026',
        entries: bluey
      }
    ],
    planned: [
      { name: 'National Geographic Kids', zh: '国家地理少儿版', note: '自然科学 · 6-14 岁' },
      { name: 'National Geographic Little Kids', zh: '国家地理幼儿版', note: '自然科学 · 3-6 岁' },
      { name: 'Eco Kids Planet', zh: '生态星球', note: '环保科普 · 7-12 岁' },
      { name: 'TIME for Kids Family', zh: '时代周刊少儿版', note: '时事新闻 · 8-14 岁' }
    ],
    log: [
      { date: '2026-10-30', text: '新增《Science》2018—2026 年度合集 9 份、《Bluey》2023—2026 年度合集 4 份' },
      { date: '2025-09-01', text: '《How It Works》补充 Book of Amazing Vehicles Ed.13 2025' }
    ]
  };
})();
