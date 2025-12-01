/**
 * Tests for src/utils/security.js
 */

const path = require('path');
const { validatePath, sanitizeFilename, validateFileSize } = require('../../src/utils/security');

describe('security.js', () => {
  const baseDir = '/home/user/project';

  describe('validatePath', () => {
    test('should accept valid relative paths', () => {
      const result = validatePath('diagrams/test.puml', baseDir);
      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(path.join(baseDir, 'diagrams/test.puml'));
      expect(result.error).toBeNull();
    });

    test('should accept nested paths', () => {
      const result = validatePath('specs/001-auth/diagrams/flow.mmd', baseDir);
      expect(result.valid).toBe(true);
    });

    test('should reject path traversal with ..', () => {
      const result = validatePath('../etc/passwd', baseDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Path traversal');
    });

    test('should reject hidden path traversal', () => {
      const result = validatePath('diagrams/../../../etc/passwd', baseDir);
      expect(result.valid).toBe(false);
    });

    test('should reject absolute paths (Unix)', () => {
      const result = validatePath('/etc/passwd', baseDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Absolute paths');
    });

    test('should reject absolute paths (Windows)', () => {
      const result = validatePath('C:\\Windows\\System32', baseDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Absolute paths');
    });

    test('should reject null bytes', () => {
      const result = validatePath('test\x00.puml', baseDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('null bytes');
    });

    test('should reject empty paths', () => {
      const result = validatePath('', baseDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Empty path');
    });

    test('should reject whitespace-only paths', () => {
      const result = validatePath('   ', baseDir);
      expect(result.valid).toBe(false);
    });

    test('should accept paths with dots in filename', () => {
      const result = validatePath('diagrams/my.diagram.v2.puml', baseDir);
      expect(result.valid).toBe(true);
    });

    test('should accept paths with hyphens and underscores', () => {
      const result = validatePath('my-project/my_diagram.puml', baseDir);
      expect(result.valid).toBe(true);
    });
  });

  describe('sanitizeFilename', () => {
    test('should remove null bytes', () => {
      expect(sanitizeFilename('test\x00file')).toBe('testfile');
    });

    test('should remove path separators', () => {
      expect(sanitizeFilename('path/to/file')).toBe('pathtofile');
      expect(sanitizeFilename('path\\to\\file')).toBe('pathtofile');
    });

    test('should remove special characters', () => {
      expect(sanitizeFilename('file<>:"|?*name')).toBe('filename');
    });

    test('should preserve normal filenames', () => {
      expect(sanitizeFilename('my-file_name.puml')).toBe('my-file_name.puml');
    });
  });

  describe('validateFileSize', () => {
    const maxSize = 1024 * 1024; // 1MB

    test('should accept files under limit', () => {
      const result = validateFileSize(500000, maxSize);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should accept files at limit', () => {
      const result = validateFileSize(maxSize, maxSize);
      expect(result.valid).toBe(true);
    });

    test('should reject files over limit', () => {
      const result = validateFileSize(maxSize + 1, maxSize);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    test('should include size in error message', () => {
      const result = validateFileSize(2 * 1024 * 1024, maxSize);
      expect(result.error).toContain('2.00MB');
      expect(result.error).toContain('1.00MB');
    });
  });
});
