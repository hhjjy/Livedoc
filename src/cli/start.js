const { startServer } = require('../server/app');
const { loadConfig } = require('../utils/config');

// livedoc start
async function startCommand() {
  try {
    const config = loadConfig();

    // 檢查是否有註冊的專案
    if (Object.keys(config.projects).length === 0) {
      console.log('⚠️  No projects registered yet.');
      console.log('Run "livedoc init" in your project directory to register a project.');
      process.exit(1);
    }

    // 啟動伺服器
    await startServer();

    // 保持伺服器運行
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down LiveDoc server...');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  startCommand
};
