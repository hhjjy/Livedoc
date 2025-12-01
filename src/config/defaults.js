/**
 * LiveDoc Default Configuration
 *
 * These defaults are used when no environment variables or config files are present.
 * Configuration priority: Environment > Config File > Defaults
 */

const defaults = {
  // Server configuration
  port: 3000,
  host: 'localhost',

  // Kroki service configuration
  krokiUrl: 'https://kroki.io',
  krokiTimeout: 30000, // 30 seconds

  // File handling
  maxFileSize: 1024 * 1024, // 1MB

  // Output format for dynamic diagrams
  outputFormat: 'svg',

  // Error image dimensions
  errorImage: {
    width: 600,
    height: 200,
    backgroundColor: '#FEE2E2', // Light red
    textColor: '#DC2626',       // Red
    titleColor: '#991B1B',      // Dark red
    fontSize: 16,
    titleFontSize: 20,
    padding: 20
  }
};

module.exports = defaults;
