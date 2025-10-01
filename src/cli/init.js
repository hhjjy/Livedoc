const path = require('path');
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

    // 註冊專案
    addProject(projectName, projectPath);

    console.log(`✅ Project '${projectName}' registered successfully`);
    console.log(`📁 Path: ${projectPath}`);
    console.log(`\nYou can now start the server with: livedoc start`);
    console.log(`URL format: http://localhost:3000/${projectName}/livedoc/{static|dynamic}/{filename}`);

  } catch (error) {
    console.error(`❌ Failed to register project: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  initCommand
};
