/**
 * File Validation Unit Tests
 *
 * Tests file validation utilities including MIME type and size validation
 */

import { describe, it, expect } from 'vitest';
import { validateImageFile, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '../../src/shared/lib/fileValidation.js';

describe('validateImageFile', () => {
  describe('Valid PNG files', () => {
    it('should accept a small PNG file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept a PNG file with 5MB size', () => {
      const content = new Array(5 * 1024 * 1024).fill('a').join('');
      const file = new File([content], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept a PNG file exactly at 10MB limit', () => {
      const content = new Array(MAX_FILE_SIZE).fill('a').join('');
      const file = new File([content], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Valid JPEG files', () => {
    it('should accept a small JPEG file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept a JPEG file with .jpeg extension', () => {
      const file = new File(['test'], 'test.jpeg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept a JPEG file with 5MB size', () => {
      const content = new Array(5 * 1024 * 1024).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept a JPEG file exactly at 10MB limit', () => {
      const content = new Array(MAX_FILE_SIZE).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Invalid file types', () => {
    it('should reject a text file', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
      expect(result.error).toContain('text/plain');
    });

    it('should reject a PDF file', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
      expect(result.error).toContain('application/pdf');
    });

    it('should reject a GIF file', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
      expect(result.error).toContain('image/gif');
    });

    it('should reject a WebP file', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
      expect(result.error).toContain('image/webp');
    });

    it('should reject an SVG file', () => {
      const file = new File(['test'], 'test.svg', { type: 'image/svg+xml' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
      expect(result.error).toContain('image/svg+xml');
    });
  });

  describe('File size validation', () => {
    it('should reject a file larger than 10MB', () => {
      const content = new Array(MAX_FILE_SIZE + 1).fill('a').join('');
      const file = new File([content], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum limit');
      expect(result.error).toContain('10MB');
    });

    it('should reject a file much larger than 10MB', () => {
      const content = new Array(20 * 1024 * 1024).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum limit');
      expect(result.error).toContain('10MB');
      expect(result.error).toContain('20.00');
    });

    it('should accept an empty file (0 bytes)', () => {
      const file = new File([], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should reject null', () => {
      const result = validateImageFile(null as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('File is required');
    });

    it('should reject undefined', () => {
      const result = validateImageFile(undefined as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('File is required');
    });

    it('should reject a plain object', () => {
      const result = validateImageFile({ name: 'test.png', size: 100 } as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid file object');
    });

    it('should reject a string', () => {
      const result = validateImageFile('test.png' as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid file object');
    });

    it('should reject a number', () => {
      const result = validateImageFile(123 as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid file object');
    });
  });

  describe('Constants', () => {
    it('should have correct MAX_FILE_SIZE constant', () => {
      expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
    });

    it('should have correct ALLOWED_IMAGE_TYPES constant', () => {
      expect(ALLOWED_IMAGE_TYPES).toEqual(['image/png', 'image/jpeg']);
      expect(ALLOWED_IMAGE_TYPES).toHaveLength(2);
    });
  });

  describe('Pure function behavior', () => {
    it('should not mutate the input file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const originalName = file.name;
      const originalSize = file.size;

      validateImageFile(file);

      expect(file.name).toBe(originalName);
      expect(file.size).toBe(originalSize);
    });

    it('should return consistent results for the same input', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result1 = validateImageFile(file);
      const result2 = validateImageFile(file);

      expect(result1).toEqual(result2);
    });
  });
});
