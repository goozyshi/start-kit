const fse = require("fs-extra");
const glob = require("glob");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

/**
 * 检测项目并扫描页面（一体化）
 */
async function detectAndScan(cwd = process.cwd()) {
  console.log(chalk.cyan("🔍 正在检测项目结构...\n"));

  // 1. 查找页面目录
  const pageDir = findPageDir(cwd);
  if (!pageDir) {
    throw new Error(
      "❌ 未找到页面目录！\n\n" +
        "请确保项目中存在以下目录之一:\n" +
        "  • src/page\n" +
        "  • src/pages\n" +
        "  • src/views\n" +
        "  • pages\n\n" +
        "或在项目根目录创建 vite-dashboard.config.js 文件并指定 pageDir"
    );
  }
  console.log(chalk.green(`✅ 找到页面目录: ${pageDir}`));

  // 2. 检测项目信息
  const projectInfo = detectProjectInfo(cwd);
  if (projectInfo.hasVue) {
    console.log(chalk.green(`✅ 检测到 Vue ${projectInfo.vueVersion}`));
  }
  if (projectInfo.hasVite) {
    console.log(chalk.green(`✅ 检测到 Vite ${projectInfo.viteVersion}`));
  }

  // 3. 扫描页面
  console.log(chalk.cyan("\n📂 正在扫描页面..."));
  const pages = await scanPages(cwd, pageDir);

  // 4. 构建目录树
  const tree = buildTree(pages);

  return {
    config: {
      projectRoot: cwd,
      pageDir,
      ...projectInfo,
    },
    pages,
    tree,
  };
}

/**
 * 查找页面目录
 */
function findPageDir(cwd) {
  const dirs = ["src/page", "src/pages", "src/views", "pages", "views"];

  for (const dir of dirs) {
    const fullPath = path.join(cwd, dir);
    if (fse.existsSync(fullPath) && fse.statSync(fullPath).isDirectory()) {
      return dir;
    }
  }

  // 尝试读取配置文件
  const configPath = path.join(cwd, "vite-dashboard.config.js");
  if (fse.existsSync(configPath)) {
    try {
      delete require.cache[require.resolve(configPath)];
      const config = require(configPath);
      if (config.pageDir && fse.existsSync(path.join(cwd, config.pageDir))) {
        return config.pageDir;
      }
    } catch (err) {
      console.warn(chalk.yellow("⚠️  配置文件加载失败:"), err.message);
    }
  }

  return null;
}

/**
 * 检测项目信息
 */
function detectProjectInfo(cwd) {
  const info = {
    hasVue: false,
    hasVite: false,
    vueVersion: "",
    viteVersion: "",
  };

  const pkgPath = path.join(cwd, "package.json");
  if (fse.existsSync(pkgPath)) {
    try {
      const pkg = fse.readJsonSync(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.vue) {
        info.hasVue = true;
        info.vueVersion = deps.vue;
      }
      if (deps.vite) {
        info.hasVite = true;
        info.viteVersion = deps.vite;
      }
    } catch (err) {
      console.warn(chalk.yellow("⚠️  package.json 读取失败"));
    }
  }

  return info;
}

/**
 * 扫描页面
 */
function scanPages(cwd, pageDir) {
  return new Promise((resolve, reject) => {
    const pattern = path.join(pageDir, "**", "index.html");

    glob(
      pattern,
      {
        cwd,
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      },
      (err, files) => {
        if (err) {
          reject(new Error(`页面扫描失败: ${err.message}`));
          return;
        }

        const pages = files.map((file) => {
          const rel = file.replace(pageDir + "/", "");
          const parts = rel.split("/");

          return {
            path: file,
            category: parts[0] || "",
            name: parts[1] || "",
            file: parts[2] || "index.html",
            url: `/${file.replace("index.html", "")}`,
          };
        });

        console.log(chalk.green(`✅ 扫描到 ${pages.length} 个页面`));

        // 显示前几个页面
        if (pages.length > 0) {
          const preview = pages.slice(0, 5);
          preview.forEach((page) => {
            console.log(chalk.gray(`   • ${page.category}/${page.name}`));
          });
          if (pages.length > 5) {
            console.log(chalk.gray(`   ... 还有 ${pages.length - 5} 个页面`));
          }
        }

        resolve(pages);
      }
    );
  });
}

/**
 * 构建目录树
 */
function buildTree(pages) {
  const tree = { page: {} };

  pages.forEach((p) => {
    if (!tree.page[p.category]) {
      tree.page[p.category] = [];
    }
    if (!tree.page[p.category].includes(p.name)) {
      tree.page[p.category].push(p.name);
    }
  });

  return tree;
}

/**
 * 获取本地 IP 地址
 */
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

module.exports = {
  detectAndScan,
  getLocalIP,
};
