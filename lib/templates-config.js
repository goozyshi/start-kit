/**
 * 模板配置元数据
 * 支持未来扩展多种项目模板
 */

const LANGUAGE_NAMES = {
  en: "English",
  ar: "العربية (Arabic)",
  tr: "Türkçe (Turkish)",
  hi: "हिन्दी (Hindi)",
  pa: "ਪੰਜਾਬੀ (Punjabi)",
  zh_CN: "简体中文",
  zh_TW: "繁體中文",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
  vi: "Tiếng Việt (Vietnamese)",
  th: "ไทย (Thai)",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  fr: "Français (French)",
  de: "Deutsch (German)",
  es: "Español (Spanish)",
  pt: "Português (Portuguese)",
  ru: "Русский (Russian)",
  km: "ភាសាខ្មែរ (Khmer)",
  lo: "ລາວ (Lao)",
};

const TEMPLATES = {
  soulstar: {
    id: "soulstar",
    name: "标准模板",
    description: "Start Kit 标准页面模板 (单文件多语言)",
    langType: "single-file", // 'single-file' 或 'multi-file'
    defaultLanguages: ["en", "ar", "tr"],
    availableLanguages: ["en", "ar", "tr"],
    structure: [
      "index.html",
      "main.ts",
      "lang.ts",
      "router/index.ts",
      "pages/App.vue",
      "api/index.ts",
      "assets/css/common.scss",
    ],
  },
  // 未来扩展示例：
  // dice: {
  //   id: 'dice',
  //   name: 'Dice Game',
  //   description: '游戏类项目模板 (多文件多语言)',
  //   langType: 'multi-file',
  //   defaultLanguages: ['en', 'ar', 'tr'],
  //   availableLanguages: Object.keys(LANGUAGE_NAMES),
  //   structure: [
  //     'index.html',
  //     'main.ts',
  //     'i18n/index.ts',
  //     'i18n/[lang].json',
  //     'router/index.ts',
  //     'pages/App.vue',
  //     'api/index.ts',
  //     'assets/css/common.scss'
  //   ]
  // }
};

module.exports = {
  TEMPLATES,
  LANGUAGE_NAMES,

  /**
   * 获取所有可用模板
   */
  getAllTemplates() {
    return Object.values(TEMPLATES);
  },

  /**
   * 获取指定模板配置
   */
  getTemplate(templateId) {
    const template = TEMPLATES[templateId];
    if (!template) {
      throw new Error(`模板不存在: ${templateId}`);
    }
    return template;
  },

  /**
   * 获取语言显示名称
   */
  getLanguageName(langCode) {
    return LANGUAGE_NAMES[langCode] || langCode;
  },
};

