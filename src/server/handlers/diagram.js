/**
 * LiveDoc Diagram Handler
 *
 * Renders diagrams via Kroki service.
 * Returns SVG images for all diagram types.
 */

const fs = require('fs').promises;
const { getDiagramType } = require('../../config/formats');
const { createClient, KrokiError } = require('../../utils/kroki');
const { handleError } = require('./error');
const { validateFileSize } = require('../../utils/security');
const defaults = require('../../config/defaults');

/**
 * Handle diagram rendering request
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} filePath - Absolute path to diagram source file
 * @param {string} ext - File extension
 * @param {Object} config - Configuration object
 */
async function handleDiagram(req, res, filePath, ext, config) {
  try {
    // Check if file exists
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return handleError(res, 'FILE_NOT_FOUND', filePath);
      }
      throw error;
    }

    // Check file size
    const sizeValidation = validateFileSize(stat.size, defaults.maxFileSize);
    if (!sizeValidation.valid) {
      return handleError(res, 'FILE_TOO_LARGE', sizeValidation.error, {
        size: stat.size,
        maxSize: defaults.maxFileSize
      });
    }

    // Read diagram source
    const source = await fs.readFile(filePath, 'utf-8');

    // Get Kroki diagram type
    const diagramType = getDiagramType(ext);
    if (!diagramType) {
      return handleError(res, 'UNSUPPORTED_FORMAT', `Unknown diagram type for extension: ${ext}`);
    }

    // Create Kroki client and render
    const kroki = createClient(config);
    const result = await kroki.render(diagramType, source);

    // Set headers
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('X-LiveDoc-Status', 'success');

    // Send rendered diagram
    res.status(200).send(result.buffer);

  } catch (error) {
    // Handle Kroki-specific errors
    if (error instanceof KrokiError) {
      switch (error.type) {
        case 'SYNTAX_ERROR':
          return handleError(res, 'SYNTAX_ERROR', error.details || error.message);
        case 'CONNECTION_ERROR':
        case 'TIMEOUT':
        case 'SERVER_ERROR':
          return handleError(res, 'KROKI_ERROR', error.message);
        default:
          return handleError(res, 'KROKI_ERROR', error.message);
      }
    }

    handleError(res, 'UNKNOWN', error.message);
  }
}

module.exports = {
  handleDiagram
};
