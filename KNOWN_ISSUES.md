# Known Issues

## 🐛 特定 Markdown 編輯器加載超時問題

### 問題描述
在某些 Markdown 編輯器中打開包含動態圖表的 README.md 時：
- **現象：** 文件加載卡住，動態圖表不顯示
- **範圍：** 僅影響特定編輯器，其他編輯器正常
- **確認：** 瀏覽器直接訪問圖片 URL 正常，服務器響應快速（< 0.5秒）

**復現步驟：**
1. 打開 `demo/README.md`（包含動態圖表 URL）
2. 編輯器加載卡住
3. 動態圖表最終不顯示或超時

**驗證測試（均正常）：**
```bash
# 服務器響應快速
$ time curl http://localhost:3000/demo/livedoc/dynamic/demo.puml
→ 0.34 秒 ✅

$ time curl http://localhost:3000/demo/livedoc/dynamic/flow.mmd
→ 0.49 秒 ✅

# 瀏覽器直接訪問圖片
$ open http://localhost:3000/demo/livedoc/dynamic/demo.puml
→ 正常顯示 ✅
```

### 根因分析
**編輯器圖片加載超時設置過短：**
- 動態圖表需要 Kroki 編譯（0.3-0.5秒）
- 某些編輯器的圖片加載超時可能 < 500ms
- 靜態圖片幾乎即時返回，不會觸發超時
- 換編輯器後問題消失，證實是編輯器配置問題

### 解決方案

**用戶端：**
1. **換用支援較長超時的編輯器** ✅ 已驗證有效
2. **使用瀏覽器預覽** - 直接用瀏覽器渲染 Markdown
3. **註釋掉動態圖表** - 僅在需要時取消註釋查看

**服務器端（未來優化）：**
1. **添加圖片快取** - 減少重複編譯時間至 < 10ms
2. **優化 Kroki 請求** - 使用連接池、HTTP Keep-Alive
3. **提供預編譯模式** - `livedoc build` 將 .puml/.mmd 預先編譯成 PNG

### 編輯器測試狀態

| 編輯器 | 狀態 | 備註 |
|--------|------|------|
| 瀏覽器（Chrome/Safari/Firefox） | ✅ 正常 | 直接訪問圖片 URL |
| **VS Code - Markdown Preview** | ✅ 正常 | 內建預覽，支援動態圖表 |
| **VS Code - Markdown 增強預覽** | ❌ 超時 | 動態圖表不顯示，疑似超時設置過短 |
| Obsidian | ⏳ 待測試 | - |
| Typora | ⏳ 待測試 | - |
| Mark Text | ⏳ 待測試 | - |

---

**記錄時間：** 2025-10-01
**影響範圍：** 部分 Markdown 編輯器預覽
**嚴重程度：** 低（可切換編輯器解決，不影響實際功能）
