const express = require('express');
const { setupRoutes } = require('./router');
const { loadConfig } = require('../utils/config');
const { info } = require('../utils/logger');

// 建立並啟動伺服器
function startServer() {
  const config = loadConfig();
  const app = express();
  const port = config.port || 3000;

  // 設定路由
  setupRoutes(app);

  // 啟動伺服器
  return new Promise((resolve, reject) => {
    const server = app.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        info('server', `LiveDoc server started on http://localhost:${port}`);
        console.log(`✅ LiveDoc server running on http://localhost:${port}`);
        console.log(`📁 Registered projects: ${Object.keys(config.projects).length}`);
        console.log(`🔧 Kroki service: ${config.krokiUrl}`);
        console.log(`\nURL format: http://localhost:${port}/{project}/livedoc/{static|dynamic}/{filename}\n`);
        resolve(server);
      }
    });
  });
}

module.exports = {
  startServer
};
