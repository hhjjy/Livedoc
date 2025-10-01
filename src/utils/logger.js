const fs = require('fs');
const path = require('path');
const { getLogsDir } = require('./config');

// 格式化時間
function formatTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  return `${date} ${time}`;
}

// 取得今天的日誌檔案
function getTodayLogFile() {
  const today = new Date().toISOString().split('T')[0];
  return path.join(getLogsDir(), `${today}.log`);
}

// 寫入日誌
function writeLog(level, filePath, message) {
  const timestamp = formatTimestamp();
  const logMessage = `[${timestamp}] ${level.padEnd(5)} | ${filePath.padEnd(20)} | ${message}\n`;

  // 輸出到 console
  console.log(logMessage.trim());

  // 寫入檔案
  try {
    const logFile = getTodayLogFile();
    fs.appendFileSync(logFile, logMessage, 'utf8');
  } catch (err) {
    console.error('Failed to write log:', err.message);
  }
}

// INFO
function info(filePath, message) {
  writeLog('INFO', filePath, message);
}

// ERROR
function error(filePath, message) {
  writeLog('ERROR', filePath, message);
}

// WARN
function warn(filePath, message) {
  writeLog('WARN', filePath, message);
}

module.exports = {
  info,
  error,
  warn
};
