---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
  }
  h1 {
    color: #2563eb;
  }
  h2 {
    color: #1e40af;
  }
  table {
    font-size: 0.9em;
  }
  code {
    background-color: #f3f4f6;
    padding:1px 3px;
    border-radius: 3px;
  }
---

# LiveDoc
## 動態文檔圖表生成系統

**讓文檔活起來，圖表不再過時**

---

## 問題：文檔圖表總是過時

**傳統方式的痛點**
```markdown
![架構圖](static/architecture.png)
![進度圖](static/progress.png)
*最後更新：2025-09-15*
```

- 圖表容易過時
- 需要手動更新
- 圖片可能實際脫節

---

## LiveDoc 解決方案

**動態生成方式**
```markdown
![架構圖](http://localhost:3000/architecture)
![進度圖](http://localhost:3000/progress)
*永遠是最新的*
```

- 圖表即時生成
- 自動保持最新
- 標準 Markdown 語法

---

## 核心理念

**LiveDoc 是什麼？**
一個讓 Markdown 文檔中的圖表永遠保持最新的系統

| 特點 | 說明 |
|------|------|
| **文檔永不過時** | 圖表根據資料即時生成 |
| **零學習成本** | 使用標準 Markdown 語法 |
| **零維護成本** | 資料更新，圖表自動更新 |

---

## 如何運作

**更新機制**

當資料變更時：
- LiveDoc 偵測檔案到變化
- 自動重新生成圖表
- 下次請求時回傳新圖

定時更新：
- LiveDoc 定時抓取資料
- 自動重新生成圖表
- 下次請求時回傳新圖

---

## 與現有方案對比
### GitHub Badges
![build](https://img.shields.io/badge/build-passing-green)
```markdown
![build](https://img.shields.io/badge/build-passing-green)
```
- 簡單易用
- 只能顯示文字,樣式固定

### LiveDoc
```markdown
![系統狀態](http://localhost:3000/system-status)
```
- 支援客製化複雜圖表
- 靜態動態圖片(png,gif)

---

## Demo 展示


### 客製化動態圖表
1. **API 狀態儀表板**
2. **系統資源監控**
3. **迷你統計面板**
4. **效能比較圖表**

### 一般動態圖表更新
1. **序列圖/架構圖**


---

## 應用場景

**適用於各種文檔**

- **專案文檔**：即時顯示專案狀態
- **API 文檔**：自動更新端點狀態
- **架構圖、序列圖**：文檔中使用到架構圖與序列圖自動更新
- **團隊報告**：自動統計工作數據

**實際案例**
- README 專案進度
- 技術規格書的效能指標
---

## 實施計劃

### 當前進度
- ✅ 概念驗證完成
- ✅ 基礎 Demo 可運行

### 下一步
1. 架構設計
2. 完善圖表類型
3. 撰寫使用文檔
   

---

## 總結

### LiveDoc 解決的核心問題
**讓技術文檔的圖表永遠保持最新**

### 關鍵價值
- 不是監控系統
- 不是 Dashboard  
- 而是讓文檔不會過時的工具

### 核心理念
**簡單、實用、可靠**

---
