# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LiveDoc** is a tool that solves the maintenance problem of images in Markdown documentation (PlantUML, architecture diagrams, etc.) by serving them dynamically via HTTP server. Instead of static images that become outdated, LiveDoc allows Markdown editors to reference images via URLs that are always up-to-date.

Currently in **MVP development phase**.

## Architecture

LiveDoc follows a client-server architecture:

```
Markdown Editor → HTTP GET → Express Server → Router
                                                ↓
                                    ┌───────────┴───────────┐
                                    ↓                       ↓
                            Static Handler          Dynamic Handler
                         (PNG/JPG/GIF/SVG)         (PlantUML/Mermaid)
                                    ↓                       ↓
                            Return Image            Compile to PNG
                                    ↓                       ↓
                                Error Handler (if failed)
                                    ↓
                            Return Error Image (PNG)
```

### Key Components

- **Static Handler**: Serves static images directly (PNG, JPG, GIF) with proper Content-Type
- **Dynamic Handler**: Compiles PlantUML (.puml) and Mermaid (.mmd) files into PNG images
- **Error Handler**: Always returns an error image (PNG) instead of HTTP error codes (critical for Markdown compatibility)

### Core Principle

**Always return an image, even on error**. Markdown editors only recognize "HTTP 200 + image/*". If you return an error code, the Markdown editor will display a broken image icon. Error information should be visualized in the error image itself.

## Project Structure

```
livedoc/
├── src/                    # MVP production code (currently empty)
├── experiments/            # Experimental code
│   ├── presentation/       # Project presentation materials
│   └── md_render_validation/  # Express server for image validation
├── docs/                   # Project documentation
│   └── mvp/
│       └── readme.md      # Detailed MVP specification
└── README.md
```

## URL Format

LiveDoc uses the following URL pattern:
```
http://localhost:3000/{project}/livedoc/{type}/{filename}
```

- **project**: Project name (registered via `livedoc init`)
- **type**: Either `static` or `dynamic`
- **filename**: File with extension (.png/.jpg/.gif/.puml/.mmd)

### Examples

```markdown
![Logo](http://localhost:3000/demo/livedoc/static/logo.png)
![Architecture](http://localhost:3000/demo/livedoc/dynamic/arch.puml)
```

## Supported Formats

### Static (returned as-is)
- `.png` → `image/png`
- `.jpg`, `.jpeg` → `image/jpeg`
- `.gif` → `image/gif`
- `.svg` → `image/svg+xml` (optional)

### Dynamic (compiled to PNG)
- `.puml` → PNG → `image/png`
- `.mmd` → PNG → `image/png`

### Error (always PNG)
- Any error → Error image PNG → `image/png`

## Configuration

### Global Config Location
```
~/.livedoc/
├── config.json
└── logs/
    └── YYYY-MM-DD.log
```

### config.json Format
```json
{
  "projects": {
    "demo": "/path/to/demo",
    "test": "/path/to/test"
  },
  "port": 3000,
  "supportedFormats": {
    "static": [".png", ".jpg", ".jpeg", ".gif"],
    "dynamic": [".puml", ".mmd"]
  }
}
```

## Development

### Experimental Server

There's a test server in `experiments/md_render_validation/server.js` that demonstrates basic image serving:

```bash
cd experiments/md_render_validation
node server.js
```

Server runs on port 54323.

### Planned CLI Commands

```bash
livedoc init              # Register current directory as a project
livedoc start             # Start the server
livedoc list              # List registered projects
```

## Dependencies (Planned)

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "commander": "^11.0.0",
    "node-plantuml": "^0.9.0",
    "@mermaid-js/mermaid-cli": "^10.0.0",
    "canvas": "^2.11.0",
    "mime-types": "^2.1.35"
  }
}
```

## Error Handling

All errors must return:
- HTTP 200 status
- Content-Type: `image/png`
- A PNG image containing error information (600x400px, light red background)

Error types:
- File not found
- Compilation failed (.puml/.mmd syntax errors)
- Project not registered
- Unsupported format
- Other errors

## Logging

Log format:
```
[YYYY-MM-DD HH:mm:ss] LEVEL | path | message
```

Examples:
```
[2024-10-01 14:23:45] INFO  | static/logo.png    | Served as image/png
[2024-10-01 14:23:49] ERROR | dynamic/bad.puml   | Compile Error → Error PNG
```

## Implementation Notes

- The `/src` directory is currently empty - MVP code will be implemented here
- Static files preserve their original format (PNG stays PNG, GIF stays GIF)
- Dynamic files are always compiled to PNG
- Error images are always PNG format
- Never return HTTP error codes - always return HTTP 200 with an image
