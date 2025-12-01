# LiveDoc Claude Code Hook

This hook automatically starts LiveDoc when you open a project with diagram files.

## Setup

1. Create `.claude/hooks/project-open.sh`:

```bash
#!/bin/bash
# Auto-start LiveDoc server when opening project

# Check if LiveDoc is installed
if ! command -v livedoc &> /dev/null; then
    echo "LiveDoc not installed. Run: npm install -g livedoc-cli"
    exit 0
fi

# Check if project has diagram files
DIAGRAM_COUNT=$(find . -type f \( -name "*.puml" -o -name "*.mmd" -o -name "*.d2" \) 2>/dev/null | wc -l)

if [ "$DIAGRAM_COUNT" -gt 0 ]; then
    # Check if LiveDoc is already running
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "Starting LiveDoc server..."
        livedoc start &
        sleep 1
        echo "LiveDoc running at http://localhost:3000"
    else
        echo "LiveDoc already running at http://localhost:3000"
    fi
fi
```

2. Make it executable:
```bash
chmod +x .claude/hooks/project-open.sh
```

## Alternative: Manual Start

If you prefer manual control, add this to your Claude Code instructions:

```
When working with diagram files (.puml, .mmd, .d2, etc.):
1. Ensure LiveDoc is running: livedoc start
2. Reference diagrams in Markdown using: ![](http://localhost:3000/path/to/diagram.puml)
3. Diagrams will auto-refresh when source files change
```

## Environment Variables

You can customize LiveDoc behavior:

```bash
# Use custom port
LIVEDOC_PORT=8080 livedoc start

# Use custom Kroki service
LIVEDOC_KROKI_URL=https://your-kroki-server.com livedoc start
```

## Troubleshooting

### Diagrams not rendering

1. Check LiveDoc is running: `curl http://localhost:3000`
2. Check file exists at the path
3. Check file extension is supported
4. Check diagram syntax is valid

### Port already in use

LiveDoc will automatically find the next available port. Check the startup message for the actual URL.
