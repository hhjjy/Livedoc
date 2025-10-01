根據 MVP 文檔，我建議以下實作步驟：

  建議開發順序

  階段 1：基礎架構（最重要）

  # 1. 先建立基本專案結構
  livedoc/
  ├── package.json          # 定義依賴和腳本
  ├── bin/
  │   └── livedoc.js       # CLI 入口
  └── src/
      ├── utils/
      │   ├── config.js    # 讀寫 ~/.livedoc/config.json
      │   ├── logger.js    # 日誌系統
      │   └── mime-types.js # Content-Type 判斷
      └── server/
          └── app.js       # Express 伺服器基礎

  階段 2：靜態圖片支援（最簡單，先驗證）

  # 2. 實作 Static Handler
  src/server/handlers/
  └── static.js            # 處理 PNG/JPG/GIF

  為什麼先做這個？
  - 最簡單，不需要編譯
  - 可以快速驗證 URL routing 和 Content-Type 邏輯
  - 你已經有 experiments/md_render_validation/server.js 可參考

  階段 3：錯誤處理（核心原則）

  # 3. 實作 Error Handler
  src/utils/
  └── error-handler.js     # 生成錯誤圖片（PNG）

  為什麼這麼早做？
  - 這是 MVP 的核心原則：「永遠返回圖片」
  - Static Handler 失敗時需要它
  - 可以用 Canvas 套件生成簡單的錯誤圖片

  階段 4：CLI 指令

  # 4. 實作基本 CLI
  livedoc init             # 註冊專案到 ~/.livedoc/config.json
  livedoc start            # 啟動伺服器
  livedoc list             # 列出已註冊專案

  階段 5：動態圖片（PlantUML/Mermaid）

  # 5. 最後實作 Dynamic Handlers
  src/server/handlers/
  ├── plantuml.js
  └── mermaid.js

  具體實作步驟

  Step 1: 初始化專案

  cd src
  npm init -y
  npm install express commander node-plantuml @mermaid-js/mermaid-cli canvas mime-types

  Step 2: 建議你先做什麼？

  我建議先做：Config + Logger + Static Handler

  這樣你就能：
  1. 測試 livedoc init 註冊專案
  2. 啟動伺服器
  3. 用 Markdown 編輯器測試靜態圖片
  4. 驗證 Content-Type 正確

  要我幫你實作哪一部分？

  選項：
  - A. 幫我建立完整的 package.json 和專案結構
  - B. 直接實作 Config Manager (src/utils/config.js)
  - C. 直接實作 Static Handler + Error Handler
  - D. 給我詳細的分步驟 TODO list

  你想要哪個？