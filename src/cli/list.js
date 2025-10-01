const { listProjects } = require('../utils/config');

// livedoc list
function listCommand() {
  try {
    const projects = listProjects();

    if (projects.length === 0) {
      console.log('📋 No projects registered yet.');
      console.log('Run "livedoc init" in your project directory to register a project.');
      return;
    }

    console.log(`📋 Registered projects (${projects.length}):\n`);
    projects.forEach(({ name, path }) => {
      console.log(`  • ${name}`);
      console.log(`    ${path}\n`);
    });

  } catch (error) {
    console.error(`❌ Failed to list projects: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  listCommand
};
