# Data Model: LiveDoc v2

**Date**: 2025-11-26
**Feature**: 001-livedoc-redesign

## Overview

LiveDoc 是一個無狀態的 HTTP 代理服務，不需要持久化存儲。以下定義的是運行時的資料結構。

## Entities

### 1. Configuration

運行時配置，從多個來源合併。

```typescript
interface Configuration {
  port: number;           // HTTP server port (default: 3000)
  krokiUrl: string;       // Kroki service endpoint (default: 'https://kroki.io')
  baseDir: string;        // Base directory for file serving (default: process.cwd())
  maxFileSize: number;    // Maximum file size in bytes (default: 1MB = 1048576)
}
```

**來源優先順序**:
1. 環境變數 (`LIVEDOC_PORT`, `LIVEDOC_KROKI_URL`)
2. 專案配置檔 (`.livedocrc`, `livedoc.config.json`)
3. 內建預設值

### 2. DiagramRequest

處理圖表請求的內部資料結構。

```typescript
interface DiagramRequest {
  requestPath: string;    // Original request path (e.g., '/specs/001/diagrams/arch.puml')
  absolutePath: string;   // Resolved absolute file path
  extension: string;      // File extension (e.g., '.puml')
  diagramType: string;    // Kroki diagram type (e.g., 'plantuml')
  isStatic: boolean;      // Whether this is a static image (png/jpg/gif/svg)
}
```

### 3. DiagramResponse

響應結果的內部資料結構。

```typescript
interface DiagramResponse {
  success: boolean;
  contentType: string;    // MIME type (e.g., 'image/svg+xml', 'image/png')
  content: Buffer;        // Image content
  error?: string;         // Error message if success is false
}
```

### 4. FormatMapping

檔案副檔名到 Kroki 圖表類型的映射。

```typescript
interface FormatMapping {
  extension: string;      // File extension (e.g., '.puml')
  krokiType: string;      // Kroki diagram type (e.g., 'plantuml')
  aliases?: string[];     // Alternative extensions (e.g., ['.plantuml'])
}
```

**預定義映射** (25+ 種):

| Category | Extensions | Kroki Type |
|----------|------------|------------|
| UML | `.puml`, `.plantuml` | plantuml |
| Flowchart | `.mmd`, `.mermaid` | mermaid |
| Architecture | `.d2` | d2 |
| Architecture | `.c4plantuml` | c4plantuml |
| Architecture | `.structurizr` | structurizr |
| Graph | `.dot`, `.graphviz` | graphviz |
| Class | `.nomnoml` | nomnoml |
| Database | `.erd` | erd |
| Database | `.dbml` | dbml |
| Process | `.bpmn` | bpmn |
| Block | `.blockdiag` | blockdiag |
| Sequence | `.seqdiag` | seqdiag |
| Activity | `.actdiag` | actdiag |
| Network | `.nwdiag` | nwdiag |
| Network | `.packetdiag` | packetdiag |
| Rack | `.rackdiag` | rackdiag |
| ASCII Art | `.ditaa` | ditaa |
| ASCII Art | `.svgbob` | svgbob |
| Sketch | `.excalidraw` | excalidraw |
| Diagram | `.pikchr` | pikchr |
| UML | `.umlet` | umlet |
| Data Viz | `.vega` | vega |
| Data Viz | `.vegalite` | vegalite |
| Timing | `.wavedrom` | wavedrom |
| Wiring | `.wireviz` | wireviz |

### 5. ErrorImage

錯誤圖片的資料結構。

```typescript
interface ErrorImage {
  title: string;          // Error title (e.g., 'File Not Found')
  message: string;        // Detailed error message
  width: number;          // Image width (default: 600)
  height: number;         // Image height (default: 200)
}
```

**錯誤類型**:

| Error Type | Title | Example Message |
|------------|-------|-----------------|
| FILE_NOT_FOUND | File Not Found | `diagrams/missing.puml does not exist` |
| UNSUPPORTED_FORMAT | Unsupported Format | `.xyz is not a supported diagram format` |
| KROKI_ERROR | Kroki Error | `Connection refused: https://kroki.io` |
| SYNTAX_ERROR | Syntax Error | `PlantUML syntax error at line 5` |
| FILE_TOO_LARGE | File Too Large | `File size 2.5MB exceeds limit of 1MB` |
| PATH_TRAVERSAL | Access Denied | `Path traversal attempt blocked` |

## State Transitions

LiveDoc 是無狀態服務，沒有持久化的狀態轉換。每個請求都是獨立處理的。

### Request Processing Flow

```
[Incoming Request]
       ↓
[Parse Request Path]
       ↓
[Security Check] → [FAIL] → [Error Image: Access Denied]
       ↓ PASS
[Resolve File Path]
       ↓
[File Exists?] → [NO] → [Error Image: File Not Found]
       ↓ YES
[Check File Size] → [TOO LARGE] → [Error Image: File Too Large]
       ↓ OK
[Determine Format]
       ↓
[Static Format?] → [YES] → [Return File Directly]
       ↓ NO
[Call Kroki API]
       ↓
[Kroki Success?] → [NO] → [Error Image: Kroki Error / Syntax Error]
       ↓ YES
[Return SVG]
```

## Validation Rules

### Path Validation
- Path must not contain `..` sequences
- Resolved path must be within `baseDir`
- Path must not be a directory

### File Validation
- File must exist
- File size must be ≤ `maxFileSize`
- File must have a recognized extension

### Configuration Validation
- `port` must be 1-65535
- `krokiUrl` must be a valid URL
- `baseDir` must be an existing directory

## Relationships

```
Configuration (1) ←→ (N) DiagramRequest
                          ↓
                    DiagramResponse
                          ↓
              [SVG Content] or [Error Image]
```

## Notes

- 所有資料結構都是運行時的，不需要資料庫
- Configuration 在服務啟動時載入一次
- DiagramRequest/Response 是每個 HTTP 請求獨立創建的
- FormatMapping 是靜態常量，編譯時確定
