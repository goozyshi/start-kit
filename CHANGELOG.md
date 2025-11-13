# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2025-11-12

### ✨ 重大优化

- **移除 sass 依赖，转换为纯 CSS**
  - 将所有 SCSS 文件转换为标准 CSS
  - 移除 `sass` 依赖（节省 ~15MB 安装体积）
  - 包体积减小约 6%
  - 启动速度提升（无需 sass 编译）
  - 更好的兼容性（标准 CSS）

### 📂 转换的文件

- ✅ `public_class.scss` → `public_class.css`
- ✅ `viteInit-animate.scss` → `viteInit-animate.css`
- ✅ `viteInit-style.scss` → `viteInit-style.css`
- ✅ `app.vue` - 移除 `lang="scss"` 和嵌套规则

### 📦 优化效果

| 对比项 | v1.0.2 | v1.0.3 | 改善 |
|--------|--------|--------|------|
| **包体积** | 25.5 kB | ~24 kB | -6% |
| **sass 依赖** | ✅ 需要 | ❌ 不需要 | -15MB |
| **编译速度** | 需要 sass | 原生 CSS | 更快 |

### 🚀 升级方式

```bash
# 卸载旧版本
npm uninstall @goozyshi/start-kit

# 安装新版本
npm install @goozyshi/start-kit@1.0.3 -D --legacy-peer-deps

# 清除缓存
rm -rf node_modules/.vite

# 启动仪表盘
npm run dashboard
```

**重要：** v1.0.3 不再需要 sass 依赖，安装更快，体积更小！

---

## [1.0.2] - 2025-11-12

### 🐛 Bug Fixes

- **添加缺失的 sass 依赖**
  - 修复错误：`Preprocessor dependency "sass" not found`
  - UI 界面使用了 SCSS 样式文件，但缺少 sass 预处理器
  - 将 `sass@^1.54.0` 添加到 dependencies

### ✅ 验证

- ✅ dayjs 兼容性问题已解决（v1.0.1）
- ✅ sass 预处理器依赖已添加（v1.0.2）

### 📦 升级方式

```bash
# 卸载旧版本
npm uninstall @goozyshi/start-kit

# 安装新版本
npm install @goozyshi/start-kit@1.0.2 -D --legacy-peer-deps

# 清除缓存
rm -rf node_modules/.vite

# 启动仪表盘
npm run dashboard
```

---

## [1.0.1] - 2025-11-12

### 🐛 Bug Fixes

- **修复 dayjs ESM 兼容性问题**
  - 添加 `optimizeDeps` 配置，显式包含 `vue`、`element-plus` 和 `dayjs` 及其插件
  - 配置 `build.commonjsOptions` 以正确处理 CJS/ESM 混合模块
  - 解决错误：`The requested module does not provide an export named 'default'`

### 📝 Technical Details

**问题根因：**

- Element Plus 依赖 dayjs
- dayjs 的某些分发文件（如 `dayjs.min.js`）使用 UMD 格式
- Vite 在未配置预构建时，可能将 UMD 模块误识别为 ESM，导致导入失败

**解决方案：**
在 Vite 配置中添加：

```javascript
optimizeDeps: {
  include: [
    "vue",
    "element-plus",
    "element-plus/es",
    "@element-plus/icons-vue",
    "dayjs",
    "dayjs/plugin/customParseFormat",
    "dayjs/plugin/advancedFormat",
    "dayjs/plugin/localeData",
    // ... 其他 dayjs 插件
  ],
},
build: {
  commonjsOptions: {
    include: [/node_modules/],
    transformMixedEsModules: true,
  },
},
```

### 🔄 Migration Guide

**升级到 v1.0.1：**

```bash
# 卸载旧版本
npm uninstall @goozyshi/start-kit

# 安装新版本
npm install @goozyshi/start-kit@1.0.1 -D --legacy-peer-deps

# 清除 Vite 缓存（可选）
rm -rf node_modules/.vite
```

**验证修复：**

1. 启动仪表盘：`npm run dashboard`
2. 打开浏览器控制台，确认没有 dayjs 相关错误
3. 测试创建新页面功能

---

## [1.0.0] - 2025-11-12

### 🎉 Initial Release

**核心功能：**

- ✅ 智能页面扫描（自动识别 `src/page`、`src/pages` 等目录）
- ✅ 可视化页面导航（支持三级目录结构）
- ✅ 一键页面生成（支持多级目录：`2025/11`）
- ✅ 多语言配置（en/ar/tr 自由组合）
- ✅ 服务器状态检测
- ✅ CLI 命令（`vite-dashboard` / `vd`）

**技术栈：**

- Vite 3
- Vue 3
- Element Plus 2
- EJS 模板引擎

**模板特性：**

- Vue 3 Composition API
- TypeScript 支持
- Vue Router 路由
- Vue I18n 国际化
- RTL 布局支持（postcss-rtlcss）
- Vant 4 移动端 UI

---

## 版本号规范

本项目遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)：

- **MAJOR** (主版本号): 不兼容的 API 变更
- **MINOR** (次版本号): 向后兼容的新功能
- **PATCH** (修订号): 向后兼容的问题修复
