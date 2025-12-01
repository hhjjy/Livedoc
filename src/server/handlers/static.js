/**
 * LiveDoc Static File Handler
 *
 * Serves static image files (PNG, JPG, GIF, SVG, WebP).
 */

const fs = require('fs').promises;
const { getStaticMimeType } = require('../../config/formats');
const { handleError } = require('./error');
const { validateFileSize } = require('../../utils/security');
const defaults = require('../../config/defaults');

/**
 * Handle static file request
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} filePath - Absolute path to file
 * @param {string} ext - File extension
 */
async function handleStaticFile(req, res, filePath, ext) {
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

    // Read file
    const buffer = await fs.readFile(filePath);

    // Get MIME type
    const mimeType = getStaticMimeType(ext);

    // Set headers
    res.setHeader('Content-Type', mimeType);
    res.setHeader('X-LiveDoc-Status', 'success');

    // Send file
    res.status(200).send(buffer);

  } catch (error) {
    handleError(res, 'UNKNOWN', error.message);
  }
}

module.exports = {
  handleStaticFile
};
