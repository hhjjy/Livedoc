const { createCanvas } = require('canvas');

// 生成錯誤圖片 (600x400 PNG)
function generateErrorImage(errorType, details) {
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
