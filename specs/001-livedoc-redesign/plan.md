# Implementation Plan: LiveDoc v2 Redesign

**Branch**: `001-livedoc-redesign` | **Date**: 2025-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-livedoc-redesign/spec.md`

## Summary

重新設計 LiveDoc CLI 工具，從需要專案註冊的複雜模式改為「零初始化」模式。使用者只需執行 `livedoc start` 即可在當前目錄啟動伺服器，無需任何配置。同時新增 SpecKit 整合功能，提供 Constitution 範本和 Claude Code Hook。

**主要變更**:
1. 移除專案註冊機制，改為直接服務當前目錄
2. 簡化 URL 路徑：`/{path/to/file.ext}` 而非 `/{project}/livedoc/{type}/{file}`
3. 支援 25+ 圖表格式（Kroki 全系列）
4. 新增環境變數和 .livedocrc 配置支援
5. 提供 SpecKit Constitution 範本和 Hook 範本

## Technical Context

**Language/Version**: JavaScript (Node.js 18+)
**Primary Dependencies**: Express 4.x, Commander 11.x, node-fetch 3.x (for Kroki API)
**Storage**: 無持久化存儲（純 HTTP 代理服務）
**Testing**: Jest + Supertest (HTTP 測試)
**Target Platform**: macOS, Linux, Windows (Node.js 環境)
**Project Type**: Single CLI application
**Performance Goals**: 啟動 < 3秒, 請求響應 < 2秒, 50 並發
**Constraints**: 零初始化、無外部資料庫依賴
**Scale/Scope**: 單一開發者本地使用

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution 檔案為範本狀態（未填寫具體規則），暫時跳過 gate 檢查。

**建議補充 Constitution 規則**（作為 LiveDoc 產出物的一部分）:
- [ ] 每個 feature spec 需有系統架構圖
- [ ] plan.md 需規劃圖表更新任務
- [ ] implement 階段需檢查圖表一致性

## Project Structure

### Documentation (this feature)

```text
specs/001-livedoc-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
│   └── openapi.yaml
├── diagrams/            # Architecture diagrams
│   ├── architecture.puml
│   └── request-flow.mmd
└── tasks.md             # Phase 2 output (by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── cli/
│   ├── index.js         # CLI entry point (commander setup)
│   └── commands/
│       ├── start.js     # livedoc start command
│       ├── version.js   # livedoc --version
│       └── help.js      # livedoc --help
├── server/
│   ├── app.js           # Express application factory
│   ├── router.js        # Route setup
│   └── handlers/
│       ├── diagram.js   # Dynamic diagram handler (Kroki proxy)
│       ├── static.js    # Static image passthrough
│       └── error.js     # Error image generator
├── config/
│   ├── loader.js        # Configuration loader (env > file > default)
│   ├── defaults.js      # Default configuration values
│   └── formats.js       # Supported diagram formats mapping
├── utils/
│   ├── kroki.js         # Kroki API client
│   ├── security.js      # Path traversal protection
│   ├── port-finder.js   # Auto port detection
│   └── error-image.js   # PNG error image generator
└── templates/           # SpecKit integration templates
    ├── constitution-snippet.md
    └── claude-hook.md

tests/
├── unit/
│   ├── config.test.js
│   ├── security.test.js
│   └── formats.test.js
├── integration/
│   ├── server.test.js
│   └── kroki.test.js
└── e2e/
    └── cli.test.js

bin/
└── livedoc.js           # CLI executable entry

templates/               # User-facing templates (copied on init)
├── constitution-snippet.md
└── claude-hook.md
```

**Structure Decision**: Single project structure，CLI 工具不需要前後端分離。現有 `src/` 結構將重構以符合新架構。

## Key Architecture Decisions

### 1. Zero-Init Design
- 移除 `~/.livedoc/config.json` 全域配置
- 移除專案註冊概念
- 直接以 `process.cwd()` 作為服務根目錄

### 2. Configuration Priority
```
環境變數 (LIVEDOC_*) > .livedocrc / livedoc.config.json > 內建預設值
```

### 3. URL Path Mapping
```
HTTP: GET /{any/path/to/file.ext}
File: ${cwd}/${any/path/to/file.ext}
```

### 4. Error Handling
所有錯誤返回 HTTP 200 + PNG 圖片，圖片內顯示錯誤訊息。

### 5. Kroki Integration
```
Request → Check Extension → Static? Return file : Call Kroki API → Return SVG
                                                         ↓ (on error)
                                                 Generate Error PNG
```

## Complexity Tracking

| Area | Complexity | Justification |
|------|------------|---------------|
| Config Loader | Low | Standard pattern, env > file > default |
| Kroki Proxy | Medium | Error handling + format mapping |
| Error Image Gen | Medium | Canvas/SVG text rendering |
| SpecKit Templates | Low | Static Markdown files |

No gate violations detected.
