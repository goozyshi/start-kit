/**
 * 工具函数
 */

/**
 * 转换为 kebab-case
 * @example: "HelloWorld" -> "hello-world"
 */
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * 转换为 PascalCase
 * @example: "hello-world" -> "HelloWorld"
 */
function pascalCase(str) {
  return str
    .split(/[-_\/\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

/**
 * 转换为 camelCase
 * @example: "hello-world" -> "helloWorld"
 */
function camelCase(str) {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * 验证页面名称格式
 * @param {string} name - 页面名称
 * @returns {boolean}
 */
function isValidPageName(name) {
  // 支持: 字母、数字、中划线、下划线、斜杠
  return /^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/.test(name);
}

/**
 * 从路径中提取页面名称（最后一级）
 * @example: "2025/11" -> "11"
 */
function getPageNameFromPath(path) {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

/**
 * 转换为适合作为对象 key 的格式（将 - 替换为 _）
 * @example: "honor-wall" -> "honor_wall"
 */
function toKeyCase(str) {
  return str.replace(/-/g, "_");
}

module.exports = {
  kebabCase,
  pascalCase,
  camelCase,
  isValidPageName,
  getPageNameFromPath,
  toKeyCase,
};

