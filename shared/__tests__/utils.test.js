import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, log, healthCheck } from '../utils.js';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('returns the date in ISO format', () => {
      // Use a fixed date for testing
      const testDate = new Date('2025-01-15T10:30:00Z');
      expect(formatDate(testDate)).toBe('2025-01-15T10:30:00.000Z');
    });

    it('uses current date when no parameter is provided', () => {
      // Mock the current date
      const mockDate = new Date('2025-05-22T12:00:00Z');
      const originalDate = global.Date;
      global.Date = vi.fn(() => mockDate);
      
      expect(formatDate()).toBe('2025-05-22T12:00:00.000Z');
      
      // Restore original Date
      global.Date = originalDate;
    });
  });

  describe('log', () => {
    let originalDate;
    let fixedDate;

    beforeEach(() => {
      // Mock console methods
      console.info = vi.fn();
      console.warn = vi.fn();
      console.error = vi.fn();
      
      // Setup a fixed date properly to avoid recursion
      fixedDate = new Date('2025-05-22T12:00:00Z');
      originalDate = global.Date;
      global.Date = vi.fn(() => fixedDate);
    });

    afterEach(() => {
      // Restore original Date
      global.Date = originalDate;
      vi.restoreAllMocks();
    });

    it('logs info message correctly', () => {
      log('test-service', 'info', 'This is an info message');
      expect(console.info).toHaveBeenCalledWith(
        '[2025-05-22T12:00:00.000Z][test-service][INFO] This is an info message',
        ''
      );
    });

    it('logs warning message correctly', () => {
      log('test-service', 'warn', 'This is a warning');
      expect(console.warn).toHaveBeenCalledWith(
        '[2025-05-22T12:00:00.000Z][test-service][WARN] This is a warning',
        ''
      );
    });

    it('logs error message correctly with data', () => {
      const errorData = { code: 500, message: 'Server error' };
      log('test-service', 'error', 'This is an error', errorData);
      expect(console.error).toHaveBeenCalledWith(
        '[2025-05-22T12:00:00.000Z][test-service][ERROR] This is an error',
        errorData
      );
    });
  });

  describe('healthCheck', () => {
    let originalDate;
    let fixedDate;

    beforeEach(() => {
      // Setup a fixed date properly to avoid recursion
      fixedDate = new Date('2025-05-22T12:00:00Z');
      originalDate = global.Date;
      global.Date = vi.fn(() => fixedDate);
    });

    afterEach(() => {
      // Restore original Date
      global.Date = originalDate;
      vi.restoreAllMocks();
    });

    it('returns correct health check object with default values', () => {
      const result = healthCheck('test-service');
      expect(result).toEqual({
        status: 'ok',
        service: 'test-service',
        timestamp: '2025-05-22T12:00:00.000Z'
      });
    });

    it('includes additional data when provided', () => {
      const additionalData = {
        version: '1.0.0',
        uptime: 3600
      };
      
      const result = healthCheck('test-service', additionalData);
      
      expect(result).toEqual({
        status: 'ok',
        service: 'test-service',
        timestamp: '2025-05-22T12:00:00.000Z',
        version: '1.0.0',
        uptime: 3600
      });
    });
  });
});