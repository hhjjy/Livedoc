# Feature Specification: LiveDoc v2 Redesign

**Feature Branch**: `001-livedoc-redesign`
**Created**: 2025-11-26
**Status**: Draft
**Input**: User description: "重新設計 LiveDoc，解決安裝困難、使用複雜的問題，整合 SpecKit + Claude Code 工作流程"

## Clarifications

### Session 2025-11-26

- Q: 當多個配置來源同時存在時，應採用什麼優先順序？ → A: 環境變數 > 專案配置檔 > 預設值
- Q: Kroki 服務失敗時的處理方式？ → A: 立即返回錯誤圖片（不重試），圖片中顯示具體錯誤訊息
- Q: 新專案如何開始使用 LiveDoc？ → A: 零初始化，直接 `livedoc start` 即可服務當前目錄所有圖表檔案
- Q: 如何讓 Claude Code 知道何時畫/更新架構圖？ → A: Constitution 定義規則 + Hook 自動檢查（兩者並用）

## Overview

LiveDoc 是一個讓 Markdown 文件中的圖表保持動態更新的工具。使用者只需在 Markdown 中貼上 URL 連結，LiveDoc 伺服器會即時讀取源檔案並透過 Kroki 服務渲染成圖片返回。

**核心價值**: 讓架構圖、流程圖等文件圖表與程式碼保持同步，而非成為過時的靜態資產。

**關鍵改進目標**:
1. 單一指令安裝（npm install -g livedoc）
2. 與 SpecKit 工作流程整合（圖表存放在 specs/{feature}/diagrams/）
3. 零配置啟動（livedoc start 即可使用）
4. 支援自訂 Kroki 服務端點（如 https://kroki.chuntech.org）

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single Command Installation (Priority: P1)

作為一位開發者，我希望能用一行指令安裝 LiveDoc，讓我能在 5 分鐘內開始使用。

**Why this priority**: 這是入口門檻，如果安裝困難，使用者根本不會繼續嘗試。

**Independent Test**: 在全新電腦上執行 `npm install -g @livedoc/cli` 並驗證 `livedoc --version` 可正常執行。

**Acceptance Scenarios**:

1. **Given** 已安裝 Node.js 18+ 的電腦, **When** 執行 `npm install -g @livedoc/cli`, **Then** 安裝完成且 `livedoc` 指令可用
2. **Given** 已安裝 LiveDoc, **When** 執行 `livedoc --version`, **Then** 顯示版本號碼
3. **Given** 已安裝 LiveDoc, **When** 執行 `livedoc --help`, **Then** 顯示所有可用指令說明

---

### User Story 2 - Zero-Config Server Start (Priority: P1)

作為一位開發者，我希望能在任何專案目錄下執行 `livedoc start` 即刻啟動伺服器，無需事先配置。

**Why this priority**: 零配置體驗是易用性的核心，降低使用門檻。

**Independent Test**: 在包含 .puml 檔案的目錄執行 `livedoc start`，驗證伺服器啟動並能存取圖表。

**Acceptance Scenarios**:

1. **Given** 一個包含 diagrams/class.puml 的專案目錄, **When** 執行 `livedoc start`, **Then** 伺服器在預設 port 3000 啟動，顯示可存取的 URL
2. **Given** 伺服器已啟動, **When** 瀏覽器存取 `http://localhost:3000/diagrams/class.puml`, **Then** 返回該 PlantUML 渲染後的 SVG 圖片
3. **Given** port 3000 已被佔用, **When** 執行 `livedoc start`, **Then** 自動選擇下一個可用 port 並顯示實際 port 號

---

### User Story 3 - SpecKit Integration (Priority: P1)

作為一位使用 SpecKit 的開發者，我希望圖表檔案能存放在 `specs/{feature}/diagrams/` 目錄，讓圖表與功能規格一起管理。

**Why this priority**: 這是與現有工作流程整合的關鍵，讓架構圖成為規格文件的一部分。

**Independent Test**: 建立 `specs/001-auth/diagrams/flow.puml`，在 `specs/001-auth/spec.md` 中貼上 LiveDoc URL，驗證圖片可正確顯示。

**Acceptance Scenarios**:

1. **Given** 專案結構 specs/001-auth/diagrams/flow.puml, **When** 伺服器啟動, **Then** 可透過 `http://localhost:3000/specs/001-auth/diagrams/flow.puml` 存取圖片
2. **Given** 規格文件 spec.md 包含 LiveDoc URL, **When** 在 Markdown 編輯器預覽, **Then** 圖片正確顯示
3. **Given** Claude Code 修改了 flow.puml 檔案, **When** 重新載入 Markdown 預覽, **Then** 顯示更新後的圖片

---

### User Story 4 - Custom Kroki Endpoint (Priority: P2)

作為一位在受限網路環境的開發者，我希望能設定自己的 Kroki 伺服器端點。

**Why this priority**: 企業環境可能需要自建 Kroki，但對個人開發者不是必要功能。

**Independent Test**: 設定 `LIVEDOC_KROKI_URL=https://kroki.chuntech.org` 環境變數，驗證圖表渲染使用該端點。

**Acceptance Scenarios**:

1. **Given** 環境變數 LIVEDOC_KROKI_URL 設為自訂端點, **When** 存取圖表 URL, **Then** 使用該端點渲染
2. **Given** 專案根目錄有 .livedocrc 配置檔, **When** 伺服器啟動, **Then** 讀取該配置檔中的 kroki.url 設定
3. **Given** 未設定任何 Kroki 端點, **When** 伺服器啟動, **Then** 使用預設端點 https://kroki.io

---

### User Story 5 - Multiple Diagram Formats (Priority: P2)

作為一位技術文件撰寫者，我希望支援 25+ 種圖表格式，讓我能選擇最適合的工具。

**Why this priority**: 多格式支援增加工具的通用性，但核心是先能正常運作。

**Independent Test**: 建立 .puml, .mmd, .d2, .nomnoml 等不同格式檔案，驗證全部能正確渲染。

**Acceptance Scenarios**:

1. **Given** diagrams/class.nomnoml 檔案, **When** 存取對應 URL, **Then** 返回 Nomnoml 渲染的 SVG
2. **Given** diagrams/flow.mmd (Mermaid) 檔案, **When** 存取對應 URL, **Then** 返回 Mermaid 渲染的 SVG
3. **Given** diagrams/arch.d2 檔案, **When** 存取對應 URL, **Then** 返回 D2 渲染的 SVG

---

### User Story 6 - Error Visualization (Priority: P2)

作為一位開發者，當圖表語法錯誤時，我希望看到清楚的錯誤圖片而非破圖。

**Why this priority**: 好的錯誤處理提升開發體驗，但不是核心功能。

**Independent Test**: 建立語法錯誤的 .puml 檔案，驗證返回包含錯誤訊息的圖片。

**Acceptance Scenarios**:

1. **Given** 語法錯誤的 diagrams/bad.puml, **When** 存取該 URL, **Then** 返回 HTTP 200 + 包含錯誤訊息的 PNG 圖片
2. **Given** 不存在的檔案路徑, **When** 存取該 URL, **Then** 返回 HTTP 200 + "File not found" 錯誤圖片
3. **Given** 不支援的檔案格式, **When** 存取該 URL, **Then** 返回 HTTP 200 + "Unsupported format" 錯誤圖片

---

### User Story 7 - SpecKit + Claude Code Integration (Priority: P1)

作為一位使用 SpecKit 的開發者，我希望 Claude Code 能根據 Constitution 規則自動提醒我畫架構圖，並在適當時機檢查圖表是否需要更新。

**Why this priority**: 這是讓 LiveDoc 真正融入開發流程的關鍵，而非只是一個獨立工具。

**Independent Test**: 設定 Constitution 規則後執行 `/speckit.plan`，驗證 Claude Code 會提醒或自動建立架構圖。

**Acceptance Scenarios**:

1. **Given** Constitution 定義「plan 階段需產出系統架構圖」, **When** 執行 `/speckit.plan`, **Then** Claude Code 會在 plan.md 中規劃架構圖任務
2. **Given** specs/{feature}/diagrams/ 目錄不存在, **When** Claude Code 需要建立圖表, **Then** 自動建立目錄並產生圖表檔案
3. **Given** 已有架構圖但程式碼結構改變, **When** 執行 `/speckit.implement`, **Then** Hook 提醒檢查架構圖是否需更新

---

### Edge Cases

- 當 Kroki 服務不可用時，立即返回錯誤圖片（不重試），顯示具體錯誤如 "Connection refused: https://kroki.io" 或 "Timeout: kroki.chuntech.org"
- 當檔案路徑包含 `../` 等路徑穿越攻擊，拒絕存取並返回錯誤圖片
- 當同時有大量請求時，系統應正常處理（Rate limiting 可選）
- 當圖表檔案編碼非 UTF-8 時，嘗試自動偵測或返回編碼錯誤圖片
- 當圖表檔案超過 1MB 時，返回 "File too large" 錯誤圖片

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST 提供 CLI 工具，可透過 `npm install -g` 全域安裝
- **FR-002**: System MUST 支援 `livedoc start` 指令啟動 HTTP 伺服器
- **FR-003**: System MUST 支援 `livedoc --version` 顯示版本號
- **FR-004**: System MUST 支援 `livedoc --help` 顯示使用說明
- **FR-005**: System MUST 在收到圖表 URL 請求時，讀取本地檔案並透過 Kroki 渲染
- **FR-006**: System MUST 對所有動態圖表格式返回 SVG 格式（Content-Type: image/svg+xml）
- **FR-007**: System MUST 對靜態圖片（.png, .jpg, .gif, .svg）直接返回原檔
- **FR-008**: System MUST 在任何錯誤情況下返回 HTTP 200 + 錯誤圖片 PNG
- **FR-009**: System MUST 支援透過環境變數 LIVEDOC_KROKI_URL 設定 Kroki 端點（最高優先）
- **FR-010**: System MUST 支援透過 .livedocrc 或 livedoc.config.json 設定專案配置（次優先，低於環境變數）
- **FR-011**: System MUST 防止路徑穿越攻擊（禁止 ../ 等）
- **FR-012**: System MUST 支援 25+ 種 Kroki 支援的圖表格式
- **FR-013**: System MUST 自動偵測可用 port（當預設 port 被佔用時）
- **FR-014**: System MUST 在啟動時顯示可存取的 base URL
- **FR-015**: System MUST 提供 Constitution 範本片段，定義架構圖相關規則（何時畫、畫什麼、放哪裡）
- **FR-016**: System MUST 提供 Claude Code Hook 範本，在 SpecKit 流程中檢查/提醒架構圖更新
- **FR-017**: System MUST 支援零初始化，`livedoc start` 無需任何前置配置即可運作

### Key Entities

- **Diagram Source**: 圖表源檔案，包含路徑、格式、內容
- **Render Request**: 渲染請求，包含請求路徑、檔案類型、Kroki 端點
- **Render Result**: 渲染結果，包含圖片內容、Content-Type、是否錯誤
- **Configuration**: 配置，包含 port、Kroki URL、支援格式列表

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者可在 5 分鐘內完成安裝並成功渲染第一張圖表
- **SC-002**: `livedoc start` 指令在 3 秒內啟動伺服器
- **SC-003**: 圖表請求到返回圖片的總時間在 2 秒內（本地檔案 + 網路延遲）
- **SC-004**: 系統能處理 50 個同時請求而不崩潰
- **SC-005**: 錯誤情況下使用者能在 1 秒內看到清楚的錯誤圖片
- **SC-006**: 支援的圖表格式涵蓋 Kroki 所有主流格式（PlantUML, Mermaid, D2, Nomnoml 等）

## Assumptions

- 使用者已安裝 Node.js 18+
- 使用者有網路連線可存取 Kroki 服務（除非自建）
- 圖表源檔案使用 UTF-8 編碼
- 使用者在專案根目錄執行 livedoc start
- Kroki 預設端點 https://kroki.io 穩定可用

## Future Considerations

以下功能不在本次範圍，但可作為未來擴展：

1. **Health Dashboard Plugin** - 讀取系統資料產生健康狀態圖（如 CPU、記憶體、服務狀態）
2. **Watch Mode** - 檔案變更時自動重新渲染並通知瀏覽器刷新
3. **Caching Layer** - 快取已渲染的圖片，減少 Kroki API 呼叫
4. **Docker Image** - 提供官方 Docker 映像檔，一行啟動
5. **VS Code Extension** - 直接在編輯器內預覽 LiveDoc 圖片
