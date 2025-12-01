# LiveDoc 源碼文檔

## 📁 目錄結構

```
src/
├── cli/
│   ├── init.js       # 註冊專案、創建 livedoc/static、livedoc/dynamic
│   ├── start.js      # 啟動服務器
│   └── list.js       # 列出已註冊專案
├── server/
│   ├── app.js        # Express 應用
│   ├── router.js     # URL 路由: /{project}/livedoc/{static|dynamic}/{filename}
│   └── handlers/
│       ├── static.js    # 返回 PNG/JPG/GIF
│       └── dynamic.js   # 呼叫 Kroki 編譯 .puml/.mmd → PNG
└── utils/
    ├── config.js         # 管理 ~/.livedoc/config.json
    ├── logger.js         # 寫入 ~/.livedoc/logs/YYYY-MM-DD.log
    ├── kroki.js          # Kroki API，檢測 400+text/plain 錯誤
    ├── error-handler.js  # 生成 600x400 錯誤圖片 PNG
    └── mime-types.js     # 判斷副檔名 → MIME type
```

## 🚀 使用方式

### 1. 註冊專案
```bash
cd your-project
node /path/to/livedoc/bin/livedoc.js init

# 結果：
# 📁 Created: livedoc/
# 📁 Created: livedoc/static/
# 📁 Created: livedoc/dynamic/
# ✅ Project 'your-project' registered successfully
```

### 2. 放置文件
```bash
# 靜態圖片 → livedoc/static/
cp logo.png livedoc/static/

# 動態圖表 → livedoc/dynamic/
echo '@startuml\nAlice -> Bob\n@enduml' > livedoc/dynamic/seq.puml
```

### 3. 啟動服務器
```bash
node /path/to/livedoc/bin/livedoc.js start

# 輸出：
# ✅ LiveDoc server running on http://localhost:3000
# 📁 Registered projects: 1
# 🔧 Kroki service: http://localhost:8000
```

### 4. 在 Markdown 中使用
```markdown
![Logo](http://localhost:3000/your-project/livedoc/static/logo.png)
![Sequence](http://localhost:3000/your-project/livedoc/dynamic/seq.puml)
```

## ⚙️ 執行結果

### 成功範例
```bash
# 請求
GET http://localhost:3000/demo/livedoc/static/test.png

# 響應
HTTP/1.1 200 OK
Content-Type: image/png

# 日誌
[2025-10-01 16:22:31] INFO | static/test.png | Served as image/png
```

```bash
# 請求
GET http://localhost:3000/demo/livedoc/dynamic/demo.puml

# 響應
HTTP/1.1 200 OK
Content-Type: image/png

# 日誌
[2025-10-01 16:22:35] INFO | dynamic/demo.puml | Compiled plantuml → PNG
```

### 錯誤範例（語法錯誤）
```bash
# 請求
GET http://localhost:3000/demo/livedoc/dynamic/error.puml

# 響應
HTTP/1.1 200 OK              ← 仍然返回 200
Content-Type: image/png      ← 返回錯誤圖片 PNG (600x400)

# 日誌
[2025-10-01 16:22:48] ERROR | dynamic/error.puml | Syntax Error → Error 400: ...
```

### 錯誤範例（文件不存在）
```bash
# 請求
GET http://localhost:3000/demo/livedoc/dynamic/notfound.puml

# 響應
HTTP/1.1 200 OK              ← 仍然返回 200
Content-Type: image/png      ← 返回錯誤圖片 PNG

# 日誌
[2025-10-01 16:23:28] ERROR | dynamic/notfound.puml | ENOENT: no such file or directory
```

## 🔑 核心原則

1. **永遠返回圖片** - 即使錯誤也返回 `HTTP 200 + image/png`
2. **錯誤可視化** - 錯誤訊息渲染成 600x400 PNG 圖片
3. **Kroki 錯誤檢測** - 檢測 `400 + text/plain` 判斷語法錯誤
4. **目錄結構** - 使用 `livedoc/static/` 和 `livedoc/dynamic/`

## 📋 配置文件

**位置:** `~/.livedoc/config.json`

```json
{
  "projects": {
    "demo": "/path/to/demo"
  },
  "port": 3000,
  "krokiUrl": "http://localhost:8000",
  "supportedFormats": {
    "static": [".png", ".jpg", ".jpeg", ".gif"],
    "dynamic": [".puml", ".mmd"]
  }
}
```

## 📊 日誌格式

**位置:** `~/.livedoc/logs/YYYY-MM-DD.log`

**格式:**
```
[YYYY-MM-DD HH:mm:ss] LEVEL | filepath | message
```

**範例:**
```
[2025-10-01 16:22:31] INFO  | static/test.png    | Served as image/png
[2025-10-01 16:22:35] INFO  | dynamic/demo.puml  | Compiled plantuml → PNG
[2025-10-01 16:22:48] ERROR | dynamic/error.puml | Syntax Error → ...
```
