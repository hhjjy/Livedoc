# 📋 LiveDoc v8 - 動態文檔圖表系統 20251016
7.00 KB •313 lines
•
Formatting may be inconsistent from source
# 📋 LiveDoc v8 - 動態文檔圖表系統

## 🎯 核心理念

**讓 Markdown 圖表永遠最新，使用標準語法。**

**核心價值：**
1. **文檔永不過時** - 圖表即時生成
2. **零學習成本** - 標準 Markdown 語法
3. **錯誤視覺化** - 錯誤也返回圖片

---

## 🏗️ 系統架構

```
Markdown 請求圖片
    ↓
LiveDoc Server (Express)
    ↓
Router 判斷副檔名
    ├─ .png/.jpg/.gif → Static Handler
    ├─ .puml/.mmd → Dynamic Handler (Kroki)
    └─ .py/.js → Plugin Handler (stdin/stdout)
        ↓
    查找對應模板
        ├─ templates/custom/
        └─ templates/builtin/
    ↓
返回 PNG 圖片（成功或錯誤圖片）
```

**核心原則：根據副檔名選擇處理方式，不依賴資料夾結構**

---

## 📂 專案結構

### 自動建立（livedoc init）
```
my_project/
└── livedoc/
    ├── templates/              # 固定位置
    │   ├── builtin/            # 內建模板
    │   │   ├── bar-chart.js
    │   │   └── status-board.js
    │   └── custom/             # 使用者自定義模板
    │       └── gauge.js
    ├── config.json             # 設定檔
    └── livedoc.log            # 日誌
```

### 使用者自由組織（彈性）
使用者可以自由建立資料夾結構：
```
livedoc/
├── architecture/               # 按業務邏輯分類
│   ├── system.puml            # .puml → Dynamic Handler
│   ├── database.puml
│   └── logo.png               # .png → Static Handler
│
├── api/
│   ├── status.py              # .py → Plugin Handler
│   ├── flow.mmd               # .mmd → Dynamic Handler
│   └── screenshot.jpg         # .jpg → Static Handler
│
├── monitoring/
│   ├── cpu.js                 # .js → Plugin Handler
│   └── memory.py
│
└── images/
    ├── banner.gif             # .gif → Static Handler
    └── screenshot.png
```

**使用者可以建立任何資料夾結構來組織檔案！**

---

## 🌐 URL 路徑規範

### 標準格式
```
http://localhost:3000/{project}/livedoc/{path/to/file}
```

### 使用範例
```markdown
# 架構圖
![系統架構](http://localhost:3000/my_project/livedoc/architecture/system.puml)
![資料庫設計](http://localhost:3000/my_project/livedoc/architecture/database.puml)

# API 文檔
![API 狀態](http://localhost:3000/my_project/livedoc/api/status.py)
![API 流程](http://localhost:3000/my_project/livedoc/api/flow.mmd)

# 系統監控
![CPU 使用率](http://localhost:3000/my_project/livedoc/monitoring/cpu.js)
![記憶體狀態](http://localhost:3000/my_project/livedoc/monitoring/memory.py)
```

---

## 🔄 處理邏輯

### Router 判斷規則

根據副檔名決定使用哪個 Handler：

**Static Handler（靜態圖片）：**
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg` → 直接返回原始檔案

**Dynamic Handler（動態圖表 via Kroki）v0.3 已支援：**
- `.puml` → PlantUML 圖表
- `.mmd` → Mermaid 圖表
- `.d2` → D2 圖表
- `.erd` → Entity Relationship 圖表
- `.bpmn` → BPMN 流程圖
- `.nomnoml` → Nomnoml 類別圖
- `.blockdiag`, `.seqdiag`, `.actdiag`, `.nwdiag`, `.packetdiag`, `.rackdiag` → *Diag 系列圖表
- `.c4plantuml` → C4 架構圖
- `.dbml` → Database Markup
- `.ditaa` → ASCII 藝術圖
- `.excalidraw` → Excalidraw 手繪圖
- `.graphviz`, `.dot` → Graphviz 圖表
- `.pikchr` → Pikchr 圖表
- `.structurizr` → Structurizr 架構圖
- `.svgbob` → SVG Bob ASCII 圖
- `.umlet` → UMLet 圖表
- `.vega`, `.vegalite` → Vega/VegaLite 視覺化圖表
- `.wavedrom` → WaveDrom 波形圖
- `.wireviz` → WireViz 線路圖

**Plugin Handler（未實作）：**
- `.py`, `.js` → 執行腳本生成圖表

- 其他 → Error Handler

### Static Handler
- 讀取檔案
- 返回原始格式（PNG/JPG/GIF/SVG）
- 設定對應的 Content-Type

### Dynamic Handler (v0.3 已更新)
- 讀取各種圖表檔案（25+ 種格式）
- 傳送給 Kroki API
- 返回編譯後的 SVG（向量圖，更好的相容性）
- 處理 Kroki 錯誤（400 + text/plain）
- Content-Type: image/svg+xml

### Plugin Handler
- 執行 `.py` 或 `.js` 腳本
- 捕捉 stdout 輸出（JSON 格式）
- 解析 JSON 取得模板類型
- 載入並執行對應模板
- 返回渲染後的 PNG

---

## 🔌 Plugin 系統

### 執行流程（stdin/stdout）

```
1. LiveDoc 執行插件
   ↓
2. 插件輸出 JSON 到 stdout
   {
     "type": "bar-chart",
     "data": {...}
   }
   ↓
3. LiveDoc 解析 JSON
   ↓
4. 查找對應模板
   - templates/custom/bar-chart.js
   - templates/builtin/bar-chart.js
   ↓
5. 執行模板渲染
   ↓
6. 返回 PNG 圖片
```

### Plugin 範例

```python
#!/usr/bin/env python3
# api-status.py

import json
import requests

response = requests.get('https://api.example.com/status')
data = response.json()

print(json.dumps({
    "type": "status-board",
    "data": {
        "services": [
            {"name": "API-1", "status": "ok", "time": 45},
            {"name": "API-2", "status": "error", "time": 0}
        ]
    }
}))
```

### Template 範例

```javascript
// templates/builtin/status-board.js

const { createCanvas } = require('canvas');

module.exports = async (data, options) => {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');
    
    // 繪製狀態板邏輯
    // ...
    
    return canvas.toBuffer('image/png');
};
```

---

## 🧪 測試系統

### 測試插件（完整流程）
```
http://localhost:3000/my_project/livedoc/api/status.py?test=true
```

顯示：
- ✅ 插件 stdout 輸出的 JSON
- ✅ 使用的模板名稱
- ✅ 最終渲染的圖片

### 測試模板（只測渲染）
```
http://localhost:3000/test?template=status-board
```

功能：
- ✅ 手動輸入 JSON
- ✅ 即時預覽渲染結果
- ✅ 下載生成的圖片

---

## 📋 內建模板列表（待定義）

**基礎圖表：**
- `bar-chart` - 長條圖
- `line-chart` - 折線圖
- `pie-chart` - 圓餅圖

**進階圖表：**
- `status-board` - 狀態板
- `gauge` - 儀表盤
- `table` - 資料表格

**每個模板的資料格式待文檔化**

---

## ❌ 錯誤處理

**永遠返回圖片：**
- 成功 → 返回生成的圖片
- 失敗 → 返回錯誤圖片（600x400 PNG）

**錯誤類型：**
- 檔案不存在
- 插件執行失敗
- JSON 格式錯誤
- 模板不存在
- 編譯失敗

---

## 💻 CLI 指令

```bash
livedoc init              # 初始化專案
livedoc start             # 啟動服務（MVP 已完成）
livedoc list              # 列出專案（MVP 已完成）
livedoc test [file]       # 測試單一檔案
livedoc test --all        # 測試所有檔案
```

---

## 🎯 開發路線圖

### v0.1 MVP ✅（已完成）
- Static Handler (.png/.jpg/.gif)
- Dynamic Handler (.puml/.mmd via Kroki)
- 錯誤視覺化
- 基本 CLI（init, start, list）

### v0.2 (暫緩)
原計劃為 Plugin 基礎，改為先做 v0.3

### v0.3 自由路徑 + SVG + 多圖表 ✅（已完成 2024-10-30）
**目標：自由目錄結構 + SVG 格式 + 擴展 Kroki 圖表支援**

**核心改變：**
1. **自由路徑** - 不限制 static/dynamic，根據副檔名判斷
2. **SVG 優先** - Kroki 改用 SVG 格式（向量圖、覆蓋率高）
3. **多圖表** - 支援 25+ 種 Kroki 圖表類型

**完成任務：**
1. [x] Router 改用副檔名判斷 + 支援任意子資料夾
2. [x] Kroki 改用 SVG 格式（Content-Type: image/svg+xml）
3. [x] 擴展圖表支援（D2, ERD, BPMN, Nomnoml, WaveDrom, VegaLite 等 25+ 種）
4. [x] 向後兼容測試 - 確認舊的 static/dynamic 路徑仍可使用

**實際完成時間：** 2 天

### v0.4 Plugin 系統 🚧（下一階段）
- 增加更多內建模板
- 文檔化每個模板的資料格式
- 優化渲染效能

### v1.0 完整版 💭（未來）
- SQLite 快取（可選）
- 背景預生成（如需要）
- Daemon 架構（如需要）

---

## 🎯 總結

**簡化後的核心：**
1. **根據副檔名判斷處理方式**（不依賴資料夾）
2. **Plugin = stdin/stdout + 模板渲染**
3. **先做可用，再考慮優化**
4. **測試系統讓開發快速驗證**

**移除的複雜設計：**
- ❌ Daemon 架構（太複雜，暫不需要）
- ❌ Timer 定時產圖（先做即時版）
- ❌ 複雜的組件列表（簡化）
- ❌ /static/ /dynamic/ 資料夾分類（改用副檔名）

**設計原則：簡單、可用、可測**