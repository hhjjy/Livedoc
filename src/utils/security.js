/**
 * LiveDoc Security Utilities
 *
 * Path validation and security checks to prevent path traversal attacks.
 */

const path = require('path');

/**
 * Validate that a path is safe and doesn't escape the base directory
 * @param {string} requestedPath - The path requested by the user
 * @param {string} baseDir - The base directory that all files must be within
 * @returns {{ valid: boolean, resolvedPath: string|null, error: string|null }}
 */
function validatePath(requestedPath, baseDir) {
  // Normalize the base directory
  const normalizedBase = path.resolve(baseDir);

  // Reject empty paths
  if (!requestedPath || requestedPath.trim() === '') {
    return {
      valid: false,
      resolvedPath: null,
      error: 'Empty path'
    };
  }

  // Reject paths with null bytes (security issue)
  if (requestedPath.includes('\0')) {
    return {
      valid: false,
      resolvedPath: null,
      error: 'Invalid path: contains null bytes'
    };
  }

  // Reject paths that explicitly contain ..
  if (requestedPath.includes('..')) {
    return {
      valid: false,
      resolvedPath: null,
      error: 'Path traversal detected: ".." not allowed'
    };
  }

  // Reject absolute paths on Unix
  if (requestedPath.startsWith('/')) {
    return {
      valid: false,
      resolvedPath: null,
      error: 'Absolute paths not allowed'
    };
  }

  // Reject Windows absolute paths
  if (/^[A-Za-z]:/.test(requestedPath)) {
    return {
      valid: false,
      resolvedPath: null,
      error: 'Absolute paths not allowed'
    };
  }

  // Resolve the full path
  const resolvedPath = path.resolve(normalizedBase, requestedPath);

  // Ensure the resolved path is within the base directory
  if (!resolvedPath.startsWith(normalizedBase + path.sep) && resolvedPath !== normalizedBase) {
    return {
      valid: false,
      resolvedPath: null,
      error: 'Path traversal detected: path escapes base directory'
    };
  }

  return {
    valid: true,
    resolvedPath: resolvedPath,
    error: null
  };
}

/**
 * Sanitize a filename by removing potentially dangerous characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
  // Remove null bytes
  let sanitized = filename.replace(/\0/g, '');

  // Remove path separators
  sanitized = sanitized.replace(/[/\\]/g, '');

  // Remove other potentially dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');

  return sanitized;
}

/**
 * Check if a file size is within the allowed limit
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateFileSize(size, maxSize) {
  if (size > maxSize) {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    const maxMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File too large: ${sizeMB}MB exceeds limit of ${maxMB}MB`
    };
  }

  return {
    valid: true,
    error: null
  };
}

module.exports = {
  validatePath,
  sanitizeFilename,
  validateFileSize
};
