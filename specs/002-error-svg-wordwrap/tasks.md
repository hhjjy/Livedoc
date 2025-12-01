# Tasks: SVG 換行修正與 CLI 使用教學

**Input**: Design documents from `/specs/002-error-svg-wordwrap/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: 包含測試任務（規格中 SC-004 要求新增 5+ 個測試）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: 確認開發環境就緒

- [x] T001 確認目前在 002-error-svg-wordwrap 分支
- [x] T002 執行 `npm install` 確認相依套件已安裝

**Checkpoint**: 開發環境就緒

---

## Phase 2: Foundational

**Purpose**: 無阻塞性基礎任務（此功能無需前置基礎建設）

> 此功能變更範圍小，無需額外基礎建設。直接進入 User Story 實作。

**Checkpoint**: 可開始 User Story 實作

---

## Phase 3: User Story 1 - 長路徑錯誤訊息正確換行 (Priority: P1) 🎯 MVP

**Goal**: 修正 error SVG 圖片中長字串的換行問題，確保內容完整顯示

**Independent Test**: 產生包含 80+ 字元長路徑的錯誤 SVG，驗證路徑完整顯示且正確換行

### Tests for User Story 1

- [x] T003 [P] [US1] 新增長路徑換行測試 in tests/unit/error-image.test.js
- [x] T004 [P] [US1] 新增自然斷點測試（/, -, _, .）in tests/unit/error-image.test.js
- [x] T005 [P] [US1] 新增強制斷行測試（無斷點字串）in tests/unit/error-image.test.js
- [x] T006 [P] [US1] 新增 URL 換行測試 in tests/unit/error-image.test.js
- [x] T007 [P] [US1] 新增內容完整性測試 in tests/unit/error-image.test.js

### Implementation for User Story 1

- [x] T008 [US1] 實作 breakLongWord 函式 in src/utils/error-image.js
- [x] T009 [US1] 修改 wrapText 函式支援長字串斷行 in src/utils/error-image.js
- [x] T010 [US1] 執行測試確認 US1 所有測試通過 (`npm test`)

**Checkpoint**: User Story 1 完成 - 長路徑可正確換行顯示

---

## Phase 4: User Story 2 - CLI 使用教學 (Priority: P2)

**Goal**: 新增 `livedoc guide` 指令顯示使用教學

**Independent Test**: 執行 `livedoc guide` 指令，驗證顯示完整教學內容

### Implementation for User Story 2

- [x] T011 [US2] 建立 guide.js 指令檔案 in src/cli/commands/guide.js
- [x] T012 [US2] 撰寫 LiveDoc 基本用法教學內容（啟動、URL 格式、支援格式）
- [x] T013 [US2] 撰寫 SpecKit 整合說明（目錄結構、圖表命名、Markdown 嵌入）
- [x] T014 [US2] 撰寫 Claude Code 工作流程（圖表驅動開發步驟）
- [x] T015 [US2] 註冊 guide 指令到 CLI in src/cli/index.js 和 bin/livedoc.js
- [x] T016 [US2] 手動驗證 `node bin/livedoc.js guide` 輸出正確

**Checkpoint**: User Story 2 完成 - `livedoc guide` 指令可正常執行

---

## Phase 5: User Story 3 - 發布與版本更新 (Priority: P3)

**Goal**: 更新版本號、提交程式碼、發布到 npm

**Independent Test**: 執行 `livedoc --version` 確認版本號為 2.1.0，npm 上可安裝新版本

### Implementation for User Story 3

- [x] T017 [US3] 更新 package.json 版本號從 2.0.0 到 2.1.0
- [x] T018 [US3] 執行 `npm test` 確認所有測試通過 (105 tests passed)
- [x] T019 [US3] 驗證 `node bin/livedoc.js --version` 顯示 2.1.0
- [ ] T020 [US3] Git commit 所有變更（含 002 功能變更）
- [ ] T021 [US3] Git push 到遠端倉庫
- [ ] T022 [US3] 執行 `npm login` 登入 npm（如尚未登入）
- [ ] T023 [US3] 執行 `npm publish --access public` 發布套件
- [ ] T024 [US3] 驗證 npm 上套件版本為 2.1.0

**Checkpoint**: User Story 3 完成 - 套件已發布到 npm

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 最終驗證與清理

- [ ] T025 執行完整測試套件 `npm test` 確認無迴歸
- [ ] T026 執行 quickstart.md 驗證步驟確認功能正常
- [ ] T027 [P] 清理任何除錯程式碼或暫存檔案

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────┐
                                             │
Phase 2 (Foundational) ──────────────────────┤
                                             ▼
                                    ┌────────────────┐
                                    │  可並行開始    │
                                    └────────────────┘
                                    /        |        \
                                   ▼         ▼         ▼
                               Phase 3   Phase 4   (等待)
                               (US1)     (US2)
                                   \         /
                                    ▼       ▼
                              US1 + US2 完成後
                                       │
                                       ▼
                                   Phase 5
                                   (US3: 發布)
                                       │
                                       ▼
                                   Phase 6
                                   (Polish)
```

### User Story Dependencies

- **User Story 1 (P1)**: 無依賴，可獨立完成
- **User Story 2 (P2)**: 無依賴，可與 US1 並行
- **User Story 3 (P3)**: 依賴 US1 + US2 完成，發布前需所有功能就緒

### Parallel Opportunities

**Phase 3 內部（US1 測試）**:
```bash
# 可並行執行所有測試任務 T003-T007
Task: T003 - 長路徑換行測試
Task: T004 - 自然斷點測試
Task: T005 - 強制斷行測試
Task: T006 - URL 換行測試
Task: T007 - 內容完整性測試
```

**Phase 3 與 Phase 4 可並行**:
- US1（SVG 換行）和 US2（CLI guide）操作不同檔案，可同時進行

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1 (SVG 換行修正)
3. **STOP and VALIDATE**: 測試長路徑 SVG 正確換行
4. 可先部署/展示 MVP

### Incremental Delivery

1. Setup → Foundation ready
2. Add User Story 1 → Test independently → SVG 換行功能可用
3. Add User Story 2 → Test independently → `livedoc guide` 可用
4. Add User Story 3 → Test independently → 發布到 npm
5. Each story adds value without breaking previous stories

### Single Developer Flow

```
T001 → T002 → T003-T007 (並行測試) → T008 → T009 → T010
                                                    ↓
T011 → T012 → T013 → T014 → T015 → T016 (US2)
                                                    ↓
T017 → T018 → T019 → T020 → T021 → T022 → T023 → T024 (US3)
                                                    ↓
T025 → T026 → T027 (Polish)
```

---

## Notes

- [P] tasks = 不同檔案，無依賴
- [Story] label maps task to specific user story for traceability
- 測試應在實作前撰寫（TDD）
- Commit after each story completion
- Stop at any checkpoint to validate story independently
- US3 的 npm publish 需要 npm login 先完成
