# LiveDoc

讓 Markdown 文檔中的圖片永遠保持最新。

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動 Kroki 服務
docker-compose up -d

# 3. 啟動服務器
node bin/livedoc.js start

# 4. 測試 Demo
open http://localhost:3000/demo/livedoc/static/test.png
```

## 支援格式

- **靜態圖片**: PNG, JPG, GIF, SVG
- **動態圖表**: PlantUML (.puml), Mermaid (.mmd)

## 版本資訊

- **當前版本**: v0.1 MVP ✅
- **下一版本**: v0.3 (子資料夾支援)
- [完整路線圖](docs/ROADMAP.md)

## 文檔

- [開發路線圖](docs/ROADMAP.md)
- [v0.1 MVP 規格](docs/v0.1-mvp/readme.md)
- [源碼說明](src/README.md)
- [已知問題](KNOWN_ISSUES.md)

## 目錄結構

```
livedoc/
├── src/              # 源碼
├── demo/             # 範例專案
├── docs/             # 文檔
│   ├── ROADMAP.md
│   └── v0.1-mvp/
└── bin/              # CLI 入口
```
