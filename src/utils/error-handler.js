// 延遲加載 canvas，使其成為可選依賴
let createCanvas;
try {
  createCanvas = require('canvas').createCanvas;
} catch (err) {
  // canvas 不可用時，使用 fallback
  createCanvas = null;
}

// 生成錯誤圖片 (600x400 PNG)
function generateErrorImage(errorType, details) {
  // 如果 canvas 不可用，返回簡單的 SVG 錯誤圖片
  if (!createCanvas) {
    return generateErrorSVG(errorType, details);
  }

  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 背景 (淺紅色)
  ctx.fillStyle = '#ffe0e0';
  ctx.fillRect(0, 0, width, height);

  // 邊框
  ctx.strokeStyle = '#cc0000';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  // 標題
  ctx.fillStyle = '#cc0000';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('❌ LiveDoc Error', 30, 60);

  // 分隔線
  ctx.strokeStyle = '#cc0000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 80);
  ctx.lineTo(width - 30, 80);
  ctx.stroke();

  // 錯誤類型
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`Error Type: ${errorType}`, 30, 120);

  // 錯誤詳情
  ctx.font = '14px monospace';
  ctx.fillStyle = '#555555';

  // 將詳情拆成多行
  const lines = wrapText(ctx, details, width - 60);
  let y = 160;
  for (const line of lines) {
    if (y > height - 40) break; // 避免超出範圍
    ctx.fillText(line, 30, y);
    y += 24;
  }

  // Footer
  ctx.fillStyle = '#999999';
  ctx.font = '12px sans-serif';
  ctx.fillText('Check ~/.livedoc/logs/ for more details', 30, height - 20);

  return canvas.toBuffer('image/png');
}

// 生成 SVG 錯誤圖片 (fallback when canvas is not available)
function generateErrorSVG(errorType, details) {
  const width = 600;
  const height = 400;

  // 將詳情文字分行 (簡單版本)
  const detailLines = [];
  const maxLineLength = 60;
  let currentLine = '';

  for (const char of details) {
    if (currentLine.length >= maxLineLength || char === '\n') {
      detailLines.push(currentLine);
      currentLine = char === '\n' ? '' : char;
    } else {
      currentLine += char;
    }
  }
  if (currentLine) detailLines.push(currentLine);

  // 生成 SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <!-- Background -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="#ffe0e0"/>

  <!-- Border -->
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}"
        fill="none" stroke="#cc0000" stroke-width="4"/>

  <!-- Title -->
  <text x="30" y="60" font-family="sans-serif" font-size="24"
        font-weight="bold" fill="#cc0000">❌ LiveDoc Error</text>

  <!-- Separator line -->
  <line x1="30" y1="80" x2="${width - 30}" y2="80"
        stroke="#cc0000" stroke-width="2"/>

  <!-- Error Type -->
  <text x="30" y="120" font-family="sans-serif" font-size="18"
        font-weight="bold" fill="#333333">Error Type: ${escapeXml(errorType)}</text>

  <!-- Details -->
  ${detailLines.slice(0, 8).map((line, i) =>
    `<text x="30" y="${160 + i * 24}" font-family="monospace" font-size="14" fill="#555555">${escapeXml(line)}</text>`
  ).join('\n  ')}

  <!-- Footer -->
  <text x="30" y="${height - 20}" font-family="sans-serif" font-size="12"
        fill="#999999">Check ~/.livedoc/logs/ for more details</text>
</svg>`;

  return Buffer.from(svg, 'utf-8');
}

// XML escape helper
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 文字換行
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// 處理不同類型的錯誤
function handleError(error, filePath) {
  let errorType = 'Unknown Error';
  let details = error.message || 'An unknown error occurred';

  if (error.code === 'ENOENT') {
    errorType = 'File Not Found';
    details = `File does not exist: ${filePath}`;
  } else if (error.isKrokiError) {
    errorType = 'Compilation Error';
    details = error.message || 'Syntax error in diagram source';
  } else if (error.code === 'EACCES') {
    errorType = 'Permission Denied';
    details = `Cannot access file: ${filePath}`;
  } else if (error.statusCode) {
    errorType = 'HTTP Error';
    details = `Status ${error.statusCode}: ${error.message}`;
  }

  return generateErrorImage(errorType, details);
}

module.exports = {
  handleError,
  generateErrorImage
};
