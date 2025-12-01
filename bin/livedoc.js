#!/usr/bin/env node

/**
 * LiveDoc CLI Entry Point
 *
 * Zero-configuration diagram server for Markdown documentation.
 * Renders PlantUML, Mermaid, D2, and 25+ diagram formats via Kroki.
 */

const { program } = require('commander');
const packageJson = require('../package.json');

// Configure the main program
program
  .name('livedoc')
  .description('Dynamic diagram server for Markdown documentation')
  .version(packageJson.version, '-v, --version', 'Display version number');

// Register commands
require('../src/cli/commands/start').register(program);
require('../src/cli/commands/version').register(program);
require('../src/cli/commands/templates').register(program);
require('../src/cli/commands/guide').register(program);

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
