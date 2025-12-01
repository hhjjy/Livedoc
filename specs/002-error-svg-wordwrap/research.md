# Research: SVG 換行修正與 CLI 使用教學

**Feature**: 002-error-svg-wordwrap
**Date**: 2025-11-27

## Research Tasks

### 1. SVG Text Wrapping Best Practices

**Decision**: 實作 `breakLongWord` 函式，在自然斷點或強制位置斷行

**Rationale**:
- SVG `<text>` 元素不支援自動換行，必須手動計算並產生多個 `<text>` 元素
- 使用等寬字體（monospace）讓字元寬度可預測，55 字元約等於 550px
- 優先在自然斷點（`/`、`-`、`_`、`.`）斷行，提升可讀性
- 無自然斷點時，強制在 maxChars 處斷行確保不超出邊界

**Alternatives Considered**:
1. ~~CSS word-wrap~~: SVG 不支援 CSS word-wrap 屬性
2. ~~foreignObject + HTML~~: 瀏覽器支援不一致，Markdown 編輯器可能無法正確渲染
3. ~~縮小字體~~: 會影響可讀性，不符合錯誤訊息需清晰的原則

### 2. CLI Guide Command Pattern

**Decision**: 新增 `guide.js` 指令，輸出純文字格式的教學內容

**Rationale**:
- 符合 Commander.js 的指令架構模式
- 純文字輸出在各種終端機都能正確顯示
- 使用 ANSI 顏色增強可讀性（可選）

**Alternatives Considered**:
1. ~~開啟瀏覽器顯示 HTML~~: 增加複雜度，部分環境無法開啟瀏覽器
2. ~~使用 man page~~: 需要額外安裝步驟
3. ~~輸出 Markdown~~: 終端機無法渲染 Markdown 格式

### 3. Text Break Point Strategy

**Decision**: 採用「優先自然斷點 → 強制斷行」策略

**Algorithm**:
```
1. 若字串 <= maxChars，直接返回
2. 從 maxChars-1 向前搜尋自然斷點（/, -, _, .）
3. 搜尋範圍：maxChars/2 到 maxChars-1
4. 找到斷點：在斷點後斷行（包含斷點字元）
5. 未找到：強制在 maxChars 處斷行
6. 遞迴處理剩餘字串
```

**Rationale**:
- 路徑通常有 `/` 分隔，在此處斷行最自然
- 搜尋範圍限制在 50%-100% 避免產生過短的行
- 強制斷行確保無斷點的字串也能正確處理

## Resolved Unknowns

| Item | Resolution |
|------|------------|
| SVG 換行方式 | 使用多個 `<text>` 元素，手動計算換行 |
| 斷行策略 | 優先自然斷點，否則強制斷行 |
| CLI 輸出格式 | 純文字 + 可選 ANSI 顏色 |
| 教學內容結構 | 三段式：基本用法 → SpecKit 整合 → Claude Code 流程 |

## Dependencies Confirmed

| Dependency | Version | Purpose |
|------------|---------|---------|
| commander | ^11.0.0 | CLI 指令註冊 |
| jest | ^29.0.0 | 單元測試 |

## Next Steps

1. Phase 1: 無需 data-model.md（無資料實體）
2. Phase 1: 無需 contracts/（無 API 端點）
3. Phase 1: 產生 quickstart.md
4. 進入 /speckit.tasks 產生任務清單
