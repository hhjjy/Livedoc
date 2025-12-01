/**
 * LiveDoc Configuration Loader
 *
 * Priority: Environment Variables > Config Files > Defaults
 *
 * Environment variables:
 *   LIVEDOC_PORT - Server port
 *   LIVEDOC_HOST - Server host
 *   LIVEDOC_KROKI_URL - Kroki service URL
 *   LIVEDOC_KROKI_TIMEOUT - Kroki request timeout (ms)
 *   LIVEDOC_MAX_FILE_SIZE - Maximum file size (bytes)
 *
 * Config files (searched in order):
 *   .livedocrc (JSON)
 *   livedoc.config.json
 */

const fs = require('fs');
const path = require('path');
const defaults = require('./defaults');

// Config file names to search for
const CONFIG_FILES = [
  '.livedocrc',
  'livedoc.config.json'
];

/**
 * Parse a config file
 * @param {string} filePath - Path to config file
 * @returns {Object|null} - Parsed config or null if not found/invalid
 */
function parseConfigFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // Silently ignore invalid config files
    return null;
  }
}

/**
 * Find and load config file from a directory
 * @param {string} dir - Directory to search in
 * @returns {Object|null} - Parsed config or null
 */
function findConfigFile(dir) {
  for (const filename of CONFIG_FILES) {
    const filePath = path.join(dir, filename);
    const config = parseConfigFile(filePath);
    if (config) {
      return { config, filePath };
    }
  }
  return null;
}

/**
 * Load configuration from environment variables
 * @returns {Object} - Config from environment (only set values)
 */
function loadFromEnv() {
  const env = {};

  if (process.env.LIVEDOC_PORT) {
    const port = parseInt(process.env.LIVEDOC_PORT, 10);
    if (!isNaN(port) && port > 0 && port < 65536) {
      env.port = port;
    }
  }

  if (process.env.LIVEDOC_HOST) {
    env.host = process.env.LIVEDOC_HOST;
  }

  if (process.env.LIVEDOC_KROKI_URL) {
    env.krokiUrl = process.env.LIVEDOC_KROKI_URL;
  }

  if (process.env.LIVEDOC_KROKI_TIMEOUT) {
    const timeout = parseInt(process.env.LIVEDOC_KROKI_TIMEOUT, 10);
    if (!isNaN(timeout) && timeout > 0) {
      env.krokiTimeout = timeout;
    }
  }

  if (process.env.LIVEDOC_MAX_FILE_SIZE) {
    const size = parseInt(process.env.LIVEDOC_MAX_FILE_SIZE, 10);
    if (!isNaN(size) && size > 0) {
      env.maxFileSize = size;
    }
  }

  return env;
}

/**
 * Load complete configuration
 * @param {string} [baseDir] - Base directory to search for config files (defaults to cwd)
 * @returns {{ config: Object, source: { env: string[], file: string|null } }}
 */
function loadConfig(baseDir = process.cwd()) {
  // Start with defaults
  const config = { ...defaults };
  const source = {
    env: [],
    file: null
  };

  // Layer 1: Config file
  const fileResult = findConfigFile(baseDir);
  if (fileResult) {
    Object.assign(config, fileResult.config);
    source.file = fileResult.filePath;
  }

  // Layer 2: Environment variables (highest priority)
  const envConfig = loadFromEnv();
  const envKeys = Object.keys(envConfig);
  if (envKeys.length > 0) {
    Object.assign(config, envConfig);
    source.env = envKeys;
  }

  return { config, source };
}

/**
 * Get a formatted string showing config sources
 * @param {{ env: string[], file: string|null }} source - Source info from loadConfig
 * @returns {string} - Human-readable source description
 */
function formatConfigSource(source) {
  const parts = [];

  if (source.env.length > 0) {
    parts.push(`env: ${source.env.join(', ')}`);
  }

  if (source.file) {
    parts.push(`file: ${source.file}`);
  }

  if (parts.length === 0) {
    return 'defaults';
  }

  return parts.join(' + ');
}

module.exports = {
  loadConfig,
  loadFromEnv,
  findConfigFile,
  formatConfigSource,
  CONFIG_FILES
};
