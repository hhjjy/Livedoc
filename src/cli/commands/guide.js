/**
 * LiveDoc Guide Command
 *
 * Shows comprehensive usage guide for LiveDoc + SpecKit + Claude Code integration.
 */

/**
 * Register the guide command with Commander
 * @param {Command} program - Commander program instance
 */
function register(program) {
  program
    .command('guide')
    .description('Show usage guide for LiveDoc + SpecKit + Claude Code')
    .option('-s, --section <name>', 'Show specific section (basic, speckit, claude)')
    .action((options) => {
      guideCommand(options);
    });
}

/**
 * Execute the guide command
 * @param {Object} options
 */
function guideCommand(options = {}) {
  if (options.section) {
    showSection(options.section);
    return;
  }

  // Show full guide
  showFullGuide();
}

/**
 * Show full usage guide
 */
function showFullGuide() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                         LiveDoc Usage Guide                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

LiveDoc is a zero-configuration diagram server for Markdown documentation.
It renders PlantUML, Mermaid, D2, and 25+ diagram formats via Kroki service.

${getSectionBasic()}

${getSectionSpecKit()}

${getSectionClaude()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For more help:
  livedoc --help              Show all commands
  livedoc guide -s basic      Show only basic usage
  livedoc guide -s speckit    Show only SpecKit integration
  livedoc guide -s claude     Show only Claude Code workflow
  livedoc templates           Show integration templates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

/**
 * Get Basic Usage section content
 */
function getSectionBasic() {
  return `
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. BASIC USAGE                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

  Start the server:
    $ livedoc start              # Default port 3000
    $ livedoc start --port 8080  # Custom port

  Stop the server:
    Press Ctrl+C in the terminal

  URL Format:
    http://localhost:3000/{path/to/diagram}

  Examples:
    http://localhost:3000/diagrams/architecture.puml
    http://localhost:3000/docs/flow.mmd
    http://localhost:3000/images/logo.png

  Supported Formats (25+ types):
    • PlantUML:  .puml, .plantuml, .pu
    • Mermaid:   .mmd, .mermaid
    • D2:        .d2
    • Graphviz:  .dot, .gv
    • ERD:       .erd
    • BPMN:      .bpmn
    • Nomnoml:   .nomnoml
    • And more: blockdiag, seqdiag, actdiag, nwdiag, dbml, vega, wavedrom...

  Static images are passed through:
    .png, .jpg, .jpeg, .gif, .svg, .webp`;
}

/**
 * Get SpecKit Integration section content
 */
function getSectionSpecKit() {
  return `
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. SPECKIT INTEGRATION                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

  SpecKit Directory Structure:
    specs/
    ├── 001-feature-name/
    │   ├── spec.md              # Feature specification
    │   ├── plan.md              # Implementation plan
    │   └── diagrams/            # Feature diagrams
    │       ├── architecture.puml
    │       ├── flow.mmd
    │       └── sequence.d2
    └── 002-another-feature/
        └── ...

  Embedding Diagrams in Markdown:
    ![Architecture](http://localhost:3000/specs/001-feature/diagrams/architecture.puml)
    ![Flow](http://localhost:3000/specs/001-feature/diagrams/flow.mmd)

  Diagram Naming Conventions:
    • architecture.puml   - System architecture (PlantUML component)
    • flow.mmd            - Process flow (Mermaid flowchart)
    • sequence.d2         - API sequence (D2 sequence diagram)
    • data-model.erd      - Database schema (ERD)
    • class.nomnoml       - Class diagram (Nomnoml)

  Best Practices:
    1. One diagram per concept
    2. Use descriptive filenames
    3. Keep diagrams close to their specs
    4. Version diagrams with your code`;
}

/**
 * Get Claude Code Workflow section content
 */
function getSectionClaude() {
  return `
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. CLAUDE CODE WORKFLOW                                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  Diagram-Driven Development with Claude Code:

  Step 1: Start LiveDoc
    $ livedoc start
    # Keep this running in a terminal

  Step 2: Ask Claude to create a diagram
    "Create a PlantUML component diagram for the authentication system
     and save it to specs/001-auth/diagrams/architecture.puml"

  Step 3: Preview immediately
    Open in browser or Markdown preview:
    http://localhost:3000/specs/001-auth/diagrams/architecture.puml

  Step 4: Iterate
    "Add a Redis cache component between the API and database"
    Refresh browser to see changes instantly

  Example Prompts for Claude:

    Architecture:
    "Create a PlantUML component diagram showing microservices
     for our e-commerce system with API Gateway, User Service,
     Product Service, and Order Service."

    Sequence:
    "Create a Mermaid sequence diagram for the user login flow
     including browser, API, auth service, and database."

    Data Model:
    "Create an ERD diagram for the blog system with User, Post,
     Comment, and Tag entities."

    State Machine:
    "Create a D2 state diagram for order lifecycle:
     pending → paid → shipped → delivered → completed"

  Auto-start LiveDoc (Optional):
    Add to your shell profile (.bashrc, .zshrc):

    # Auto-start LiveDoc when entering project directories
    cd() {
      builtin cd "$@"
      if [ -f "package.json" ] && grep -q "@livedoc/cli" package.json; then
        pgrep -f "livedoc start" || livedoc start &
      fi
    }`;
}

/**
 * Show a specific section
 * @param {string} section
 */
function showSection(section) {
  const sections = {
    basic: getSectionBasic,
    speckit: getSectionSpecKit,
    claude: getSectionClaude
  };

  const sectionFn = sections[section.toLowerCase()];
  if (!sectionFn) {
    console.error(`Unknown section: ${section}`);
    console.error('Available sections: basic, speckit, claude');
    process.exit(1);
  }

  console.log(sectionFn());
}

module.exports = {
  register,
  guideCommand,
  getSectionBasic,
  getSectionSpecKit,
  getSectionClaude
};
