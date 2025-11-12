const { createPage } = require("./generator");
const { detectAndScan } = require("./detector");
const chalk = require("chalk");

/**
 * 注册 API 中间件
 */
function registerAPI(server, config) {
  server.middlewares.use(async (req, res, next) => {
    // API: 获取页面列表（动态数据）
    if (req.url === "/__api/pages" && req.method === "GET") {
      try {
        const scanResult = await detectAndScan(config.projectRoot);

        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            pages: scanResult.pages,
            tree: scanResult.tree,
            catalog: scanResult.pages.map((p) => p.path),
            config: scanResult.config,
          })
        );
      } catch (err) {
        console.error(chalk.red("获取页面列表失败:"), err.message);
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            success: false,
            message: err.message,
          })
        );
      }
      return;
    }

    // API: 重新扫描页面
    if (req.url === "/__api/rescan" && req.method === "GET") {
      try {
        console.log(chalk.cyan("\n🔄 重新扫描页面..."));
        const scanResult = await detectAndScan(config.projectRoot);

        console.log(
          chalk.green(`✅ 扫描完成，找到 ${scanResult.pages.length} 个页面`)
        );

        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            pages: scanResult.pages,
            tree: scanResult.tree,
            catalog: scanResult.pages.map((p) => p.path),
            config: scanResult.config,
          })
        );
      } catch (err) {
        console.error(chalk.red("重新扫描失败:"), err.message);
        console.error(err.stack);
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            success: false,
            message: err.message,
          })
        );
      }
      return;
    }

    // API: 创建页面
    if (req.url === "/__api/create" && req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          // 验证必填参数
          if (!data.pageName) {
            throw new Error("缺少必填参数: pageName");
          }

          if (!data.template) {
            throw new Error("缺少必填参数: template");
          }

          if (!data.languages || data.languages.length === 0) {
            throw new Error("至少选择一种语言");
          }

          // 创建页面
          const result = await createPage(config, {
            pageName: data.pageName,
            template: data.template,
            languages: data.languages,
          });

          // 返回成功响应
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              success: true,
              message: `页面创建成功: ${data.pageName}`,
              ...result,
            })
          );
        } catch (err) {
          console.error(chalk.red("创建页面失败:"), err.message);

          // 返回错误响应
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              success: false,
              message: err.message,
            })
          );
        }
      });

      return;
    }

    // 其他请求继续处理
    next();
  });
}

module.exports = {
  registerAPI,
};
