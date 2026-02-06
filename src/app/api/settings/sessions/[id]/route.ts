import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

// DELETE - Revoke a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    // In production:
    // 1. Get user ID from session/token
    // 2. Verify the session belongs to the user
    // 3. Delete/invalidate the session from database
    // 4. If using JWT, add to blacklist

    if (!sessionId) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Session ID is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: "Session revoked successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to revoke session",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
