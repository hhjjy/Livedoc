/**
 * LiveDoc Start Command
 *
 * Starts the diagram server in the current directory with zero configuration.
 */

const path = require('path');
const { loadConfig, formatConfigSource } = require('../../config/loader');

/**
 * Register the start command with Commander
 * @param {Command} program - Commander program instance
 */
function register(program) {
  program
    .command('start')
    .description('Start the LiveDoc diagram server')
    .option('-p, --port <port>', 'Port to listen on', parseInt)
    .option('-d, --dir <directory>', 'Base directory to serve files from')
    .option('--kroki <url>', 'Kroki service URL')
    .action(async (options) => {
      await startCommand(options);
    });
}

/**
 * Execute the start command
 * @param {Object} options - Command options
 */
async function startCommand(options = {}) {
  try {
    // Determine base directory
    const baseDir = options.dir
      ? path.resolve(options.dir)
      : process.cwd();

    // Load configuration
    const { config, source } = loadConfig(baseDir);

    // Override with CLI options
    if (options.port) {
      config.port = options.port;
    }
    if (options.kroki) {
      config.krokiUrl = options.kroki;
    }

    // Store base directory in config
    config.baseDir = baseDir;

    // Import and start server
    const { createApp, startServer } = require('../../server/app');
    const app = await createApp(config);

    await startServer(app, config);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down LiveDoc server...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\nShutting down LiveDoc server...');
      process.exit(0);
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  register,
  startCommand
};
