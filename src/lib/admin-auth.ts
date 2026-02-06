import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface ErrorResponse {
  success: false;
  message: string;
}

/**
 * Validates the admin API key from the Authorization header.
 * Returns null if valid, or a NextResponse error if invalid.
 */
export function validateAdminAuth(request: NextRequest): NextResponse<ErrorResponse> | null {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey || adminApiKey.length < 32) {
    console.error("ADMIN_API_KEY is not configured or is too short (minimum 32 characters)");
    return NextResponse.json(
      { success: false as const, message: "Admin access is not configured" },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { success: false as const, message: "Authorization header is required" },
      { status: 401 },
    );
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return NextResponse.json(
      { success: false as const, message: "Invalid authorization format. Expected: Bearer <api_key>" },
      { status: 401 },
    );
  }

  const providedKey = parts[1];

  if (!timingSafeEqual(providedKey, adminApiKey)) {
    return NextResponse.json(
      { success: false as const, message: "Invalid API key" },
      { status: 403 },
    );
  }

  return null;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");

  return crypto.timingSafeEqual(bufA, bufB);
}
