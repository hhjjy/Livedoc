/**
 * Integration tests for LiveDoc server
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { createApp } = require('../../src/server/app');

describe('LiveDoc Server Integration', () => {
  let app;
  let tempDir;

  beforeAll(() => {
    // Create temp directory with test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'livedoc-integration-'));

    // Create test diagram file
    fs.writeFileSync(
      path.join(tempDir, 'test.puml'),
      '@startuml\nAlice -> Bob: Hello\n@enduml'
    );

    // Create test image file
    fs.writeFileSync(
      path.join(tempDir, 'test.png'),
      Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) // PNG header
    );

    // Create nested directory structure
    fs.mkdirSync(path.join(tempDir, 'specs', '001-test', 'diagrams'), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, 'specs', '001-test', 'diagrams', 'flow.mmd'),
      'graph TD\n  A --> B'
    );

    // Create app with test config
    const config = {
      port: 3000,
      host: 'localhost',
      baseDir: tempDir,
      krokiUrl: 'https://kroki.io',
      krokiTimeout: 30000,
      maxFileSize: 1024 * 1024
    };

    app = createApp(config);
  });

  afterAll(() => {
    // Cleanup
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe('Static file handling', () => {
    test('should serve PNG file with correct content-type', async () => {
      const res = await request(app).get('/test.png');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('image/png');
      expect(res.headers['x-livedoc-status']).toBe('success');
    });

    test('should return error SVG for non-existent file', async () => {
      const res = await request(app).get('/nonexistent.png');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('image/svg+xml');
      expect(res.headers['x-livedoc-status']).toBe('error');
      expect(res.headers['x-livedoc-error']).toBe('FILE_NOT_FOUND');
      // Check body contains error text (supertest returns buffer for SVG)
      const body = res.body.toString ? res.body.toString() : res.text;
      expect(body).toContain('File Not Found');
    });
  });

  describe('Unsupported format handling', () => {
    test('should return error SVG for unsupported extension', async () => {
      // Create a test file with unsupported extension
      fs.writeFileSync(path.join(tempDir, 'test.xyz'), 'test content');

      const res = await request(app).get('/test.xyz');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('image/svg+xml');
      expect(res.headers['x-livedoc-error']).toBe('UNSUPPORTED_FORMAT');
      const body = res.body.toString ? res.body.toString() : res.text;
      expect(body).toContain('Unsupported Format');
    });

    test('should return error for JSON files', async () => {
      fs.writeFileSync(path.join(tempDir, 'config.json'), '{}');

      const res = await request(app).get('/config.json');

      expect(res.status).toBe(200);
      expect(res.headers['x-livedoc-error']).toBe('UNSUPPORTED_FORMAT');
    });
  });

  describe('Path security', () => {
    test('should block path traversal attempts', async () => {
      const res = await request(app).get('/../../../etc/passwd');

      expect(res.status).toBe(200);
      expect(res.headers['x-livedoc-error']).toBe('PATH_TRAVERSAL');
      const body = res.body.toString ? res.body.toString() : res.text;
      expect(body).toContain('Invalid Path');
    });

    test('should block encoded path traversal', async () => {
      const res = await request(app).get('/..%2F..%2Fetc/passwd');

      expect(res.status).toBe(200);
      expect(res.headers['x-livedoc-error']).toBe('PATH_TRAVERSAL');
    });
  });

  describe('Nested path handling', () => {
    test('should handle SpecKit-style nested paths', async () => {
      const res = await request(app).get('/specs/001-test/diagrams/flow.mmd');

      // Note: This will try to call Kroki, so might fail on network
      // But it should at least not be a path error
      expect(res.status).toBe(200);
      expect(res.headers['x-livedoc-error']).not.toBe('FILE_NOT_FOUND');
      expect(res.headers['x-livedoc-error']).not.toBe('PATH_TRAVERSAL');
    });
  });

  describe('Favicon handling', () => {
    test('should return 404 for favicon.ico', async () => {
      const res = await request(app).get('/favicon.ico');
      expect(res.status).toBe(404);
    });
  });

  describe('Response headers', () => {
    test('should include X-LiveDoc-Status header on success', async () => {
      const res = await request(app).get('/test.png');
      expect(res.headers['x-livedoc-status']).toBe('success');
    });

    test('should include X-LiveDoc-Status header on error', async () => {
      const res = await request(app).get('/nonexistent.puml');
      expect(res.headers['x-livedoc-status']).toBe('error');
    });

    test('should include X-LiveDoc-Error header with error type', async () => {
      const res = await request(app).get('/nonexistent.puml');
      expect(res.headers['x-livedoc-error']).toBeDefined();
    });
  });

  describe('Content type handling', () => {
    test('should return SVG for diagram files (via Kroki)', async () => {
      const res = await request(app).get('/test.puml');

      expect(res.status).toBe(200);
      // Either success SVG from Kroki or error SVG
      expect(res.headers['content-type']).toContain('image/svg+xml');
    });

    test('should return SVG for all error responses', async () => {
      const testCases = [
        '/nonexistent.puml',
        '/test.xyz',
        '/../etc/passwd'
      ];

      for (const path of testCases) {
        const res = await request(app).get(path);
        expect(res.headers['content-type']).toContain('image/svg+xml');
      }
    });
  });
});
