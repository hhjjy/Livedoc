# Implementation Plan: SVG 換行修正與 CLI 使用教學

**Branch**: `002-error-svg-wordwrap` | **Date**: 2025-11-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-error-svg-wordwrap/spec.md`

## Summary

修正 error SVG 圖片中長字串（如檔案路徑、URL）的換行問題，確保內容完整顯示不超出邊界。同時新增 `livedoc guide` CLI 指令，提供 LiveDoc + SpecKit + Claude Code 整合使用教學。

技術方案：
1. 強化 `wrapText` 函式，支援在自然斷點（`/`、`-`、`_`、`.`）或強制位置斷行
2. 新增 `guide` CLI 指令，輸出格式化的使用教學文字

## Technical Context

**Language/Version**: Node.js >= 18.0.0 (JavaScript ES6+)
**Primary Dependencies**: Express 4.18, Commander 11.0, detect-port, mime-types
**Storage**: N/A (無資料庫需求)
**Testing**: Jest 29.0 + Supertest 6.3
**Target Platform**: Cross-platform CLI (macOS, Linux, Windows)
**Project Type**: Single project (CLI + Server)
**Performance Goals**: N/A (非效能敏感功能)
**Constraints**: SVG 每行 55 字元限制（600px 寬度下等寬字體）
**Scale/Scope**: 單一功能模組，影響範圍小

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASSED (constitution.md 為模板狀態，無特定限制)

專案遵循原則：
- 簡潔：最小化變更，只修改必要檔案
- 測試先行：新增測試驗證換行功能
- CLI 介面：新增 `guide` 指令符合現有 CLI 架構

## Project Structure

### Documentation (this feature)

```text
specs/002-error-svg-wordwrap/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── cli/
│   ├── index.js         # Command registration
│   └── commands/
│       ├── start.js     # Server start command
│       ├── templates.js # Templates command
│       └── guide.js     # [NEW] Guide command
├── config/
├── server/
├── templates/
└── utils/
    └── error-image.js   # [MODIFY] Fix wrapText function

tests/
├── unit/
│   └── error-image.test.js  # [MODIFY] Add wrap tests
└── integration/
```

**Structure Decision**: 使用現有 Single project 結構，新增一個 CLI 指令檔案，修改一個 utils 檔案。

## Complexity Tracking

> 無違規需要說明 - 變更範圍小且簡潔

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
