/**
 * LiveDoc CLI Index
 *
 * Central registry for all CLI commands.
 */

const startCommand = require('./commands/start');
const versionCommand = require('./commands/version');
const templatesCommand = require('./commands/templates');
const guideCommand = require('./commands/guide');

/**
 * Register all commands with the Commander program
 * @param {Command} program - Commander program instance
 */
function registerCommands(program) {
  startCommand.register(program);
  versionCommand.register(program);
  templatesCommand.register(program);
  guideCommand.register(program);
}

module.exports = {
  registerCommands,
  commands: {
    start: startCommand,
    version: versionCommand,
    templates: templatesCommand,
    guide: guideCommand
  }
};
