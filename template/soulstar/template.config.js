/**
 * Start Kit 标准模板配置
 */

module.exports = {
  name: "Start Kit Standard",
  description: "Start Kit 标准页面模板 - 单文件多语言格式",
  langType: "single-file",
  defaultLanguages: ["en", "ar", "tr"],
  
  // 文件结构定义
  files: [
    { path: "index.html", template: "index.html.ejs" },
    { path: "main.ts", template: "main.ts.ejs" },
    { path: "lang.ts", template: "lang.ts.ejs" },
    { path: "router/index.ts", template: "router/index.ts.ejs" },
    { path: "pages/App.vue", template: "pages/App.vue.ejs" },
    { path: "api/index.ts", template: "api/index.ts.ejs" },
    { path: "assets/css/common.scss", template: "assets/css/common.scss.ejs" },
  ],
};

