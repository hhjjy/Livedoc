const { getProjectPath } = require('../utils/config');
const { handleStaticImage } = require('./handlers/static');
const { handleDynamicDiagram } = require('./handlers/dynamic');
const { handleError } = require('../utils/error-handler');
const { error: logError } = require('../utils/logger');

// URL 格式: /{project}/livedoc/{static|dynamic}/{filename}
function setupRoutes(app) {
  app.get('/:project/livedoc/:type/:filename', async (req, res) => {
    const { project, type, filename } = req.params;

    try {
      // 取得專案路徑
      const projectPath = getProjectPath(project);
      if (!projectPath) {
        throw new Error(`Project '${project}' not registered`);
      }

      // 根據 type 分發到對應的 handler
      if (type === 'static') {
        await handleStaticImage(req, res, projectPath, filename);
      } else if (type === 'dynamic') {
        await handleDynamicDiagram(req, res, projectPath, filename);
      } else {
        throw new Error(`Invalid type: ${type} (must be 'static' or 'dynamic')`);
      }

    } catch (err) {
      // 記錄錯誤
      logError(`${project}/${type}/${filename}`, err.message);

      // 返回錯誤圖片
      const errorImage = handleError(err, filename);
      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(errorImage);
    }
  });

  // 404 處理
  app.use((req, res) => {
    logError(req.path, '404 Not Found');
    const errorImage = handleError(
      { message: `Invalid URL format. Expected: /{project}/livedoc/{static|dynamic}/{filename}` },
      req.path
    );
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(errorImage);
  });
}

module.exports = {
  setupRoutes
};
