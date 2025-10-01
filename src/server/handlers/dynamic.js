const fs = require('fs').promises;
const path = require('path');
const { generateDiagram } = require('../../utils/kroki');
const { getDiagramType, isDynamicDiagram } = require('../../utils/mime-types');
const { handleError } = require('../../utils/error-handler');
const { info, error: logError } = require('../../utils/logger');

// 處理動態圖表請求
async function handleDynamicDiagram(req, res, projectPath, filename) {
  const filePath = path.join(projectPath, 'livedoc', 'dynamic', filename);
  const relativePath = `dynamic/${filename}`;

  try {
    // 檢查副檔名
    if (!isDynamicDiagram(filename)) {
      throw new Error(`Unsupported format: ${path.extname(filename)}`);
    }

    // 讀取原始碼
    const source = await fs.readFile(filePath, 'utf8');

    // 取得圖表類型
    const diagramType = getDiagramType(filename);
    if (!diagramType) {
      throw new Error(`Cannot determine diagram type for ${filename}`);
    }

    // 呼叫 Kroki 生成圖片
    const imageBuffer = await generateDiagram(source, diagramType);

    // 記錄成功
    info(relativePath, `Compiled ${diagramType} → PNG`);

    // 返回圖片
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(imageBuffer);

  } catch (err) {
    // 記錄錯誤
    if (err.isKrokiError) {
      logError(relativePath, `Syntax Error → ${err.message}`);
    } else {
      logError(relativePath, err.message);
    }

    // 返回錯誤圖片
    const errorImage = handleError(err, filePath);
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(errorImage);
  }
}

module.exports = {
  handleDynamicDiagram
};
