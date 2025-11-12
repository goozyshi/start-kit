/**
 * 检查 Node 版本是否满足要求
 */
const chalk = require("chalk");
const pkg = require("../package.json");

function checkNodeVersion() {
  const currentVersion = process.version;
  const requiredVersion = pkg.engines.node;

  // 解析版本号
  const current = parseVersion(currentVersion);
  const required = parseVersion(requiredVersion.replace(">=", ""));

  if (!isVersionValid(current, required)) {
    console.error(chalk.red("❌ Node 版本不满足要求！"));
    console.error(chalk.yellow(`   当前版本: ${currentVersion}`));
    console.error(chalk.yellow(`   要求版本: ${requiredVersion}`));
    console.error(chalk.gray("\n请升级 Node.js 到 14.18.0 或更高版本"));
    console.error(chalk.gray("下载地址: https://nodejs.org/\n"));
    process.exit(1);
  }
}

function parseVersion(version) {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return { major: 0, minor: 0, patch: 0 };
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
  };
}

function isVersionValid(current, required) {
  if (current.major > required.major) return true;
  if (current.major < required.major) return false;

  if (current.minor > required.minor) return true;
  if (current.minor < required.minor) return false;

  return current.patch >= required.patch;
}

module.exports = checkNodeVersion;
