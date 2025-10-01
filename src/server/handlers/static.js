const fs = require('fs').promises;
const path = require('path');
const { getMimeType, isStaticImage } = require('../../utils/mime-types');
const { handleError } = require('../../utils/error-handler');
const { info, error: logError } = require('../../utils/logger');

// 處理靜態圖片請求
async function handleStaticImage(req, res, projectPath, filename) {
  const filePath = path.join(projectPath, 'livedoc', 'static', filename);
  const relativePath = `static/${filename}`;

  try {
    // 檢查副檔名
    if (!isStaticImage(filename)) {
      throw new Error(`Unsupported format: ${path.extname(filename)}`);
    }

    // 讀取檔案
    const imageBuffer = await fs.readFile(filePath);
    const mimeType = getMimeType(filename);

    // 記錄成功
    info(relativePath, `Served as ${mimeType}`);

    // 返回圖片
    res.setHeader('Content-Type', mimeType);
    res.status(200).send(imageBuffer);

  } catch (err) {
    // 記錄錯誤
    logError(relativePath, err.message);

    // 返回錯誤圖片
    const errorImage = handleError(err, filePath);
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(errorImage);
  }
}

module.exports = {
  handleStaticImage
};
