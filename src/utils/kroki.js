/**
 * LiveDoc Kroki Client
 *
 * Renders diagrams via Kroki API service.
 * Returns SVG format for all diagram types.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const zlib = require('zlib');

/**
 * Encode diagram source for Kroki API
 * @param {string} source - Diagram source code
 * @returns {string} - URL-safe base64 encoded deflated content
 */
function encodeDiagram(source) {
  const compressed = zlib.deflateSync(source);
  return compressed.toString('base64url');
}

/**
 * Make an HTTP/HTTPS request
 * @param {URL} url - URL object to request
 * @param {number} timeout - Request timeout in ms
 * @returns {Promise<{ statusCode: number, headers: Object, body: Buffer }>}
 */
function makeRequest(url, timeout) {
  return new Promise((resolve, reject) => {
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      timeout: timeout
    };

    const req = protocol.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks)
        });
      });
    });

    req.on('error', (error) => {
      reject(new KrokiError('CONNECTION_ERROR', `Failed to connect to Kroki: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new KrokiError('TIMEOUT', `Kroki request timed out after ${timeout}ms`));
    });

    req.end();
  });
}

/**
 * Custom error class for Kroki-related errors
 */
class KrokiError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.name = 'KrokiError';
    this.type = type;
    this.details = details;
  }
}

/**
 * Kroki client class
 */
class KrokiClient {
  /**
   * @param {Object} options
   * @param {string} options.baseUrl - Kroki service URL
   * @param {number} options.timeout - Request timeout in ms
   */
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || 'https://kroki.io').replace(/\/$/, '');
    this.timeout = options.timeout || 30000;
  }

  /**
   * Render a diagram to SVG
   * @param {string} diagramType - Kroki diagram type (e.g., 'plantuml', 'mermaid')
   * @param {string} source - Diagram source code
   * @returns {Promise<{ buffer: Buffer, contentType: string }>}
   * @throws {KrokiError}
   */
  async render(diagramType, source) {
    const encoded = encodeDiagram(source);
    const url = new URL(`${this.baseUrl}/${diagramType}/svg/${encoded}`);

    try {
      const response = await makeRequest(url, this.timeout);

      if (response.statusCode === 200) {
        return {
          buffer: response.body,
          contentType: response.headers['content-type'] || 'image/svg+xml'
        };
      }

      // Handle error responses
      const errorBody = response.body.toString('utf8');

      if (response.statusCode === 400) {
        // Syntax error in diagram
        throw new KrokiError(
          'SYNTAX_ERROR',
          'Diagram contains syntax errors',
          errorBody
        );
      }

      if (response.statusCode === 404) {
        throw new KrokiError(
          'UNSUPPORTED_TYPE',
          `Diagram type "${diagramType}" is not supported by Kroki`
        );
      }

      if (response.statusCode >= 500) {
        throw new KrokiError(
          'SERVER_ERROR',
          `Kroki server error: ${response.statusCode}`,
          errorBody
        );
      }

      throw new KrokiError(
        'UNKNOWN_ERROR',
        `Unexpected response from Kroki: ${response.statusCode}`,
        errorBody
      );
    } catch (error) {
      if (error instanceof KrokiError) {
        throw error;
      }
      throw new KrokiError('CONNECTION_ERROR', error.message);
    }
  }

  /**
   * Get the base URL of this client
   * @returns {string}
   */
  getBaseUrl() {
    return this.baseUrl;
  }
}

/**
 * Create a Kroki client with the given configuration
 * @param {Object} config - Configuration object with krokiUrl and krokiTimeout
 * @returns {KrokiClient}
 */
function createClient(config) {
  return new KrokiClient({
    baseUrl: config.krokiUrl,
    timeout: config.krokiTimeout
  });
}

// Legacy exports for backward compatibility
async function generateDiagram(content, type, config = {}) {
  const client = new KrokiClient({
    baseUrl: config.krokiUrl || 'https://kroki.io',
    timeout: config.krokiTimeout || 30000
  });

  return client.render(type, content);
}

module.exports = {
  KrokiClient,
  KrokiError,
  createClient,
  encodeDiagram,
  generateDiagram
};
