# Quickstart: SVG 換行修正與 CLI 使用教學

## 修改檔案清單

### 1. SVG 換行修正

**檔案**: `src/utils/error-image.js`

**變更**:
- 新增 `breakLongWord(word, maxChars)` 函式
- 修改 `wrapText(text, maxChars)` 函式支援長字串斷行

**演算法**:
```javascript
// breakLongWord: 在自然斷點或強制位置斷行
function breakLongWord(word, maxChars) {
  const breakChars = ['/', '-', '_', '.'];
  // 1. 從 maxChars-1 向前搜尋斷點
  // 2. 搜尋範圍：maxChars/2 到 maxChars-1
  // 3. 找到斷點：在斷點後斷行
  // 4. 未找到：強制在 maxChars 處斷行
}
```

### 2. CLI Guide 指令

**新增檔案**: `src/cli/commands/guide.js`

**功能**: 輸出 LiveDoc + SpecKit + Claude Code 整合教學

**教學內容結構**:
1. **LiveDoc 基本用法**
   - 啟動：`livedoc start`
   - URL 格式：`http://localhost:3000/{path/to/diagram}`
   - 支援格式：PlantUML, Mermaid, D2 等 25+ 種

2. **SpecKit 整合**
   - 目錄結構：`specs/{feature}/diagrams/`
   - 圖表命名慣例
   - Markdown 嵌入範例

3. **Claude Code 工作流程**
   - 圖表驅動開發步驟
   - 即時預覽循環
   - 最佳實踐

**修改檔案**: `src/cli/index.js`
- 註冊 `guide` 指令

### 3. 測試更新

**修改檔案**: `tests/unit/error-image.test.js`

**新增測試案例**:
- 長路徑換行測試
- 自然斷點測試
- 強制斷行測試
- URL 換行測試
- 內容完整性測試

## 驗證步驟

```bash
# 1. 執行測試
npm test

# 2. 驗證 SVG 換行
node -e "
const { fileNotFoundError } = require('./src/utils/error-image');
const svg = fileNotFoundError('specs/001-feature-name/diagrams/very-long-architecture-flow.puml');
console.log(svg);
"

# 3. 驗證 guide 指令
node bin/livedoc.js guide
```

## 實作順序

1. 修改 `error-image.js` - 實作 `breakLongWord` 和更新 `wrapText`
2. 新增測試案例到 `error-image.test.js`
3. 執行測試確認通過
4. 新增 `guide.js` 指令
5. 註冊到 CLI
6. 手動驗證 guide 輸出
