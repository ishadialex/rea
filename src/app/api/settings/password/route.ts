import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// PUT - Change user password
export async function PUT(request: NextRequest) {
  try {
    const body: ChangePasswordRequest = await request.json();

    // Validate inputs
    if (!body.currentPassword || !body.newPassword) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Current and new password are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (body.newPassword.length < 8) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Password must be at least 8 characters",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // In production:
    // 1. Get user ID from session/token
    // 2. Verify current password against stored hash
    // 3. Hash new password
    // 4. Update password in database
    // 5. Optionally invalidate other sessions

    // Mock validation - in production, verify against actual stored password
    // For demo purposes, we'll accept any current password

    const response: ApiResponse<null> = {
      success: true,
      message: "Password changed successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to change password",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
