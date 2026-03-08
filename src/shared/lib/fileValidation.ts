/**
 * File Validation Utilities
 *
 * Pure functions for validating uploaded files
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Maximum allowed file size: 10MB in bytes
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed MIME types for image files
 */
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;

/**
 * Validates an image file
 *
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): ValidationResult {
  // Check if file is null or undefined
  if (file == null) {
    return {
      valid: false,
      error: 'File is required',
    };
  }

  // Check if file is a valid File object
  if (!(file instanceof File)) {
    return {
      valid: false,
      error: 'Invalid file object',
    };
  }

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      valid: false,
      error: `Invalid file type. Only PNG and JPEG images are allowed. Got: ${file.type}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${maxSizeMB}MB. Got: ${fileSizeMB}MB`,
    };
  }

  return {
    valid: true,
  };
}
