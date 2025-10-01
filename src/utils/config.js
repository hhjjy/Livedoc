const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.livedoc');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const LOGS_DIR = path.join(CONFIG_DIR, 'logs');

// 預設設定
const DEFAULT_CONFIG = {
  projects: {},
  port: 3000,
  krokiUrl: 'http://localhost:8000',
  supportedFormats: {
    static: ['.png', '.jpg', '.jpeg', '.gif'],
    dynamic: ['.puml', '.mmd']
  }
};

// 確保配置目錄存在
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

// 讀取配置
function loadConfig() {
  ensureConfigDir();

  if (!fs.existsSync(CONFIG_FILE)) {
    // 第一次使用，建立預設配置
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }

  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load config:', err.message);
    return DEFAULT_CONFIG;
  }
}

// 儲存配置
function saveConfig(config) {
  ensureConfigDir();

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to save config:', err.message);
    return false;
  }
}

// 新增專案
function addProject(name, projectPath) {
  const config = loadConfig();

  // 驗證路徑存在
  if (!fs.existsSync(projectPath)) {
    throw new Error(`Path does not exist: ${projectPath}`);
  }

  config.projects[name] = projectPath;
  saveConfig(config);

  return true;
}

// 移除專案
function removeProject(name) {
  const config = loadConfig();

  if (!config.projects[name]) {
    throw new Error(`Project not found: ${name}`);
  }

  delete config.projects[name];
  saveConfig(config);

  return true;
}

// 取得專案路徑
function getProjectPath(name) {
  const config = loadConfig();
  return config.projects[name] || null;
}

// 列出所有專案
function listProjects() {
  const config = loadConfig();
  return config.projects;
}

// 取得配置
function getConfig(key) {
  const config = loadConfig();
  return key ? config[key] : config;
}

// 取得 logs 目錄
function getLogsDir() {
  return LOGS_DIR;
}

module.exports = {
  loadConfig,
  saveConfig,
  addProject,
  removeProject,
  getProjectPath,
  listProjects,
  getConfig,
  getLogsDir,
  CONFIG_DIR,
  CONFIG_FILE
};
