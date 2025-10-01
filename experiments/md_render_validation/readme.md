# Markdown 圖片渲染驗證測試

## 測試目的
驗證 Markdown 編輯器是否能透過 HTTP 連結正確渲染不同格式的圖片（PNG、GIF、JPG）。

## 測試方法
1. 架設 Express.js Server 於 localhost:54323
2. 提供三個端點直接返回圖片檔案
3. 透過 Markdown 編輯器渲染測試

## 測試端點
1. PNG: http://localhost:54323/test-png
2. GIF: http://localhost:54323/test-gif
3. JPG: http://localhost:54323/test-jpg

## 驗證結果 ✅

**結論：Markdown 編輯器可以成功渲染透過 HTTP 連結提供的圖片**

支援格式：
- ✅ PNG 格式 - 正常顯示
- ✅ GIF 格式 - 正常顯示（包含動畫）
- ✅ JPG 格式 - 正常顯示

## 使用說明

### 啟動測試伺服器
```bash
npm install  # 首次需安裝依賴
npm start    # 啟動伺服器
```

### 測試方式
開啟 `test.md` 用支援 Markdown 預覽的編輯器查看，或直接在瀏覽器訪問測試端點。

## 專案結構
```
test_api_server/
├── server.js          # Express.js 伺服器
├── package.json       # npm 設定檔
├── test.md           # Markdown 測試檔案
├── images/           # 測試圖片目錄
│   ├── test.png
│   ├── test.gif
│   └── test.jpg
└── readme.md         # 本說明文件
```  
