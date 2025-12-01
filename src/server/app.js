/**
 * LiveDoc Express Application Factory
 *
 * Zero-configuration diagram server.
 * Serves diagrams from any directory without project registration.
 */

const express = require('express');
const { setupRoutes } = require('./router');
const { findAvailablePort } = require('../utils/port-finder');
const packageJson = require('../../package.json');

/**
 * Create Express application
 * @param {Object} config - Configuration object
 * @returns {express.Application}
 */
function createApp(config) {
  const app = express();

  // Store config in app for access by handlers
  app.locals.config = config;

  // Setup routes
  setupRoutes(app);

  return app;
}

/**
 * Start the server
 * @param {express.Application} app - Express app
 * @param {Object} config - Configuration object
 * @returns {Promise<http.Server>}
 */
async function startServer(app, config) {
  // Find available port
  const { port, wasPreferred } = await findAvailablePort(config.port);

  if (!wasPreferred) {
    console.log(`Port ${config.port} is in use, trying ${port}...`);
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(port, config.host, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Display startup message
      displayStartupMessage(config, port);
      resolve(server);
    });

    server.on('error', reject);
  });
}

/**
 * Display startup message
 * @param {Object} config - Configuration object
 * @param {number} port - Actual port number
 */
function displayStartupMessage(config, port) {
  const baseUrl = `http://${config.host}:${port}`;

  console.log(`
LiveDoc v${packageJson.version} started

  URL:    ${baseUrl}
  Root:   ${config.baseDir}
  Kroki:  ${config.krokiUrl}

Usage in Markdown:
  ![Diagram](${baseUrl}/path/to/diagram.puml)
  ![Image](${baseUrl}/images/logo.png)

Press Ctrl+C to stop
`);
}

module.exports = {
  createApp,
  startServer,
  displayStartupMessage
};
