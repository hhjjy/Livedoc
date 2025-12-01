/**
 * Tests for src/config/formats.js
 */

const {
  getDiagramType,
  getStaticMimeType,
  isDynamicFormat,
  isStaticFormat,
  isSupportedFormat,
  getDynamicExtensions,
  getStaticExtensions,
  getAllExtensions
} = require('../../src/config/formats');

describe('formats.js', () => {
  describe('getDiagramType', () => {
    test('should return plantuml for .puml', () => {
      expect(getDiagramType('.puml')).toBe('plantuml');
    });

    test('should return mermaid for .mmd', () => {
      expect(getDiagramType('.mmd')).toBe('mermaid');
    });

    test('should return d2 for .d2', () => {
      expect(getDiagramType('.d2')).toBe('d2');
    });

    test('should return graphviz for .dot', () => {
      expect(getDiagramType('.dot')).toBe('graphviz');
    });

    test('should return nomnoml for .nomnoml', () => {
      expect(getDiagramType('.nomnoml')).toBe('nomnoml');
    });

    test('should handle uppercase extensions', () => {
      expect(getDiagramType('.PUML')).toBe('plantuml');
      expect(getDiagramType('.MMD')).toBe('mermaid');
    });

    test('should return null for unsupported formats', () => {
      expect(getDiagramType('.txt')).toBeNull();
      expect(getDiagramType('.json')).toBeNull();
      expect(getDiagramType('.html')).toBeNull();
    });

    test('should return null for static image formats', () => {
      expect(getDiagramType('.png')).toBeNull();
      expect(getDiagramType('.jpg')).toBeNull();
    });
  });

  describe('getStaticMimeType', () => {
    test('should return correct MIME type for .png', () => {
      expect(getStaticMimeType('.png')).toBe('image/png');
    });

    test('should return correct MIME type for .jpg', () => {
      expect(getStaticMimeType('.jpg')).toBe('image/jpeg');
    });

    test('should return correct MIME type for .jpeg', () => {
      expect(getStaticMimeType('.jpeg')).toBe('image/jpeg');
    });

    test('should return correct MIME type for .gif', () => {
      expect(getStaticMimeType('.gif')).toBe('image/gif');
    });

    test('should return correct MIME type for .svg', () => {
      expect(getStaticMimeType('.svg')).toBe('image/svg+xml');
    });

    test('should return correct MIME type for .webp', () => {
      expect(getStaticMimeType('.webp')).toBe('image/webp');
    });

    test('should handle uppercase extensions', () => {
      expect(getStaticMimeType('.PNG')).toBe('image/png');
      expect(getStaticMimeType('.JPG')).toBe('image/jpeg');
    });

    test('should return null for diagram formats', () => {
      expect(getStaticMimeType('.puml')).toBeNull();
      expect(getStaticMimeType('.mmd')).toBeNull();
    });

    test('should return null for unsupported formats', () => {
      expect(getStaticMimeType('.txt')).toBeNull();
      expect(getStaticMimeType('.pdf')).toBeNull();
    });
  });

  describe('isDynamicFormat', () => {
    test('should return true for diagram formats', () => {
      expect(isDynamicFormat('.puml')).toBe(true);
      expect(isDynamicFormat('.mmd')).toBe(true);
      expect(isDynamicFormat('.d2')).toBe(true);
      expect(isDynamicFormat('.nomnoml')).toBe(true);
    });

    test('should return false for static formats', () => {
      expect(isDynamicFormat('.png')).toBe(false);
      expect(isDynamicFormat('.jpg')).toBe(false);
    });

    test('should return false for unsupported formats', () => {
      expect(isDynamicFormat('.txt')).toBe(false);
    });
  });

  describe('isStaticFormat', () => {
    test('should return true for image formats', () => {
      expect(isStaticFormat('.png')).toBe(true);
      expect(isStaticFormat('.jpg')).toBe(true);
      expect(isStaticFormat('.gif')).toBe(true);
      expect(isStaticFormat('.svg')).toBe(true);
    });

    test('should return false for diagram formats', () => {
      expect(isStaticFormat('.puml')).toBe(false);
      expect(isStaticFormat('.mmd')).toBe(false);
    });
  });

  describe('isSupportedFormat', () => {
    test('should return true for all supported formats', () => {
      // Dynamic
      expect(isSupportedFormat('.puml')).toBe(true);
      expect(isSupportedFormat('.mmd')).toBe(true);
      expect(isSupportedFormat('.d2')).toBe(true);
      // Static
      expect(isSupportedFormat('.png')).toBe(true);
      expect(isSupportedFormat('.jpg')).toBe(true);
      expect(isSupportedFormat('.svg')).toBe(true);
    });

    test('should return false for unsupported formats', () => {
      expect(isSupportedFormat('.txt')).toBe(false);
      expect(isSupportedFormat('.pdf')).toBe(false);
      expect(isSupportedFormat('.doc')).toBe(false);
    });
  });

  describe('extension lists', () => {
    test('getDynamicExtensions should return array with .puml', () => {
      const exts = getDynamicExtensions();
      expect(Array.isArray(exts)).toBe(true);
      expect(exts).toContain('.puml');
      expect(exts).toContain('.mmd');
      expect(exts).toContain('.d2');
    });

    test('getStaticExtensions should return array with .png', () => {
      const exts = getStaticExtensions();
      expect(Array.isArray(exts)).toBe(true);
      expect(exts).toContain('.png');
      expect(exts).toContain('.jpg');
      expect(exts).toContain('.svg');
    });

    test('getAllExtensions should include both dynamic and static', () => {
      const all = getAllExtensions();
      expect(all).toContain('.puml');
      expect(all).toContain('.png');
    });

    test('should have at least 25 dynamic formats', () => {
      const exts = getDynamicExtensions();
      expect(exts.length).toBeGreaterThanOrEqual(25);
    });
  });
});
