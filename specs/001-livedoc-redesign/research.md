# Research: LiveDoc v2 Redesign

**Date**: 2025-11-26
**Feature**: 001-livedoc-redesign

## Research Questions

### 1. Kroki API Integration

**Question**: 如何與 Kroki API 整合以支援 25+ 圖表格式？

**Decision**: 使用 Kroki HTTP API（POST 端點），透過 base64 編碼傳送圖表源碼

**Rationale**:
- Kroki 提供統一的 API 端點，格式不同只是 URL path 不同
- POST 方式比 GET 更適合處理較大的圖表內容
- 返回 SVG 格式以獲得最佳渲染品質

**API Pattern**:
```
POST https://kroki.io/{diagram-type}/svg
Content-Type: text/plain
Body: <diagram source code>
```

**Alternatives Considered**:
- GET with base64 URL encoding: 有 URL 長度限制問題
- 本地安裝 Kroki Docker: 增加使用者安裝複雜度

### 2. Supported Diagram Formats

**Question**: 需要支援哪些圖表格式？檔案副檔名如何映射？

**Decision**: 支援 Kroki 所有圖表類型，共 25+ 種

**Format Mapping**:

| Extension | Kroki Type | Description |
|-----------|------------|-------------|
| `.puml`, `.plantuml` | plantuml | PlantUML diagrams |
| `.mmd`, `.mermaid` | mermaid | Mermaid diagrams |
| `.d2` | d2 | D2 diagrams |
| `.dot`, `.graphviz` | graphviz | Graphviz DOT |
| `.nomnoml` | nomnoml | Nomnoml class diagrams |
| `.erd` | erd | Entity-Relationship |
| `.bpmn` | bpmn | BPMN process |
| `.blockdiag` | blockdiag | Block diagrams |
| `.seqdiag` | seqdiag | Sequence diagrams |
| `.actdiag` | actdiag | Activity diagrams |
| `.nwdiag` | nwdiag | Network diagrams |
| `.packetdiag` | packetdiag | Packet diagrams |
| `.rackdiag` | rackdiag | Rack diagrams |
| `.c4plantuml` | c4plantuml | C4 architecture |
| `.dbml` | dbml | Database markup |
| `.ditaa` | ditaa | ASCII art |
| `.excalidraw` | excalidraw | Excalidraw |
| `.pikchr` | pikchr | Pikchr |
| `.structurizr` | structurizr | Structurizr |
| `.svgbob` | svgbob | ASCII to SVG |
| `.umlet` | umlet | UML diagrams |
| `.vega` | vega | Vega visualization |
| `.vegalite` | vegalite | Vega-Lite |
| `.wavedrom` | wavedrom | Digital timing |
| `.wireviz` | wireviz | Wiring diagrams |

**Static Formats** (passthrough):
| Extension | MIME Type |
|-----------|-----------|
| `.png` | image/png |
| `.jpg`, `.jpeg` | image/jpeg |
| `.gif` | image/gif |
| `.svg` | image/svg+xml |

### 3. Configuration Loading Strategy

**Question**: 如何實現「環境變數 > 配置檔 > 預設值」的優先順序？

**Decision**: 使用分層配置載入器

**Implementation**:
```javascript
function loadConfig() {
  const defaults = { port: 3000, krokiUrl: 'https://kroki.io' };
  const fileConfig = loadConfigFile(); // .livedocrc or livedoc.config.json
  const envConfig = loadEnvConfig();   // LIVEDOC_* environment variables

  return { ...defaults, ...fileConfig, ...envConfig };
}
```

**Environment Variables**:
- `LIVEDOC_PORT`: Server port
- `LIVEDOC_KROKI_URL`: Kroki service endpoint

**Config File Formats** (searched in order):
1. `.livedocrc` (JSON)
2. `livedoc.config.json`
3. `package.json` → `livedoc` key

### 4. Error Image Generation

**Question**: 如何在不依賴重型函式庫的情況下生成錯誤圖片？

**Decision**: 使用 SVG 模板轉換為 PNG，或直接返回 SVG 錯誤圖片

**Rationale**:
- SVG 是文字格式，可以動態生成錯誤訊息
- 避免依賴 `canvas` 這類需要原生編譯的套件
- 如果需要 PNG，可用輕量級 `sharp` 或 `svg2png`

**Error SVG Template**:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200">
  <rect width="100%" height="100%" fill="#fee"/>
  <text x="50%" y="40%" text-anchor="middle" fill="#c00" font-size="24">
    LiveDoc Error
  </text>
  <text x="50%" y="60%" text-anchor="middle" fill="#333" font-size="16">
    {error_message}
  </text>
</svg>
```

**Alternatives Considered**:
- `canvas`: 需要原生編譯，安裝複雜
- Pre-generated error images: 無法顯示動態錯誤訊息

### 5. Path Traversal Protection

**Question**: 如何防止路徑穿越攻擊？

**Decision**: 使用 `path.resolve()` + 檢查結果是否在 cwd 內

**Implementation**:
```javascript
function isPathSafe(requestPath, baseDir) {
  const resolved = path.resolve(baseDir, requestPath);
  return resolved.startsWith(path.resolve(baseDir) + path.sep);
}
```

**Attack Vectors Blocked**:
- `../../../etc/passwd`
- `..%2f..%2f` (URL encoded)
- Symbolic links outside base directory

### 6. Auto Port Detection

**Question**: 當預設 port 被佔用時如何自動找到可用 port？

**Decision**: 使用 `detect-port` 或簡單的 port scanning

**Implementation Options**:
1. **detect-port package**: 成熟的解決方案
2. **Manual implementation**: 嘗試綁定，失敗則遞增

```javascript
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port < startPort + 100; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error('No available port found');
}
```

### 7. SpecKit Integration Templates

**Question**: Constitution 和 Hook 範本應該包含什麼內容？

**Decision**: 提供可直接複製使用的 Markdown 片段

**Constitution Snippet** (`templates/constitution-snippet.md`):
```markdown
### Architecture Documentation (LiveDoc)

- Every feature MUST have a system architecture diagram in `specs/{feature}/diagrams/`
- Architecture diagrams MUST be updated when system structure changes
- Supported formats: PlantUML (.puml), Mermaid (.mmd), D2 (.d2)
- Diagrams are served via LiveDoc: `http://localhost:3000/specs/{feature}/diagrams/{file}`
```

**Claude Code Hook** (`templates/claude-hook.md`):
```markdown
## LiveDoc Diagram Guidelines

When working on this project:

1. **Before implementing a feature**: Check if architecture diagrams exist in `specs/{feature}/diagrams/`
2. **After modifying system structure**: Update relevant diagrams
3. **Diagram URL format**: `![](http://localhost:3000/{path/to/diagram.puml})`

### Quick Commands
- Start LiveDoc: `livedoc start`
- Verify diagrams: Open spec.md in Markdown preview
```

## Dependencies Analysis

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.0 | HTTP server |
| commander | ^11.0.0 | CLI framework |

### New Dependencies (to add)

| Package | Version | Purpose |
|---------|---------|---------|
| detect-port | ^1.5.0 | Auto port detection |

### Dependencies to Remove

| Package | Reason |
|---------|--------|
| canvas | Heavy native dependency, replaced with SVG error images |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Kroki service unavailable | Medium | High | Clear error message in error image |
| Path traversal attack | Low | Critical | Strict path validation |
| Large diagram files | Low | Medium | File size limit (1MB) |
| Slow Kroki response | Medium | Medium | No retry, immediate error response |

## Conclusion

所有技術問題已有明確解決方案，無需額外澄清。可進入 Phase 1 設計階段。
