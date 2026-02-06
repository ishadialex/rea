import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

// Mock sessions data - In production, replace with actual session management
const mockSessions: ActiveSession[] = [
  {
    id: "session_001",
    device: "Windows 11",
    browser: "Chrome 120",
    location: "New York, US",
    lastActive: "Now",
    current: true,
  },
  {
    id: "session_002",
    device: "iPhone 15",
    browser: "Safari Mobile",
    location: "New York, US",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "session_003",
    device: "MacBook Pro",
    browser: "Firefox 121",
    location: "Boston, US",
    lastActive: "Yesterday",
    current: false,
  },
];

// GET - Fetch active sessions
export async function GET(request: NextRequest) {
  try {
    // In production:
    // 1. Get user ID from session/token
    // 2. Fetch all active sessions for the user from database
    // 3. Mark current session

    const response: ApiResponse<ActiveSession[]> = {
      success: true,
      data: mockSessions,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to fetch sessions",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
