const express = require('express');
const path = require('path');

const app = express();
const PORT = 54323;

// 提供靜態圖片
app.use('/images', express.static(path.join(__dirname, 'images')));

// 測試端點：PNG - 直接返回圖片
app.get('/test-png', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'test.png'));
});

// 測試端點：GIF - 直接返回圖片
app.get('/test-gif', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'test.gif'));
});

// 測試端點：JPG - 直接返回圖片
app.get('/test-jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'test.jpg'));
});

// 首頁
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Image Test Server</title></head>
      <body>
        <h1>圖片測試伺服器</h1>
        <ul>
          <li><a href="/test-png">測試 PNG</a></li>
          <li><a href="/test-gif">測試 GIF</a></li>
          <li><a href="/test-jpg">測試 JPG</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('測試連結：');
  console.log(`  PNG: http://localhost:${PORT}/test-png`);
  console.log(`  GIF: http://localhost:${PORT}/test-gif`);
  console.log(`  JPG: http://localhost:${PORT}/test-jpg`);
});