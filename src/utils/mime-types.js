const path = require('path');

// MIME 類型映射
const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// 根據副檔名取得 MIME 類型
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// 檢查是否為靜態圖片
function isStaticImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext);
}

// 檢查是否為動態圖表
function isDynamicDiagram(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.puml', '.mmd'].includes(ext);
}

// 取得圖表類型 (for Kroki)
function getDiagramType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.puml': 'plantuml',
    '.mmd': 'mermaid'
  };
  return types[ext] || null;
}

module.exports = {
  getMimeType,
  isStaticImage,
  isDynamicDiagram,
  getDiagramType
};
