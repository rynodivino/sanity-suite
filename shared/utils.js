/**
 * Common utility functions for all services in the sanity-suite
 */

/**
 * Formats a date in ISO format
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export function formatDate(date = new Date()) {
  return date.toISOString();
}

/**
 * Simple logging utility with timestamps
 * @param {string} service - The service name 
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {object} data - Optional data to include
 */
export function log(service, level, message, data = {}) {
  console[level](`[${formatDate()}][${service}][${level.toUpperCase()}] ${message}`, 
    Object.keys(data).length > 0 ? data : '');
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
    ...additionalData
  };
}