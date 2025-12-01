# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LiveDoc v2.0** is a zero-configuration diagram server for Markdown documentation. It renders PlantUML, Mermaid, D2, and 25+ diagram formats via Kroki service, making diagrams always up-to-date in Markdown previews.

**Current Version: v2.0.0**

## Architecture

```
Markdown Editor → GET /{path} → Express Server → Router
                                                    ↓
                                 (Route by file extension)
                                    ┌───────────┴───────────┐
                                    ↓                       ↓
                            Static Handler          Diagram Handler
                           (PNG/JPG/GIF/SVG)       (25+ diagram types)
                                    ↓                       ↓
                            Return as-is         Render via Kroki
                                    ↓                       ↓
                                    └─────────→ Response ←──┘
                                                    ↓
                                          (Error? → SVG error image)
```

### Key Components

- **Router** (`src/server/router.js`): Routes requests based on file extension
- **Static Handler** (`src/server/handlers/static.js`): Serves static images
- **Diagram Handler** (`src/server/handlers/diagram.js`): Renders via Kroki
- **Error Handler** (`src/server/handlers/error.js`): Returns SVG error images
- **Config Loader** (`src/config/loader.js`): Env > File > Defaults priority
- **Kroki Client** (`src/utils/kroki.js`): HTTP client for Kroki API

### Core Principle

**Always return an image, even on error**. Markdown editors only recognize "HTTP 200 + image/*". Error information is visualized in SVG error images.

## Project Structure

```
livedoc/
├── bin/
│   └── livedoc.js          # CLI entry point
├── src/
│   ├── cli/
│   │   ├── commands/       # CLI commands (start, templates)
│   │   └── index.js        # Command registration
│   ├── config/
│   │   ├── defaults.js     # Default configuration
│   │   ├── formats.js      # Format mapping (25+ types)
│   │   └── loader.js       # Config loader (env > file > default)
│   ├── server/
│   │   ├── app.js          # Express app factory
│   │   ├── router.js       # URL routing
│   │   └── handlers/       # Request handlers
│   ├── templates/          # SpecKit/Claude Code templates
│   └── utils/
│       ├── kroki.js        # Kroki API client
│       ├── security.js     # Path validation
│       ├── error-image.js  # SVG error generator
│       └── port-finder.js  # Port availability
├── templates/              # User-facing templates
├── demo/                   # Example diagrams
├── specs/                  # Feature specifications
└── package.json
```

## URL Format

v2.0 uses simplified URL pattern:
```
http://localhost:3000/{path/to/file.ext}
```

Examples:
```markdown
![Architecture](http://localhost:3000/diagrams/architecture.puml)
![Flow](http://localhost:3000/specs/001-auth/diagrams/flow.mmd)
![Logo](http://localhost:3000/images/logo.png)
```

## Supported Formats

### Dynamic (via Kroki)
`.puml`, `.mmd`, `.d2`, `.erd`, `.bpmn`, `.nomnoml`, `.blockdiag`, `.seqdiag`, `.actdiag`, `.nwdiag`, `.dot`, `.dbml`, `.vega`, `.wavedrom`, and 15+ more.

All rendered to SVG (`image/svg+xml`).

### Static (passthrough)
`.png`, `.jpg`, `.gif`, `.svg`, `.webp`

### Errors
Returns SVG error images with clear error messages.

## Configuration

### Priority: Environment > Config File > Defaults

### Environment Variables
```bash
LIVEDOC_PORT=8080
LIVEDOC_KROKI_URL=https://kroki.chuntech.org
```

### Config Files
`.livedocrc` or `livedoc.config.json`:
```json
{
  "port": 8080,
  "krokiUrl": "https://kroki.chuntech.org"
}
```

## CLI Commands

```bash
livedoc start              # Start server
livedoc start --port 8080  # Custom port
livedoc templates          # Show integration templates
livedoc --version          # Show version
```

## Development

```bash
# Install dependencies
npm install

# Start server
node bin/livedoc.js start

# Test version
node bin/livedoc.js --version
```

## Token Usage Optimization

### Forbidden Directories

**NEVER** access these directories:
- `node_modules/`
- `.git/`
- `build/`, `dist/`

### Correct Search Patterns

```javascript
// GOOD: Focused searches
Glob("src/**/*.js")
Glob("demo/**/*.puml")

// BAD: Too broad
Glob("**/*.js")
```

### Core Code Locations

- `src/` - Production code
- `bin/` - CLI entry point
- `demo/` - Example diagrams
- `specs/` - Feature specifications
- `templates/` - Integration templates

## Active Technologies
- Node.js >= 18.0.0 (JavaScript ES6+) + Express 4.18, Commander 11.0, detect-port, mime-types (002-error-svg-wordwrap)
- N/A (無資料庫需求) (002-error-svg-wordwrap)

## Recent Changes
- 002-error-svg-wordwrap: Added Node.js >= 18.0.0 (JavaScript ES6+) + Express 4.18, Commander 11.0, detect-port, mime-types
