# 錯誤處理測試結果

## 測試日期
2025-10-01

## 🎯 最終推薦方案：Kroki (自架)

### ✅ 完美解決方案！

**Kroki** 是一個統一的圖表生成服務，支援 PlantUML、Mermaid、GraphViz 等 20+ 種格式。

**測試結果**：
- ✅ PlantUML 正確: `200` + `image/png`
- ✅ PlantUML 錯誤: `400` + `text/plain` + 錯誤訊息
- ✅ Mermaid 正確: `200` + `image/png`
- ✅ Mermaid 錯誤: `400` + `text/plain` + 錯誤訊息

**關鍵特性**：
- 錯誤時返回 `text/plain` 而非圖片
- 可透過 HTTP status code 檢測錯誤
- 詳細的錯誤訊息（包含行數和錯誤位置）

**Docker Compose 部署**：
```yaml
version: "3"
services:
  kroki:
    image: yuzutech/kroki
    ports:
      - "8000:8000"
    environment:
      - KROKI_MERMAID_HOST=mermaid
  mermaid:
    image: yuzutech/kroki-mermaid
```

**實作範例**：
```javascript
const zlib = require('zlib');

function encodeKroki(source) {
  const compressed = zlib.deflateSync(source);
  return compressed.toString('base64url');
}

async function generateDiagram(content, type) {
  const encoded = encodeKroki(content);
  const url = `http://localhost:8000/${type}/png/${encoded}`;

  const res = await fetch(url);

  if (res.status === 400 && res.headers.get('content-type') === 'text/plain') {
    // ✅ 語法錯誤！返回自訂錯誤圖
    const errorMsg = await res.text();
    return generateCustomErrorImage(errorMsg);
  }

  // ✅ 成功！返回圖片
  return await res.buffer();
}
```

**優點**：
1. ✅ 統一 API - PlantUML + Mermaid 一致處理
2. ✅ 可靠的錯誤檢測 - HTTP 400 + text/plain
3. ✅ 不需要瀏覽器環境
4. ✅ 不需要本地 Java/Puppeteer
5. ✅ 完全可控 - 自架伺服器
6. ✅ 支援 20+ 格式 - 未來可擴展

---

## 其他測試方案（參考）

### 方案 A: PlantUML 直接調用 Java + `-failfast2`

**測試檔案**: `test-plantuml-java-direct.js`

**結果**: ✅ 可行但僅支援 PlantUML
- 正確語法: Exit code = 0
- 錯誤語法: Exit code = 200 + stderr 錯誤訊息

**缺點**:
- 需要本地安裝 Java
- 需要 plantuml.jar
- 無法處理 Mermaid

### 方案 B: Mermaid 原生 parse()

**結果**: ❌ 需要瀏覽器 DOM 環境
- `mermaid.parse()` 依賴 DOMPurify
- 無法在純 Node.js 環境執行

### 方案 C: 接受原生錯誤圖

**結果**: ⚠️ PlantUML/Mermaid 自己的錯誤圖
- 無法統一錯誤格式
- 不是最佳用戶體驗

---

## 最終實作方案

### 採用 Kroki！

**錯誤處理策略**:
```
1. 檔案不存在           → 自訂錯誤圖
2. 不支援格式           → 自訂錯誤圖
3. PlantUML 語法錯誤    → 自訂錯誤圖 ✅ (Kroki 返回 400 + text/plain)
4. Mermaid 語法錯誤     → 自訂錯誤圖 ✅ (Kroki 返回 400 + text/plain)
5. 讀取權限錯誤         → 自訂錯誤圖
6. 伺服器錯誤           → 自訂錯誤圖
```

### Handler 實作

```javascript
async function handleDiagram(fileContent, type) {
  const encoded = encodeKroki(fileContent);
  const url = `http://localhost:8000/${type}/png/${encoded}`;

  const res = await fetch(url);

  // 檢查錯誤（關鍵：status 400 + text/plain）
  if (res.status === 400 && res.headers.get('content-type') === 'text/plain') {
    const errorMsg = await res.text();
    return generateCustomErrorImage(errorMsg);
  }

  // 成功返回圖片
  return await res.buffer();
}
```

## 依賴

- Docker / Docker Compose
- Kroki (yuzutech/kroki + yuzutech/kroki-mermaid)

## 測試檔案

- `docker-compose.yml` - Kroki 部署配置

## 下一步

開始實作 MVP，使用 Kroki 統一處理 PlantUML + Mermaid！
