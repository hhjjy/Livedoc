#!/usr/bin/env node

const { Command } = require('commander');
const { initCommand } = require('../src/cli/init');
const { startCommand } = require('../src/cli/start');
const { listCommand } = require('../src/cli/list');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('livedoc')
  .description('LiveDoc - Auto-updating documentation images via HTTP server')
  .version(packageJson.version);

// livedoc init [projectName]
program
  .command('init [projectName]')
  .description('Register current directory as a LiveDoc project')
  .action((projectName) => {
    initCommand(projectName);
  });

// livedoc start
program
  .command('start')
  .description('Start the LiveDoc HTTP server')
  .action(() => {
    startCommand();
  });

// livedoc list
program
  .command('list')
  .description('List all registered projects')
  .action(() => {
    listCommand();
  });

// 解析指令
program.parse(process.argv);

// 如果沒有提供任何指令，顯示幫助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
