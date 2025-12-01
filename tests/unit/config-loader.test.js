/**
 * Tests for src/config/loader.js
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { loadConfig, loadFromEnv, formatConfigSource } = require('../../src/config/loader');
const defaults = require('../../src/config/defaults');

describe('config/loader.js', () => {
  let tempDir;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Create temp directory for test config files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'livedoc-test-'));
    // Clear environment variables
    delete process.env.LIVEDOC_PORT;
    delete process.env.LIVEDOC_HOST;
    delete process.env.LIVEDOC_KROKI_URL;
    delete process.env.LIVEDOC_KROKI_TIMEOUT;
    delete process.env.LIVEDOC_MAX_FILE_SIZE;
  });

  afterEach(() => {
    // Restore environment
    process.env = { ...originalEnv };
    // Cleanup temp directory
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe('loadConfig with defaults', () => {
    test('should return defaults when no config exists', () => {
      const { config, source } = loadConfig(tempDir);

      expect(config.port).toBe(defaults.port);
      expect(config.host).toBe(defaults.host);
      expect(config.krokiUrl).toBe(defaults.krokiUrl);
      expect(source.file).toBeNull();
      expect(source.env).toEqual([]);
    });
  });

  describe('loadConfig with config file', () => {
    test('should load .livedocrc file', () => {
      const configContent = { port: 8080, krokiUrl: 'https://custom.kroki.io' };
      fs.writeFileSync(
        path.join(tempDir, '.livedocrc'),
        JSON.stringify(configContent)
      );

      const { config, source } = loadConfig(tempDir);

      expect(config.port).toBe(8080);
      expect(config.krokiUrl).toBe('https://custom.kroki.io');
      expect(source.file).toContain('.livedocrc');
    });

    test('should load livedoc.config.json file', () => {
      const configContent = { port: 9000 };
      fs.writeFileSync(
        path.join(tempDir, 'livedoc.config.json'),
        JSON.stringify(configContent)
      );

      const { config, source } = loadConfig(tempDir);

      expect(config.port).toBe(9000);
      expect(source.file).toContain('livedoc.config.json');
    });

    test('should prefer .livedocrc over livedoc.config.json', () => {
      fs.writeFileSync(
        path.join(tempDir, '.livedocrc'),
        JSON.stringify({ port: 1111 })
      );
      fs.writeFileSync(
        path.join(tempDir, 'livedoc.config.json'),
        JSON.stringify({ port: 2222 })
      );

      const { config } = loadConfig(tempDir);

      expect(config.port).toBe(1111);
    });

    test('should ignore invalid JSON in config file', () => {
      fs.writeFileSync(
        path.join(tempDir, '.livedocrc'),
        'not valid json {'
      );

      const { config, source } = loadConfig(tempDir);

      expect(config.port).toBe(defaults.port);
      expect(source.file).toBeNull();
    });
  });

  describe('loadFromEnv', () => {
    test('should load LIVEDOC_PORT', () => {
      process.env.LIVEDOC_PORT = '8888';
      const env = loadFromEnv();
      expect(env.port).toBe(8888);
    });

    test('should load LIVEDOC_HOST', () => {
      process.env.LIVEDOC_HOST = '0.0.0.0';
      const env = loadFromEnv();
      expect(env.host).toBe('0.0.0.0');
    });

    test('should load LIVEDOC_KROKI_URL', () => {
      process.env.LIVEDOC_KROKI_URL = 'https://my.kroki.io';
      const env = loadFromEnv();
      expect(env.krokiUrl).toBe('https://my.kroki.io');
    });

    test('should load LIVEDOC_KROKI_TIMEOUT', () => {
      process.env.LIVEDOC_KROKI_TIMEOUT = '60000';
      const env = loadFromEnv();
      expect(env.krokiTimeout).toBe(60000);
    });

    test('should load LIVEDOC_MAX_FILE_SIZE', () => {
      process.env.LIVEDOC_MAX_FILE_SIZE = '5242880';
      const env = loadFromEnv();
      expect(env.maxFileSize).toBe(5242880);
    });

    test('should ignore invalid port', () => {
      process.env.LIVEDOC_PORT = 'not-a-number';
      const env = loadFromEnv();
      expect(env.port).toBeUndefined();
    });

    test('should ignore out-of-range port', () => {
      process.env.LIVEDOC_PORT = '70000';
      const env = loadFromEnv();
      expect(env.port).toBeUndefined();
    });

    test('should ignore negative port', () => {
      process.env.LIVEDOC_PORT = '-1';
      const env = loadFromEnv();
      expect(env.port).toBeUndefined();
    });
  });

  describe('config priority: env > file > defaults', () => {
    test('env should override file config', () => {
      // Set up file config
      fs.writeFileSync(
        path.join(tempDir, '.livedocrc'),
        JSON.stringify({ port: 5000, krokiUrl: 'https://file.kroki.io' })
      );

      // Set up env
      process.env.LIVEDOC_PORT = '6000';

      const { config, source } = loadConfig(tempDir);

      // Port from env should override file
      expect(config.port).toBe(6000);
      // krokiUrl from file should be used
      expect(config.krokiUrl).toBe('https://file.kroki.io');
      // Source should show both
      expect(source.env).toContain('port');
      expect(source.file).toContain('.livedocrc');
    });

    test('file should override defaults', () => {
      fs.writeFileSync(
        path.join(tempDir, '.livedocrc'),
        JSON.stringify({ port: 4000 })
      );

      const { config } = loadConfig(tempDir);

      expect(config.port).toBe(4000);
      // Other values should be defaults
      expect(config.host).toBe(defaults.host);
    });
  });

  describe('formatConfigSource', () => {
    test('should show defaults when no overrides', () => {
      const result = formatConfigSource({ env: [], file: null });
      expect(result).toBe('defaults');
    });

    test('should show env keys', () => {
      const result = formatConfigSource({ env: ['port', 'krokiUrl'], file: null });
      expect(result).toContain('env:');
      expect(result).toContain('port');
      expect(result).toContain('krokiUrl');
    });

    test('should show file path', () => {
      const result = formatConfigSource({ env: [], file: '/path/.livedocrc' });
      expect(result).toContain('file:');
      expect(result).toContain('.livedocrc');
    });

    test('should show both when combined', () => {
      const result = formatConfigSource({ env: ['port'], file: '/path/.livedocrc' });
      expect(result).toContain('env:');
      expect(result).toContain('file:');
    });
  });
});
