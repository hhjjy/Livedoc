/**
 * LiveDoc Version Command
 *
 * Displays version information for LiveDoc CLI.
 */

const packageJson = require('../../../package.json');

/**
 * Register the version command with Commander
 * @param {Command} program - Commander program instance
 */
function register(program) {
  // Version is already handled by commander's built-in version option
  // This module provides additional version-related utilities if needed
}

/**
 * Get version string
 * @returns {string}
 */
function getVersion() {
  return packageJson.version;
}

/**
 * Get full version info including name
 * @returns {string}
 */
function getFullVersion() {
  return `${packageJson.name} v${packageJson.version}`;
}

module.exports = {
  register,
  getVersion,
  getFullVersion
};
