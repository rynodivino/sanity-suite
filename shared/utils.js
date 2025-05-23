/**
 * Common utility functions for all services in the sanity-suite
 */

import debug from 'debug';

// Create namespaced debuggers object cache
const debuggers = {};

/**
 * Formats a date in ISO format
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export function formatDate(date = new Date()) {
  return date.toISOString()
}

/**
 * Advanced logging utility with debug module integration
 * @param {string} service - The service name
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {object} data - Optional data to include
 */
export function log(service, level, message, data = {}) {
  // Get or create debugger for this service/level combination
  const namespace = `sanity-suite:${service}:${level}`;
  if (!debuggers[namespace]) {
    debuggers[namespace] = debug(namespace);
  }

  // Format message in the same style as before for compatibility
  const formattedMessage = `[${formatDate()}][${service}][${level.toUpperCase()}] ${message}`;
  
  // Use debug for debugging, but also send to console for backward compatibility
  debuggers[namespace](formattedMessage, Object.keys(data).length > 0 ? data : '');
  
  // Continue using console methods for backward compatibility
  console[level](
    formattedMessage,
    Object.keys(data).length > 0 ? data : ''
  );
}

/**
 * Health check function that returns standard response
 * @param {string} service - The service name
 * @param {object} additionalData - Additional health data to include
 * @returns {object} Health check response object
 */
export function healthCheck(service, additionalData = {}) {
  return {
    status: 'ok',
    service,
    timestamp: formatDate(),
    ...additionalData,
  }
}
