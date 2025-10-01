# Error Handling Test

## 🎯 結論：使用 Kroki

**快速摘要**：
- ✅ 採用 Kroki 自架服務
- ✅ 統一處理 PlantUML + Mermaid
- ✅ 錯誤時返回 `400` + `text/plain`（而非圖片）
- ✅ 可完全控制錯誤圖片格式

## 檔案說明

- **RESULTS.md** ← 完整測試結果和實作細節（看這個！）
- **README.md** ← 本檔案，快速摘要
- **docker-compose.yml** - Kroki 部署配置
- **test-plantuml-java-direct.js** - 其他方案參考

## 快速啟動

```bash
docker-compose up -d
```

**詳細資訊請看 RESULTS.md**
