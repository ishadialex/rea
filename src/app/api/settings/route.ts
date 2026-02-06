import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

// Mock settings - In production, replace with actual database calls
let mockUserSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  twoFactorEnabled: false,
  loginAlerts: true,
  sessionTimeout: 30,
};

// GET - Fetch user settings
export async function GET(request: NextRequest) {
  try {
    // In production, get user ID from session/token
    // const userId = await getUserIdFromSession(request);

    const response: ApiResponse<UserSettings> = {
      success: true,
      data: mockUserSettings,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to fetch settings",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body: Partial<UserSettings> = await request.json();

    // Update the settings (in production, update database)
    mockUserSettings = {
      ...mockUserSettings,
      ...body,
    };

    const response: ApiResponse<UserSettings> = {
      success: true,
      data: mockUserSettings,
      message: "Settings updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to update settings",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
