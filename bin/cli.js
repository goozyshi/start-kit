#!/usr/bin/env node

// 检查 Node 版本
const checkNodeVersion = require("../lib/check-node-version");
checkNodeVersion();

const chalk = require("chalk");
const startDashboard = require("../lib/index");

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  port: 6666,
  open: true,
  cwd: process.cwd(),
};

// 解析端口
if (args.includes("--port")) {
  const portIndex = args.indexOf("--port");
  options.port = parseInt(args[portIndex + 1]) || 6666;
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
  --port <port>    指定端口号 (默认: 6666)
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

let server = null;
let isClosing = false;

// 优雅关闭函数
async function gracefulShutdown(signal) {
  if (isClosing) {
    return;
  }
  isClosing = true;

  console.log(chalk.yellow(`\n\n📡 接收到 ${signal} 信号，正在关闭服务器...`));

  if (server) {
    try {
      await server.close();
      console.log(chalk.green("✅ 服务器已优雅关闭，端口已释放"));
      process.exit(0);
    } catch (err) {
      console.error(chalk.red("❌ 关闭服务器时出错:"), err.message);
      process.exit(1);
    }
  } else {
    process.exit(0);
  }
}

// 注册信号处理器
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// 处理未捕获的异常
process.on("uncaughtException", (err) => {
  console.error(chalk.red("\n❌ 未捕获的异常:"), err);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red("\n❌ 未处理的 Promise 拒绝:"), reason);
  gracefulShutdown("unhandledRejection");
});

// 启动服务器
startDashboard(options)
  .then((serverInstance) => {
    server = serverInstance;
  })
  .catch((err) => {
    console.error(chalk.red("\n❌ 启动失败:"), err.message);
    process.exit(1);
  });
