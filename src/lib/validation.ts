/**
 * Sanitize a string: trim whitespace, remove null bytes, limit length.
 */
export function sanitizeString(value: unknown, maxLength: number = 500): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\0/g, "").trim();
  if (cleaned.length === 0) return null;
  if (cleaned.length > maxLength) return cleaned.substring(0, maxLength);
  return cleaned;
}

/**
 * Validate that a value is a safe integer within range.
 */
export function validateInt(value: unknown, min: number = 0, max: number = 999999): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

/**
 * Validate a URL string (relative path or https URL only).
 */
export function validateUrl(value: unknown): string | null {
  const str = sanitizeString(value, 2000);
  if (!str) return null;

  if (str.startsWith("/")) return str;

  try {
    const url = new URL(str);
    if (url.protocol !== "https:") return null;
    return str;
  } catch {
    return null;
  }
}

/**
 * Validate an image path (relative /images/... path or https URL).
 */
export function validateImagePath(value: unknown): string | null {
  const str = sanitizeString(value, 1000);
  if (!str) return null;

  if (str.startsWith("/images/")) return str;

  try {
    const url = new URL(str);
    if (url.protocol !== "https:") return null;
    return str;
  } catch {
    return null;
  }
}

/**
 * Validate a star rating (1-5).
 */
export function validateStarRating(value: unknown): number | null {
  return validateInt(value, 1, 5);
}

export interface ValidationError {
  field: string;
  message: string;
}

export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const error of errors) {
    result[error.field] = error.message;
  }
  return result;
}
