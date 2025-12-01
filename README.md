# LiveDoc

Zero-configuration diagram server for Markdown documentation.

Render PlantUML, Mermaid, D2, and 25+ diagram formats directly in your Markdown files.

## Installation

```bash
npm install -g livedoc-cli
```

## Quick Start

```bash
# Start the server in any project directory
livedoc start

# Output:
# LiveDoc v2.1.0 started
#   URL:    http://localhost:3000
#   Root:   /path/to/your/project
#   Kroki:  https://kroki.io
```

## Usage in Markdown

Reference your diagram files using LiveDoc URLs:

```markdown
# Architecture

![System Architecture](http://localhost:3000/diagrams/architecture.puml)

# User Flow

![Registration Flow](http://localhost:3000/diagrams/flow.mmd)
```

When you preview your Markdown in VS Code, Typora, or any Markdown editor, diagrams render automatically!

## Supported Formats

### Dynamic (rendered via Kroki)

| Extension | Type | Description |
|-----------|------|-------------|
| `.puml` | PlantUML | UML diagrams, C4 architecture |
| `.mmd` | Mermaid | Flowcharts, sequence diagrams |
| `.d2` | D2 | Modern diagram language |
| `.nomnoml` | Nomnoml | Class diagrams |
| `.erd` | ERD | Entity-Relationship diagrams |
| `.bpmn` | BPMN | Business process diagrams |
| `.dot` | Graphviz | Graph visualization |
| `.blockdiag` | BlockDiag | Block diagrams |
| `.seqdiag` | SeqDiag | Sequence diagrams |
| `.actdiag` | ActDiag | Activity diagrams |
| `.nwdiag` | NwDiag | Network diagrams |
| `.dbml` | DBML | Database markup |
| `.vega` | Vega | Data visualization |
| `.wavedrom` | WaveDrom | Digital timing diagrams |
| ... | ... | 25+ more formats |

### Static (passthrough)

| Extension | Type |
|-----------|------|
| `.png` | PNG images |
| `.jpg` | JPEG images |
| `.gif` | GIF images |
| `.svg` | SVG images |
| `.webp` | WebP images |

## CLI Commands

```bash
# Start server (default port 3000)
livedoc start

# Start on specific port
livedoc start --port 8080

# Use custom Kroki service
livedoc start --kroki https://your-kroki-server.com

# Show available templates
livedoc templates

# Show version
livedoc --version

# Show help
livedoc --help
```

## Configuration

### Environment Variables

```bash
# Custom port
LIVEDOC_PORT=8080 livedoc start

# Custom Kroki service
LIVEDOC_KROKI_URL=https://your-kroki-server.com livedoc start
```

### Configuration File

Create `.livedocrc` in your project root:

```json
{
  "port": 8080,
  "krokiUrl": "https://your-kroki-server.com"
}
```

Configuration priority: **Environment Variables > Config File > Defaults**

## SpecKit Integration

LiveDoc works seamlessly with [SpecKit](https://github.com/hhjjy/SpecKit) for feature-driven development:

```
your-project/
├── specs/
│   └── 001-auth/
│       ├── spec.md
│       ├── plan.md
│       └── diagrams/
│           ├── architecture.puml
│           └── flow.mmd
└── src/
```

In your spec.md:

```markdown
## Architecture

![System Architecture](http://localhost:3000/specs/001-auth/diagrams/architecture.puml)
```

### Claude Code Integration

Get templates for integrating LiveDoc with Claude Code:

```bash
livedoc templates
```

## Error Handling

All errors return readable SVG images instead of broken image icons. Error types:

- **File Not Found**: File doesn't exist at the specified path
- **Unsupported Format**: File extension is not supported
- **Syntax Error**: Diagram source has syntax errors
- **Kroki Error**: Connection or timeout issues with Kroki service
- **File Too Large**: File exceeds 1MB limit
- **Invalid Path**: Path traversal attempt detected

## Architecture

```
Markdown Editor → GET /{path} → LiveDoc Server
                                    ↓
                              Route by extension
                        ┌───────────┴───────────┐
                        ↓                       ↓
                  Static Handler         Diagram Handler
                  (PNG/JPG/GIF)         (PUML/MMD/D2...)
                        ↓                       ↓
                   Return file          Render via Kroki
                        ↓                       ↓
                        └─────────→ SVG ←───────┘
```

## License

MIT
