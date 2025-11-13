#!/usr/bin/env node

// 检查 Node 版本
const checkNodeVersion = require("../lib/check-node-version");
checkNodeVersion();

const chalk = require("chalk");
const startDashboard = require("../lib/index");

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  port: 8080,
  open: true,
  cwd: process.cwd(),
};

// 解析端口
if (args.includes("--port")) {
  const portIndex = args.indexOf("--port");
  options.port = parseInt(args[portIndex + 1]) || 8080;
}

// 解析是否自动打开浏览器
if (args.includes("--no-open")) {
  options.open = false;
}

// 显示帮助信息
if (args.includes("--help") || args.includes("-h")) {
  console.log(
    chalk.cyan(`
╔═══════════════════════════════════════════╗
║         Start Kit                         ║
╚═══════════════════════════════════════════╝

使用方法:
  start-kit [options]

选项:
  --port <port>    指定端口号 (默认: 8080)
  --no-open        不自动打开浏览器
  --help, -h       显示帮助信息
  --version, -v    显示版本号

示例:
  start-kit
  start-kit --port 3000
  start-kit --no-open
`)
  );
  process.exit(0);
}

// 显示版本信息
if (args.includes("--version") || args.includes("-v")) {
  const pkg = require("../package.json");
  console.log(chalk.cyan(`v${pkg.version}`));
  process.exit(0);
}

// 启动仪表盘
console.log(chalk.cyan("🚀 Start Kit Dev Dashboard 启动中...\n"));

startDashboard(options).catch((err) => {
  console.error(chalk.red("\n❌ 启动失败:"), err.message);
  process.exit(1);
});
