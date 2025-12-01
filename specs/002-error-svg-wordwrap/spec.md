# Feature Specification: SVG 換行修正與 CLI 使用教學

**Feature Branch**: `002-error-svg-wordwrap`
**Created**: 2025-11-27
**Status**: Draft
**Input**: 修正 error SVG 圖片的長字串換行問題，新增 CLI 使用教學，並更新 npm 版本號

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 長路徑錯誤訊息正確換行 (Priority: P1)

當文件路徑很長（如 `specs/001-feature-name/diagrams/architecture-detailed-design-flow.puml`）導致檔案找不到時，使用者看到的錯誤 SVG 圖片應該正確換行顯示完整路徑，而不是超出圖片邊界。

**Why this priority**: 核心 bug 修正，直接影響使用者除錯體驗。目前長路徑會超出 SVG 邊界導致訊息被截斷，使用者無法看到完整的錯誤路徑。

**Independent Test**: 產生包含 80+ 字元長路徑的錯誤 SVG，驗證路徑完整顯示且正確換行。

**Acceptance Scenarios**:

1. **Given** 長路徑 `specs/001-feature-name/diagrams/very-long-architecture-detailed-design-flow.puml` 不存在, **When** 產生錯誤 SVG 圖片, **Then** 路徑應自動換行，每行不超過 55 字元，並完整顯示所有內容
2. **Given** 長 URL `https://very-long-subdomain.example-domain.com/path/to/resource/file.png`, **When** 產生錯誤 SVG 圖片, **Then** URL 應在適當位置（如 `/`、`-`、`.`）斷行，完整顯示
3. **Given** 超長無分隔符字串（如 100 個連續字母）, **When** 產生錯誤 SVG 圖片, **Then** 應強制在 55 字元處斷行，確保內容不超出邊界

---

### User Story 2 - CLI 使用教學 (Priority: P2)

使用者輸入 `livedoc guide` 指令後，可以看到完整的使用教學，包含 LiveDoc 基本用法、如何與 SpecKit 目錄結構整合、以及如何搭配 Claude Code 進行圖表驅動開發的工作流程。

**Why this priority**: 降低新使用者學習曲線，提升開發者體驗。使用者需要了解如何在現有的 SpecKit 專案中整合 LiveDoc。

**Independent Test**: 執行 `livedoc guide` 指令，驗證顯示完整教學內容。

**Acceptance Scenarios**:

1. **Given** 使用者在終端機執行 `livedoc guide`, **When** 指令完成, **Then** 顯示 LiveDoc 基本使用說明（啟動、URL 格式）
2. **Given** 教學內容, **When** 使用者閱讀, **Then** 包含 SpecKit 整合說明（`specs/{feature}/diagrams/` 目錄結構）
3. **Given** 教學內容, **When** 使用者閱讀, **Then** 包含 Claude Code 工作流程（如何讓 AI 產生圖表並即時預覽）

---

### User Story 3 - 發布與版本更新 (Priority: P3)

當功能開發完成後，需要更新版本號、提交程式碼到 Git 遠端倉庫、並發布到 npm registry。

**Why this priority**: 版本管理與發布是功能完成的最後步驟，確保使用者能夠安裝最新版本。

**Independent Test**: 執行發布流程，確認 npm 上可安裝新版本。

**Acceptance Scenarios**:

1. **Given** 功能開發完成, **When** 更新 package.json 版本號, **Then** 版本號從 2.0.0 更新為 2.1.0（新功能）
2. **Given** 使用者執行 `livedoc --version`, **When** 指令完成, **Then** 顯示更新後的版本號 2.1.0
3. **Given** 程式碼變更完成, **When** 執行 git commit 和 push, **Then** 程式碼推送到遠端倉庫
4. **Given** npm login 已完成, **When** 執行 npm publish, **Then** 套件成功發布到 npm registry
5. **Given** 使用者執行 `npm install -g @livedoc/cli`, **When** 安裝完成, **Then** 可安裝到最新版本 2.1.0

---

### Edge Cases

- 單一超長詞（如連續 120 個 'A' 字元）：應強制斷行
- 混合短詞和長詞的訊息：短詞正常以空格分隔，長詞自動斷行
- 空訊息：顯示預設錯誤訊息
- 非 ASCII 字元（中文、日文）：正常顯示（SVG 支援 UTF-8）
- 路徑包含特殊 XML 字元（`<`、`>`、`&`）：應正確跳脫

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: wrapText 函式 MUST 能處理沒有空格的長字串，在自然斷點（`/`、`-`、`_`、`.`）或 maxChars 處自動斷行
- **FR-002**: SVG 高度 MUST 根據換行後的行數動態調整，確保完整顯示所有內容
- **FR-003**: 錯誤 SVG 中的所有文字 MUST 完整顯示，不得超出圖片邊界
- **FR-004**: System MUST 提供 `livedoc guide` 指令顯示使用教學
- **FR-005**: 使用教學 MUST 包含：LiveDoc 基本用法（啟動、停止、URL 格式）
- **FR-006**: 使用教學 MUST 包含：SpecKit 整合說明（目錄結構、圖表命名）
- **FR-007**: 使用教學 MUST 包含：Claude Code 工作流程（圖表驅動開發步驟）
- **FR-008**: 版本號 MUST 遵循 Semantic Versioning（MAJOR.MINOR.PATCH）
- **FR-009**: package.json 版本號 MUST 更新以反映新功能發布
- **FR-010**: 程式碼變更 MUST 提交到 Git 並推送到遠端倉庫
- **FR-011**: 套件 MUST 發布到 npm registry 供使用者安裝

### Assumptions

- SVG 每行最大字元數維持 55 字元（符合預設 600px 寬度）
- 使用等寬字體（monospace）確保換行計算準確
- 教學內容以純文字格式顯示在終端機
- 使用者有基本 Git 和 Markdown 知識
- 版本更新採用 MINOR 版本號（新功能，向後相容）

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 字元無空格字串能正確換行，不超出 SVG 邊界
- **SC-002**: 所有錯誤類型的 SVG 圖片完整顯示錯誤訊息
- **SC-003**: `livedoc guide` 指令成功執行並顯示教學內容
- **SC-004**: 現有測試全數通過 + 新增 5+ 個換行功能測試
- **SC-005**: 使用者能在 2 分鐘內理解 LiveDoc + SpecKit + Claude Code 整合流程
- **SC-006**: `livedoc --version` 顯示正確的更新版本號 2.1.0
- **SC-007**: 程式碼成功推送到 Git 遠端倉庫
- **SC-008**: 套件成功發布到 npm registry，使用者可通過 npm install 安裝
