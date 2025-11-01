# LiveDoc 發布指南

## ⚠️ 重要發現

**包名 `livedoc` 已被佔用！**

npm 上已有一個名為 `livedoc` 的包（用於 REST API 文檔生成），所以我們需要使用其他名稱。

---

## 📦 可用的包名選項

我已檢查以下包名，**都可以使用**：

| 包名 | 狀態 | 推薦度 | 說明 |
|------|------|--------|------|
| **`livedoc-server`** | ✅ 可用 | ⭐⭐⭐ | 最直觀，強調這是一個服務器 |
| `markdown-livedoc` | ✅ 可用 | ⭐⭐ | 強調 Markdown 用途 |
| `livedoc-diagram` | ✅ 可用 | ⭐⭐ | 強調圖表功能 |
| `@hhjjy/livedoc` | ✅ 可用 | ⭐ | Scoped package，需要組織帳號 |

**建議使用: `livedoc-server`**

---

## 🚀 發布步驟（兩種方式）

### 方式 1: 發布到 npm Registry (推薦)

#### 步驟 1: 註冊 npm 帳號

如果還沒有 npm 帳號：
```bash
# 訪問 https://www.npmjs.com/signup 註冊
# 或使用命令行
npm adduser
```

#### 步驟 2: 登入 npm

```bash
npm login
# 輸入用戶名、密碼、郵箱
```

#### 步驟 3: 選擇包名並修改配置

**選項 A: 使用 `livedoc-server` (推薦)**
```bash
# 修改 package.json 中的 name
sed -i 's/"name": "livedoc"/"name": "livedoc-server"/' package.json
```

**選項 B: 使用其他名稱**
```bash
# 手動編輯 package.json，修改 "name" 欄位為你選擇的名稱
```

#### 步驟 4: 測試包內容

```bash
# 查看將要發布的文件
npm pack --dry-run

# 應該看到約 17 個文件，10.1 kB
```

#### 步驟 5: 發布！

```bash
npm publish

# 如果使用 scoped package (@hhjjy/livedoc)
npm publish --access public
```

#### 步驟 6: 驗證發布成功

```bash
# 查看你的包
npm view livedoc-server  # 或你選擇的包名

# 安裝測試
npm install -g livedoc-server
livedoc-server --version
```

---

### 方式 2: 發布到 GitHub Packages

如果你想發布到 GitHub Packages（私有或團隊使用）：

#### 步驟 1: 修改 package.json

```json
{
  "name": "@hhjjy/livedoc",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hhjjy/Livedoc.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

#### 步驟 2: 創建 GitHub Personal Access Token

1. 訪問 https://github.com/settings/tokens
2. 點擊 "Generate new token (classic)"
3. 勾選 `write:packages` 權限
4. 複製 token

#### 步驟 3: 登入 GitHub Packages

```bash
npm login --registry=https://npm.pkg.github.com
# Username: 你的 GitHub 用戶名
# Password: 剛才複製的 token
# Email: 你的郵箱
```

#### 步驟 4: 發布

```bash
npm publish
```

#### 步驟 5: 其他人安裝

```bash
npm install -g @hhjjy/livedoc --registry=https://npm.pkg.github.com
```

---

## 📝 發布後的更新

### 修改安裝說明

如果使用了新的包名，記得更新 README.md：

```markdown
## 安裝

\`\`\`bash
npm install -g livedoc-server
\`\`\`

## 使用

\`\`\`bash
livedoc --version  # 命令仍然是 livedoc
livedoc init
livedoc start
\`\`\`
```

**注意**: 雖然包名是 `livedoc-server`，但命令仍然是 `livedoc`（由 package.json 的 `bin` 欄位決定）。

---

## 🔄 版本更新流程

未來要發布新版本：

```bash
# 1. 更新版本號
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0

# 2. 提交到 git
git push && git push --tags

# 3. 發布到 npm
npm publish
```

---

## ✅ 快速命令清單

```bash
# 1. 登入 npm
npm login

# 2. 修改包名
nano package.json  # 把 "name": "livedoc" 改為 "livedoc-server"

# 3. 測試打包
npm pack --dry-run

# 4. 發布
npm publish

# 5. 驗證
npm view livedoc-server
npm install -g livedoc-server
livedoc --version
```

---

## ❓ 常見問題

### Q: 我需要什麼來發布到 npm？
A: 只需要一個免費的 npm 帳號（https://www.npmjs.com/signup）

### Q: 如果發布後發現問題怎麼辦？
A: 可以使用 `npm unpublish` 刪除（24小時內），或發布修復版本

### Q: 可以發布私有包嗎？
A: npm 私有包需要付費，建議使用 GitHub Packages（免費）

### Q: 包名改了之後，命令會變嗎？
A: 不會！包名是 `livedoc-server`，但命令仍是 `livedoc`

---

## 🎯 我的建議

**推薦發布方案: npm Registry + `livedoc-server`**

理由：
- ✅ 公開可用，任何人都能安裝
- ✅ 名稱清晰，容易記憶
- ✅ 不需要額外配置 registry
- ✅ 命令仍然是簡潔的 `livedoc`

**執行命令**:
```bash
# 1. 登入
npm login

# 2. 改包名
sed -i 's/"name": "livedoc"/"name": "livedoc-server"/' package.json

# 3. 發布
npm publish

# 完成！
```

---

需要幫助？請查看：
- npm 官方文檔: https://docs.npmjs.com/cli/publish
- GitHub Packages: https://docs.github.com/packages
