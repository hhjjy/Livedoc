/**
 * LiveDoc Error Handler
 *
 * Returns error images (SVG) instead of HTTP error codes.
 * This ensures Markdown renderers always display an image, never a broken icon.
 */

const {
  fileNotFoundError,
  unsupportedFormatError,
  krokiError,
  syntaxError,
  fileTooLargeError,
  pathTraversalError,
  generateErrorImage
} = require('../../utils/error-image');

/**
 * Handle error by returning an SVG error image
 * @param {express.Response} res
 * @param {string} type - Error type
 * @param {string} message - Error message or file path
 * @param {Object} [extra] - Extra data for specific error types
 */
function handleError(res, type, message, extra = {}) {
  let svg;

  switch (type) {
    case 'FILE_NOT_FOUND':
      svg = fileNotFoundError(message);
      break;

    case 'UNSUPPORTED_FORMAT':
      svg = unsupportedFormatError(message);
      break;

    case 'KROKI_ERROR':
      svg = krokiError(message);
      break;

    case 'SYNTAX_ERROR':
      svg = syntaxError(message);
      break;

    case 'FILE_TOO_LARGE':
      svg = fileTooLargeError(extra.size, extra.maxSize);
      break;

    case 'PATH_TRAVERSAL':
      svg = pathTraversalError();
      break;

    default:
      svg = generateErrorImage('UNKNOWN', message);
  }

  // Always return HTTP 200 with SVG image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('X-LiveDoc-Status', 'error');
  res.setHeader('X-LiveDoc-Error', type);
  res.status(200).send(svg);
}

module.exports = {
  handleError
};
