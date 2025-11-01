# LiveDoc

讓 Markdown 文檔中的圖片永遠保持最新。

## 安裝

```bash
# 從 npm 安裝（推薦）
npm install -g livedoc-server

# 或從源碼安裝
npm install -g .
```

## 快速開始

```bash
# 1. 啟動 Kroki 服務（用於 PlantUML/Mermaid 編譯）
docker-compose up -d

# 2. 初始化專案
livedoc init my-project

# 3. 創建圖片目錄
mkdir -p livedoc/static livedoc/dynamic
cp logo.png livedoc/static/
cp diagram.puml livedoc/dynamic/

# 4. 啟動服務器
livedoc start

# 5. 在 Markdown 中使用
# ![Logo](http://localhost:3000/my-project/livedoc/static/logo.png)
# ![Diagram](http://localhost:3000/my-project/livedoc/dynamic/diagram.puml)
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
