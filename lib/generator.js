const fse = require("fs-extra");
const path = require("path");
const ejs = require("ejs");
const chalk = require("chalk");
const { getTemplate } = require("./templates-config");
const {
  kebabCase,
  pascalCase,
  isValidPageName,
  getPageNameFromPath,
} = require("./utils");

/**
 * 创建新页面
 * @param {Object} config - 项目配置
 * @param {Object} options - 创建选项
 * @param {string} options.pageName - 页面名称，支持多级目录 (如: "2025" 或 "2025/11")
 * @param {string} options.template - 模板ID (如: "soulstar")
 * @param {string[]} options.languages - 语言列表 (如: ["en", "ar", "tr"])
 */
async function createPage(config, options) {
  const { pageName, template = "soulstar", languages = ["en", "ar", "tr"] } = options;

  // 1. 验证页面名称
  if (!isValidPageName(pageName)) {
    throw new Error(
      "页面名称格式不正确，仅支持字母、数字、中划线、下划线和斜杠"
    );
  }

  console.log(chalk.cyan(`\n🎨 正在创建页面: ${pageName}`));
  console.log(chalk.gray(`   模板: ${template}`));
  console.log(chalk.gray(`   语言: ${languages.join(", ")}`));

  // 2. 解析多级目录路径
  const targetDir = path.join(config.projectRoot, config.pageDir, pageName);

  if (fse.existsSync(targetDir)) {
    throw new Error(`页面已存在: ${pageName}`);
  }

  // 3. 加载模板配置
  const templateConfig = getTemplate(template);
  const templateDir = path.join(__dirname, `../template/${template}`);

  if (!fse.existsSync(templateDir)) {
    throw new Error(`模板不存在: ${template}`);
  }

  // 4. 创建目标目录
  await fse.ensureDir(targetDir);
  console.log(chalk.gray(`   • 创建目录: ${targetDir}`));

  // 5. 准备模板变量
  const finalPageName = getPageNameFromPath(pageName);
  const kebabPageName = kebabCase(finalPageName);
  const templateData = {
    pageName: kebabPageName,
    PageName: pascalCase(finalPageName),
    selectedLanguages: languages,
    projectName: "Start Kit",
  };

  console.log(chalk.gray(`   • 页面名称: ${templateData.pageName}`));
  console.log(chalk.gray(`   • 组件名称: ${templateData.PageName}`));

  // 6. 生成文件
  await generateFiles(templateDir, targetDir, templateData);

  console.log(chalk.green(`\n✅ 页面创建成功！`));
  console.log(chalk.gray(`   路径: ${targetDir}`));

  return {
    path: targetDir,
    relativePath: `${config.pageDir}/${pageName}`,
  };
}

/**
 * 递归生成文件和目录
 */
async function generateFiles(templateDir, targetDir, templateData) {
  const items = await fse.readdir(templateDir);

  for (const item of items) {
    // 跳过配置文件
    if (item === "template.config.js") {
      continue;
    }

    const templatePath = path.join(templateDir, item);
    const stat = await fse.stat(templatePath);

    if (stat.isDirectory()) {
      // 递归处理子目录
      const subTargetDir = path.join(targetDir, item);
      await fse.ensureDir(subTargetDir);
      await generateFiles(templatePath, subTargetDir, templateData);
    } else if (item.endsWith(".ejs")) {
      // 处理 EJS 模板
      await processEjsFile(templatePath, targetDir, templateData);
    } else {
      // 直接复制非 EJS 文件
      const targetPath = path.join(targetDir, item);
      await fse.copy(templatePath, targetPath);
      console.log(chalk.gray(`   • 复制: ${item}`));
    }
  }
}

/**
 * 处理 EJS 模板文件
 */
async function processEjsFile(ejsPath, targetDir, templateData) {
  const fileName = path.basename(ejsPath, ".ejs");

  // 处理文件名中的模板变量 (如: <%= PageName %>.vue.ejs)
  let actualFileName = fileName;
  if (fileName.includes("<%=")) {
    actualFileName = ejs.render(fileName, templateData);
  }

  const targetPath = path.join(targetDir, actualFileName);

  // 读取并渲染模板内容
  const templateContent = await fse.readFile(ejsPath, "utf-8");
  const renderedContent = ejs.render(templateContent, templateData);

  // 写入文件
  await fse.writeFile(targetPath, renderedContent, "utf-8");
  console.log(chalk.gray(`   • 生成: ${actualFileName}`));
}

module.exports = {
  createPage,
};

