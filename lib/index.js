const { createServer } = require("vite");
const vue = require("@vitejs/plugin-vue");
const path = require("path");
const { detectAndScan, getLocalIP } = require("./detector");
const { registerAPI } = require("./server");
const chalk = require("chalk");

/**
 * 启动开发仪表盘
 */
async function startDashboard(options = {}) {
  try {
    // 1. 检测项目并扫描页面
    const { config, pages, tree } = await detectAndScan(options.cwd);

    console.log(chalk.green(`\n✅ 项目检测完成`));

    // 2. 创建 API 插件
    const apiPlugin = {
      name: "vite-dashboard-api",
      configureServer(server) {
        registerAPI(server, config);
      },
    };

    // 3. 创建 Vite 服务器
    const server = await createServer({
      root: path.resolve(__dirname, "../ui"),
      plugins: [vue(), apiPlugin],
      server: {
        port: options.port || 8080,
        host: true,
        open: options.open !== false,
      },
      define: {
        // 注入数据到前端
        __PAGE_TREE__: JSON.stringify(tree),
        __PAGE_LIST__: JSON.stringify(pages),
        __CONFIG__: JSON.stringify(config),
        __VITE_HTML_CATALOG__: JSON.stringify(pages.map((p) => p.path)),
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../ui"),
        },
      },
    });

    // 4. 启动服务器
    await server.listen();

    const port = server.config.server.port;
    const localIP = getLocalIP();

    console.log(chalk.cyan("\n╔═══════════════════════════════════════════╗"));
    console.log(chalk.cyan("║  🎉 Start Kit Dev Dashboard 已启动！      ║"));
    console.log(chalk.cyan("╚═══════════════════════════════════════════╝\n"));
    console.log(chalk.green(`📍 本地访问: http://localhost:${port}`));
    console.log(chalk.green(`📍 网络访问: http://${localIP}:${port}`));
    console.log(
      chalk.gray(
        `\n💡 提示: 在仪表盘中点击页面即可访问，点击"创建新页面"可生成新页面\n`
      )
    );

    return server;
  } catch (err) {
    console.error(chalk.red("\n❌ 启动失败:"), err.message);
    throw err;
  }
}

module.exports = startDashboard;
