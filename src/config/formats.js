/**
 * LiveDoc Format Mapping
 *
 * Maps file extensions to Kroki diagram types.
 * All dynamic formats are rendered via Kroki API.
 */

// Dynamic formats - rendered via Kroki
const dynamicFormats = {
  // PlantUML family
  '.puml': 'plantuml',
  '.plantuml': 'plantuml',
  '.pu': 'plantuml',
  '.c4puml': 'c4plantuml',
  '.c4plantuml': 'c4plantuml',

  // Mermaid
  '.mmd': 'mermaid',
  '.mermaid': 'mermaid',

  // D2
  '.d2': 'd2',

  // Graphviz
  '.dot': 'graphviz',
  '.gv': 'graphviz',
  '.graphviz': 'graphviz',

  // Diagrams family (blockdiag, seqdiag, etc.)
  '.blockdiag': 'blockdiag',
  '.seqdiag': 'seqdiag',
  '.actdiag': 'actdiag',
  '.nwdiag': 'nwdiag',
  '.packetdiag': 'packetdiag',
  '.rackdiag': 'rackdiag',

  // Database & Data
  '.erd': 'erd',
  '.dbml': 'dbml',

  // Business Process
  '.bpmn': 'bpmn',

  // Other diagram types
  '.nomnoml': 'nomnoml',
  '.ditaa': 'ditaa',
  '.svgbob': 'svgbob',
  '.pikchr': 'pikchr',
  '.umlet': 'umlet',
  '.excalidraw': 'excalidraw',
  '.structurizr': 'structurizr',

  // Visualization
  '.vega': 'vega',
  '.vegalite': 'vegalite',
  '.vl': 'vegalite',

  // Timing diagrams
  '.wavedrom': 'wavedrom',

  // Wiring diagrams
  '.wireviz': 'wireviz',

  // Bytefield
  '.bytefield': 'bytefield'
};

// Static formats - served as-is
const staticFormats = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

/**
 * Get the Kroki diagram type for a file extension
 * @param {string} ext - File extension (e.g., '.puml')
 * @returns {string|null} - Kroki diagram type or null if not supported
 */
function getDiagramType(ext) {
  const normalizedExt = ext.toLowerCase();
  return dynamicFormats[normalizedExt] || null;
}

/**
 * Get the MIME type for a static file extension
 * @param {string} ext - File extension (e.g., '.png')
 * @returns {string|null} - MIME type or null if not supported
 */
function getStaticMimeType(ext) {
  const normalizedExt = ext.toLowerCase();
  return staticFormats[normalizedExt] || null;
}

/**
 * Check if a file extension is a dynamic diagram format
 * @param {string} ext - File extension
 * @returns {boolean}
 */
function isDynamicFormat(ext) {
  return getDiagramType(ext) !== null;
}

/**
 * Check if a file extension is a static image format
 * @param {string} ext - File extension
 * @returns {boolean}
 */
function isStaticFormat(ext) {
  return getStaticMimeType(ext) !== null;
}

/**
 * Check if a file extension is supported (either dynamic or static)
 * @param {string} ext - File extension
 * @returns {boolean}
 */
function isSupportedFormat(ext) {
  return isDynamicFormat(ext) || isStaticFormat(ext);
}

/**
 * Get all supported dynamic format extensions
 * @returns {string[]}
 */
function getDynamicExtensions() {
  return Object.keys(dynamicFormats);
}

/**
 * Get all supported static format extensions
 * @returns {string[]}
 */
function getStaticExtensions() {
  return Object.keys(staticFormats);
}

/**
 * Get all supported format extensions
 * @returns {string[]}
 */
function getAllExtensions() {
  return [...getDynamicExtensions(), ...getStaticExtensions()];
}

module.exports = {
  dynamicFormats,
  staticFormats,
  getDiagramType,
  getStaticMimeType,
  isDynamicFormat,
  isStaticFormat,
  isSupportedFormat,
  getDynamicExtensions,
  getStaticExtensions,
  getAllExtensions
};
