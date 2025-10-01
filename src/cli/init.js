const path = require('path');
const fs = require('fs');
const { addProject, loadConfig } = require('../utils/config');

// livedoc init [projectName]
function initCommand(projectName) {
  try {
    // 如果沒有指定專案名稱，使用當前目錄名稱
    if (!projectName) {
      projectName = path.basename(process.cwd());
    }

    // 取得當前目錄的絕對路徑
    const projectPath = process.cwd();

    // 創建 livedoc 目錄結構
    const livedocDir = path.join(projectPath, 'livedoc');
    const staticDir = path.join(livedocDir, 'static');
    const dynamicDir = path.join(livedocDir, 'dynamic');

    if (!fs.existsSync(livedocDir)) {
      fs.mkdirSync(livedocDir, { recursive: true });
      console.log(`📁 Created: livedoc/`);
    }

    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
      console.log(`📁 Created: livedoc/static/`);
    }

    if (!fs.existsSync(dynamicDir)) {
      fs.mkdirSync(dynamicDir, { recursive: true });
      console.log(`📁 Created: livedoc/dynamic/`);
    }

    // 註冊專案
    addProject(projectName, projectPath);

    console.log(`\n✅ Project '${projectName}' registered successfully`);
    console.log(`📁 Path: ${projectPath}`);
    console.log(`\nYou can now:`);
    console.log(`  1. Place static images in livedoc/static/`);
    console.log(`  2. Place .puml/.mmd files in livedoc/dynamic/`);
    console.log(`  3. Run: livedoc start`);
    console.log(`\nURL format: http://localhost:3000/${projectName}/livedoc/{static|dynamic}/{filename}`);

  } catch (error) {
    console.error(`❌ Failed to register project: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  initCommand
};
