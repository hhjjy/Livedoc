/**
 * LiveDoc Error Image Generator
 *
 * Generates SVG error images for display in Markdown renderers.
 * All errors return HTTP 200 with an image to avoid broken image icons.
 */

const defaults = require('../config/defaults');

/**
 * Error types with their display titles
 */
const ErrorTypes = {
  FILE_NOT_FOUND: 'File Not Found',
  UNSUPPORTED_FORMAT: 'Unsupported Format',
  KROKI_ERROR: 'Kroki Service Error',
  SYNTAX_ERROR: 'Diagram Syntax Error',
  FILE_TOO_LARGE: 'File Too Large',
  PATH_TRAVERSAL: 'Invalid Path',
  UNKNOWN: 'Error'
};

/**
 * Escape special XML characters for safe SVG text content
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Break a long word (without spaces) into chunks of maxChars
 * @param {string} word - Word to break
 * @param {number} maxChars - Maximum characters per chunk
 * @returns {string[]} - Array of chunks
 */
function breakLongWord(word, maxChars) {
  const chunks = [];
  let remaining = word;

  while (remaining.length > maxChars) {
    // Try to break at natural breakpoints: /, -, _, .
    let breakPoint = -1;
    const breakChars = ['/', '-', '_', '.'];

    // Look for a breakpoint within the allowed range
    for (let i = maxChars - 1; i >= Math.floor(maxChars / 2); i--) {
      if (breakChars.includes(remaining[i])) {
        breakPoint = i + 1; // Include the break character
        break;
      }
    }

    // If no natural breakpoint, force break at maxChars
    if (breakPoint === -1) {
      breakPoint = maxChars;
    }

    chunks.push(remaining.slice(0, breakPoint));
    remaining = remaining.slice(breakPoint);
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

/**
 * Wrap text to fit within a given width (approximate character count)
 * Handles both word wrapping and breaking long words without spaces
 * @param {string} text - Text to wrap
 * @param {number} maxChars - Maximum characters per line
 * @returns {string[]} - Array of lines
 */
function wrapText(text, maxChars = 60) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    // Handle long words (longer than maxChars)
    if (word.length > maxChars) {
      // First, push any existing line
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      // Break the long word into chunks
      const chunks = breakLongWord(word, maxChars);
      // Add all chunks except the last as separate lines
      for (let i = 0; i < chunks.length - 1; i++) {
        lines.push(chunks[i]);
      }
      // The last chunk becomes the current line (may combine with next word)
      currentLine = chunks[chunks.length - 1];
    } else if (currentLine.length + word.length + 1 <= maxChars) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generate an SVG error image
 * @param {string} type - Error type from ErrorTypes
 * @param {string} message - Error message to display
 * @param {Object} options - Override default styling options
 * @returns {string} - SVG image content
 */
function generateErrorImage(type, message, options = {}) {
  const config = { ...defaults.errorImage, ...options };
  const title = ErrorTypes[type] || ErrorTypes.UNKNOWN;

  // Wrap the message text
  const messageLines = wrapText(message, 55);
  const lineHeight = config.fontSize * 1.4;

  // Calculate dynamic height based on message length
  const titleHeight = config.titleFontSize * 1.5;
  const messageHeight = messageLines.length * lineHeight;
  const totalHeight = Math.max(
    config.height,
    config.padding * 2 + titleHeight + messageHeight + 20
  );

  // Generate message text elements
  const messageY = config.padding + titleHeight + 30;
  const messageElements = messageLines
    .map((line, index) => {
      const y = messageY + index * lineHeight;
      return `    <text x="${config.padding}" y="${y}" fill="${config.textColor}" font-size="${config.fontSize}" font-family="monospace">${escapeXml(line)}</text>`;
    })
    .join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${totalHeight}" viewBox="0 0 ${config.width} ${totalHeight}">
  <rect width="100%" height="100%" fill="${config.backgroundColor}" rx="8" ry="8"/>
  <rect x="0" y="0" width="8" height="100%" fill="${config.titleColor}"/>

  <!-- Error Icon -->
  <circle cx="${config.padding + 15}" cy="${config.padding + 15}" r="12" fill="${config.titleColor}"/>
  <text x="${config.padding + 15}" y="${config.padding + 20}" fill="white" font-size="16" font-weight="bold" text-anchor="middle">!</text>

  <!-- Title -->
  <text x="${config.padding + 40}" y="${config.padding + 20}" fill="${config.titleColor}" font-size="${config.titleFontSize}" font-weight="bold" font-family="sans-serif">${escapeXml(title)}</text>

  <!-- Message -->
${messageElements}
</svg>`;

  return svg;
}

/**
 * Convenience functions for specific error types
 */

function fileNotFoundError(filePath) {
  return generateErrorImage(
    'FILE_NOT_FOUND',
    `The file "${filePath}" does not exist or cannot be accessed.`
  );
}

function unsupportedFormatError(extension) {
  return generateErrorImage(
    'UNSUPPORTED_FORMAT',
    `The file extension "${extension}" is not supported. Supported formats include .puml, .mmd, .d2, .png, .jpg, .svg, and more.`
  );
}

function krokiError(details) {
  return generateErrorImage(
    'KROKI_ERROR',
    `Failed to render diagram via Kroki service. ${details || 'Please check your network connection and Kroki URL configuration.'}`
  );
}

function syntaxError(details) {
  return generateErrorImage(
    'SYNTAX_ERROR',
    `Diagram contains syntax errors. ${details || 'Please check your diagram source code.'}`
  );
}

function fileTooLargeError(size, maxSize) {
  const sizeMB = (size / (1024 * 1024)).toFixed(2);
  const maxMB = (maxSize / (1024 * 1024)).toFixed(2);
  return generateErrorImage(
    'FILE_TOO_LARGE',
    `File size (${sizeMB}MB) exceeds the maximum allowed size of ${maxMB}MB.`
  );
}

function pathTraversalError() {
  return generateErrorImage(
    'PATH_TRAVERSAL',
    `Invalid path. Path traversal attempts (using "..") are not allowed for security reasons.`
  );
}

module.exports = {
  ErrorTypes,
  generateErrorImage,
  fileNotFoundError,
  unsupportedFormatError,
  krokiError,
  syntaxError,
  fileTooLargeError,
  pathTraversalError
};
