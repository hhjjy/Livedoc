const https = require('https');
const http = require('http');
const zlib = require('zlib');
const { getConfig } = require('./config');

// Kroki 編碼函數
function encodeKroki(source) {
  const compressed = zlib.deflateSync(source);
  return compressed.toString('base64url');
}

// 呼叫 Kroki API
async function generateDiagram(content, type) {
  const config = getConfig();
  const krokiUrl = config.krokiUrl || 'http://localhost:8000';
  const encoded = encodeKroki(content);

  return new Promise((resolve, reject) => {
    // v0.3: 改用 SVG 格式（向量圖、覆蓋率高）
    const url = new URL(`${krokiUrl}/${type}/svg/${encoded}`);
    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(url, (res) => {
      const chunks = [];

      res.on('data', (chunk) => chunks.push(chunk));

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'];

        // 檢查是否為錯誤（400 + text/plain）
        if (res.statusCode === 400 && contentType === 'text/plain') {
          reject({
            isKrokiError: true,
            statusCode: res.statusCode,
            message: buffer.toString('utf8')
          });
          return;
        }

        // 其他錯誤
        if (res.statusCode !== 200) {
          reject({
            isKrokiError: false,
            statusCode: res.statusCode,
            message: `Kroki returned status ${res.statusCode}`
          });
          return;
        }

        // 成功 - 返回 buffer 和 content type
        resolve({
          buffer,
          contentType: contentType || 'image/svg+xml'
        });
      });
    });

    req.on('error', (err) => {
      reject({
        isKrokiError: false,
        message: `Failed to connect to Kroki: ${err.message}`
      });
    });

    req.end();
  });
}

module.exports = {
  generateDiagram,
  encodeKroki
};
