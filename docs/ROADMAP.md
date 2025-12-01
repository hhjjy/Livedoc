# LiveDoc 開發路線圖

## 版本規劃

### v0.1 MVP ✅ (已完成 - 2025-10-01)

**目標：** 驗證 Markdown 可以透過 HTTP Server 顯示即時生成的圖片

**完成功能：**
- ✅ Static Handler - PNG/JPG/GIF 靜態圖片服務
- ✅ Dynamic Handler - PlantUML (.puml) / Mermaid (.mmd) via Kroki
- ✅ 錯誤視覺化 - 永遠返回 200 + image/png（含錯誤圖片）
- ✅ CLI 命令 - init / start / list
- ✅ 配置管理 - ~/.livedoc/config.json
- ✅ 日誌系統 - ~/.livedoc/logs/YYYY-MM-DD.log
- ✅ Demo 專案 - 完整測試範例

**技術架構：**
```
URL: /{project}/livedoc/{static|dynamic}/{filename}

目錄結構（固定）：
livedoc/
├── static/     # 靜態圖片
└── dynamic/    # 動態圖表
```

**Git Commits:**
```
436cbe8 feat: implement phase 1 - core utilities and infrastructure
a5c3fd6 feat: implement phase 2 - error handling and MIME types
5ac4245 feat: implement phase 3 - request handlers
75c7c5c feat: implement phase 4 - server routing and CLI
8eabea8 fix: create livedoc directory structure on init
5e1989d fix: correct listProjects return format and add demo project
0442cec docs: add documentation and known issues
```

**文檔：**
- [MVP 規格](v0.1-mvp/readme.md)
- [源碼說明](../src/README.md)
- [已知問題](../KNOWN_ISSUES.md)

---

### v0.2 (暫緩)

原計劃為 Plugin 基礎，改為先做 v0.3

---

### v0.3 子資料夾支援 🎯 (下一版)

**目標：** 支援任意子資料夾結構，改用副檔名判斷處理方式

**核心改變：**
```
舊 URL: /{project}/livedoc/{static|dynamic}/{filename}
新 URL: /{project}/livedoc/{任意路徑}/{filename}

判斷邏輯：
- 舊：根據 URL 路徑（static/dynamic）
- 新：根據副檔名（.png/.jpg/.puml/.mmd）
```

**目錄結構（彈性）：**
```
livedoc/                    # 固定根目錄
├── architecture/           # 使用者自由組織
│   ├── system.puml
│   ├── database.puml
│   └── logo.png
├── api/
│   ├── flow.mmd
│   └── screenshot.jpg
└── images/
    └── banner.gif
```

**實作任務：**
- [ ] 更新 Router - 匹配完整路徑而非固定層級
- [ ] 更新 Static Handler - 接受完整路徑
- [ ] 更新 Dynamic Handler - 接受完整路徑
- [ ] 添加副檔名判斷邏輯到 Router
- [ ] 向後兼容測試 - 確保舊 URL 仍可用
- [ ] 更新 init 命令 - 不再創建 static/dynamic
- [ ] 更新文檔和 Demo

**向後兼容：**
```
# 舊 URL 繼續支援
http://localhost:3000/demo/livedoc/static/test.png      ✅

# 新 URL 也支援
http://localhost:3000/demo/livedoc/architecture/test.png ✅
```

**預計時間：** 1-2 週

---

### v0.4 Plugin 系統 🚧 (未來)

**目標：** 支援自定義腳本生成動態圖表

**新增支援：**
- `.py` (Python 腳本)
- `.js` (Node.js 腳本)

**Plugin 流程：**
```
1. 執行插件 (.py 或 .js)
2. 捕捉 stdout 輸出（JSON 格式）
3. 解析 JSON 取得模板類型
4. 載入並執行對應模板
5. 返回渲染後的 PNG
```

**範例：**
```python
# monitoring/cpu.py
import json
print(json.dumps({
    "type": "gauge",
    "data": {"value": 75, "max": 100}
}))
```

**任務：**
- [ ] Plugin Handler - 執行 .py/.js，捕捉 stdout
- [ ] 模板系統 - builtin/ 和 custom/
- [ ] 實作 3 個基本模板（bar-chart, gauge, table）
- [ ] 測試介面 - 完整流程測試

**預計時間：** 2-3 週

---

### v1.0 完整版 💭 (遠期)

**可能的優化：**
- 圖片快取機制（減少重複編譯）
- SQLite 快取（可選）
- 背景預生成（如需要）
- 支援更多圖表類型
- 性能優化

**原則：** 先做可用，再考慮優化

---

## 版本歷史

| 版本 | 狀態 | 發布日期 | 重點功能 |
|------|------|---------|---------|
| v0.1 | ✅ 完成 | 2025-10-01 | MVP - 靜態圖片 + PlantUML/Mermaid |
| v0.3 | 🎯 計劃中 | TBD | 子資料夾支援 + 副檔名判斷 |
| v0.4 | 🚧 未來 | TBD | Plugin 系統 |
| v1.0 | 💭 遠期 | TBD | 性能優化 + 快取 |

---

## 設計原則

1. **簡單、可用、可測** - 先做基本功能，再考慮優化
2. **向後兼容** - 新版本不破壞舊版 URL
3. **錯誤視覺化** - 永遠返回圖片，不返回 HTTP 錯誤碼
4. **文件優先** - 每個版本都有清楚的文檔
5. **固定根目錄** - `livedoc/` 永遠是固定位置

---

**更新時間：** 2025-10-01
