/**
 * LiveDoc Port Finder Utility
 *
 * Finds an available port, starting from the preferred port.
 */

const detectPort = require('detect-port');

/**
 * Find an available port
 * @param {number} preferredPort - The port to try first
 * @returns {Promise<{ port: number, wasPreferred: boolean }>}
 */
async function findAvailablePort(preferredPort = 3000) {
  const availablePort = await detectPort(preferredPort);

  return {
    port: availablePort,
    wasPreferred: availablePort === preferredPort
  };
}

module.exports = {
  findAvailablePort
};
