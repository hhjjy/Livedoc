/**
 * LiveDoc Templates Command
 *
 * Shows available templates for SpecKit + Claude Code integration.
 */

const path = require('path');
const fs = require('fs');

/**
 * Register the templates command with Commander
 * @param {Command} program - Commander program instance
 */
function register(program) {
  program
    .command('templates')
    .description('Show available integration templates')
    .option('-l, --list', 'List all templates')
    .option('-s, --show <name>', 'Show template content')
    .action((options) => {
      templatesCommand(options);
    });
}

/**
 * Get the templates directory path
 * @returns {string}
 */
function getTemplatesDir() {
  // Templates are in the package's templates directory
  return path.join(__dirname, '..', '..', '..', 'templates');
}

/**
 * Execute the templates command
 * @param {Object} options
 */
function templatesCommand(options = {}) {
  const templatesDir = getTemplatesDir();

  if (options.show) {
    showTemplate(templatesDir, options.show);
    return;
  }

  // Default: list templates
  listTemplates(templatesDir);
}

/**
 * List available templates
 * @param {string} templatesDir
 */
function listTemplates(templatesDir) {
  console.log(`
LiveDoc Templates
=================

Templates for integrating LiveDoc with SpecKit and Claude Code.

Available templates:

  constitution-snippet.md
    Add diagram guidelines to your SpecKit constitution.
    Usage: Add content to .specify/constitution.md

  claude-hook.md
    Auto-start LiveDoc when opening a project.
    Usage: Create .claude/hooks/project-open.sh

Templates location:
  ${templatesDir}

Commands:
  livedoc templates --show <name>    View template content
  livedoc templates --list           List all templates

Example:
  livedoc templates --show constitution-snippet.md
`);
}

/**
 * Show a specific template
 * @param {string} templatesDir
 * @param {string} name
 */
function showTemplate(templatesDir, name) {
  // Add .md extension if not provided
  if (!name.endsWith('.md')) {
    name += '.md';
  }

  const templatePath = path.join(templatesDir, name);

  try {
    const content = fs.readFileSync(templatePath, 'utf-8');
    console.log(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Template not found: ${name}`);
      console.error(`Run 'livedoc templates --list' to see available templates.`);
      process.exit(1);
    }
    throw error;
  }
}

module.exports = {
  register,
  templatesCommand,
  getTemplatesDir
};
