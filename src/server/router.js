/**
 * LiveDoc Router
 *
 * Zero-configuration URL routing.
 * URL format: /{path/to/file.ext}
 *
 * Routes requests to appropriate handlers based on file extension.
 */

const path = require('path');
const { handleStaticFile } = require('./handlers/static');
const { handleDiagram } = require('./handlers/diagram');
const { handleError } = require('./handlers/error');
const { isDynamicFormat, isStaticFormat, isSupportedFormat } = require('../config/formats');
const { validatePath } = require('../utils/security');

/**
 * Setup routes for the Express app
 * @param {express.Application} app
 */
function setupRoutes(app) {
  // Main route: handle all paths
  app.get('/*', async (req, res) => {
    const config = app.locals.config;
    const requestPath = req.params[0] || '';

    // Skip favicon requests
    if (requestPath === 'favicon.ico') {
      res.status(404).end();
      return;
    }

    try {
      // Validate path for security
      const validation = validatePath(requestPath, config.baseDir);
      if (!validation.valid) {
        return handleError(res, 'PATH_TRAVERSAL', validation.error);
      }

      const filePath = validation.resolvedPath;
      const ext = path.extname(requestPath).toLowerCase();

      // Check if format is supported
      if (!isSupportedFormat(ext)) {
        return handleError(res, 'UNSUPPORTED_FORMAT', `Unsupported file extension: ${ext}`);
      }

      // Route to appropriate handler
      if (isDynamicFormat(ext)) {
        await handleDiagram(req, res, filePath, ext, config);
      } else if (isStaticFormat(ext)) {
        await handleStaticFile(req, res, filePath, ext);
      }

    } catch (error) {
      // Catch-all error handler
      handleError(res, 'UNKNOWN', error.message);
    }
  });
}

module.exports = {
  setupRoutes
};
