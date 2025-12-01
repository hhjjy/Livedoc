/**
 * Tests for src/utils/error-image.js
 */

const {
  generateErrorImage,
  fileNotFoundError,
  unsupportedFormatError,
  krokiError,
  syntaxError,
  fileTooLargeError,
  pathTraversalError,
  ErrorTypes
} = require('../../src/utils/error-image');

describe('error-image.js', () => {
  describe('generateErrorImage', () => {
    test('should return valid SVG', () => {
      const svg = generateErrorImage('UNKNOWN', 'Test error');
      expect(svg).toContain('<?xml version="1.0"');
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });

    test('should include error title', () => {
      const svg = generateErrorImage('FILE_NOT_FOUND', 'Test');
      expect(svg).toContain('File Not Found');
    });

    test('should include error message', () => {
      const svg = generateErrorImage('UNKNOWN', 'Custom error message');
      expect(svg).toContain('Custom error message');
    });

    test('should escape XML special characters', () => {
      const svg = generateErrorImage('UNKNOWN', 'Test <script>alert(1)</script>');
      expect(svg).not.toContain('<script>');
      expect(svg).toContain('&lt;script&gt;');
    });

    test('should handle quotes in message', () => {
      const svg = generateErrorImage('UNKNOWN', 'File "test.puml" not found');
      expect(svg).toContain('&quot;test.puml&quot;');
    });

    test('should handle ampersands in message', () => {
      const svg = generateErrorImage('UNKNOWN', 'Error: foo & bar');
      expect(svg).toContain('foo &amp; bar');
    });

    test('should wrap long messages', () => {
      const longMessage = 'A'.repeat(100);
      const svg = generateErrorImage('UNKNOWN', longMessage);
      // Should have multiple text elements due to wrapping
      const textCount = (svg.match(/<text/g) || []).length;
      expect(textCount).toBeGreaterThan(2); // Title + icon + at least 2 message lines
    });
  });

  describe('convenience functions', () => {
    test('fileNotFoundError should include path', () => {
      const svg = fileNotFoundError('/path/to/file.puml');
      expect(svg).toContain('File Not Found');
      expect(svg).toContain('/path/to/file.puml');
    });

    test('unsupportedFormatError should include extension', () => {
      const svg = unsupportedFormatError('.xyz');
      expect(svg).toContain('Unsupported Format');
      expect(svg).toContain('.xyz');
    });

    test('krokiError should include details', () => {
      const svg = krokiError('Connection timeout');
      expect(svg).toContain('Kroki Service Error');
      // Text may be wrapped across lines, check both words appear
      expect(svg).toContain('Connection');
      expect(svg).toContain('timeout');
    });

    test('krokiError should have default message', () => {
      const svg = krokiError();
      expect(svg).toContain('Kroki Service Error');
      expect(svg).toContain('network connection');
    });

    test('syntaxError should include details', () => {
      const svg = syntaxError('Line 5: unexpected token');
      expect(svg).toContain('Diagram Syntax Error');
      expect(svg).toContain('Line 5');
    });

    test('fileTooLargeError should include sizes', () => {
      const svg = fileTooLargeError(2 * 1024 * 1024, 1024 * 1024);
      expect(svg).toContain('File Too Large');
      expect(svg).toContain('2.00MB');
      expect(svg).toContain('1.00MB');
    });

    test('pathTraversalError should show security message', () => {
      const svg = pathTraversalError();
      expect(svg).toContain('Invalid Path');
      expect(svg).toContain('security');
    });
  });

  describe('SVG structure', () => {
    test('should have proper dimensions', () => {
      const svg = generateErrorImage('UNKNOWN', 'Test');
      expect(svg).toMatch(/width="600"/);
    });

    test('should have error icon', () => {
      const svg = generateErrorImage('UNKNOWN', 'Test');
      expect(svg).toContain('<circle');
      expect(svg).toContain('!'); // exclamation mark
    });

    test('should have colored sidebar', () => {
      const svg = generateErrorImage('UNKNOWN', 'Test');
      expect(svg).toContain('width="8"');
    });

    test('should be valid XML', () => {
      const svg = generateErrorImage('FILE_NOT_FOUND', 'Test <path> with "quotes"');
      // Simple check - no unescaped special chars in text content
      expect(svg).not.toMatch(/<text[^>]*>[^<]*<(?!\/text)/);
    });
  });

  describe('ErrorTypes', () => {
    test('should have all expected error types', () => {
      expect(ErrorTypes.FILE_NOT_FOUND).toBe('File Not Found');
      expect(ErrorTypes.UNSUPPORTED_FORMAT).toBe('Unsupported Format');
      expect(ErrorTypes.KROKI_ERROR).toBe('Kroki Service Error');
      expect(ErrorTypes.SYNTAX_ERROR).toBe('Diagram Syntax Error');
      expect(ErrorTypes.FILE_TOO_LARGE).toBe('File Too Large');
      expect(ErrorTypes.PATH_TRAVERSAL).toBe('Invalid Path');
      expect(ErrorTypes.UNKNOWN).toBe('Error');
    });
  });

  describe('long word wrapping (002 fix)', () => {
    test('should wrap long path without spaces', () => {
      const longPath = 'specs/001-feature-name/diagrams/very-long-architecture-detailed-design-flow.puml';
      const svg = fileNotFoundError(longPath);
      // Should have multiple text lines
      const textCount = (svg.match(/<text/g) || []).length;
      expect(textCount).toBeGreaterThan(3); // Title + icon + multiple message lines
    });

    test('should break at natural breakpoints (/, -, _, .)', () => {
      const longPath = '/path/to/very/long/deeply/nested/directory/structure/filename.puml';
      const svg = fileNotFoundError(longPath);
      // Path should be split across multiple lines
      const textCount = (svg.match(/<text/g) || []).length;
      expect(textCount).toBeGreaterThan(3);
    });

    test('should force break very long strings without breakpoints', () => {
      const longString = 'A'.repeat(120);
      const svg = generateErrorImage('UNKNOWN', longString);
      // Should break into multiple lines
      const textCount = (svg.match(/<text/g) || []).length;
      expect(textCount).toBeGreaterThan(3);
    });

    test('should handle URL-like strings', () => {
      const url = 'https://very-long-subdomain.example-domain.com/path/to/resource/file.png';
      const svg = generateErrorImage('UNKNOWN', `Cannot access ${url}`);
      // URL should be wrapped properly
      expect(svg).toContain('https://');
      const textCount = (svg.match(/<text/g) || []).length;
      expect(textCount).toBeGreaterThan(2);
    });

    test('should preserve complete content in wrapped text', () => {
      const longPath = 'specs/001-livedoc-redesign/diagrams/architecture-flow.puml';
      const svg = fileNotFoundError(longPath);
      // All parts of the path should appear somewhere in the SVG
      // Note: text may be wrapped at breakpoints like '.' so check individual parts
      expect(svg).toContain('specs/');
      expect(svg).toContain('001-');
      expect(svg).toContain('puml'); // .puml may be split as 'flow.' and 'puml'
    });
  });

  describe('dynamic height', () => {
    test('short message should have minimum height', () => {
      const svg = generateErrorImage('UNKNOWN', 'Short');
      const heightMatch = svg.match(/height="([\d.]+)"/);
      expect(parseFloat(heightMatch[1])).toBeGreaterThanOrEqual(200);
    });

    test('long message should increase height', () => {
      const shortSvg = generateErrorImage('UNKNOWN', 'Short');
      const longMessage = 'This is a very long error message that should cause the SVG to be taller. '.repeat(5);
      const longSvg = generateErrorImage('UNKNOWN', longMessage);

      const shortMatch = shortSvg.match(/height="([\d.]+)"/);
      const longMatch = longSvg.match(/height="([\d.]+)"/);

      expect(shortMatch).not.toBeNull();
      expect(longMatch).not.toBeNull();

      const shortHeight = parseFloat(shortMatch[1]);
      const longHeight = parseFloat(longMatch[1]);

      expect(longHeight).toBeGreaterThan(shortHeight);
    });
  });
});
