import { NextRequest, NextResponse } from "next/server";
import { UserProfile, UpdateProfileRequest, ApiResponse } from "@/types/user";

// Mock database - In production, replace with actual database calls
let mockUserProfile: UserProfile = {
  id: "user_001",
  email: "admin@alvaradoassociatepartners.com",
  firstName: "Admin",
  lastName: "User",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-01-15",
  nationality: "United States",
  address: "123 Main Street, Suite 100",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "USA",
  profilePhoto: null,
  bio: "Passionate investor focused on real estate and sustainable energy projects.",
  occupation: "Investment Manager",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: new Date().toISOString(),
};

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    // In production, get user ID from session/token
    // const userId = await getUserIdFromSession(request);

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: mockUserProfile,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to fetch profile",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateProfileRequest = await request.json();

    // Validate required fields
    const errors: Record<string, string> = {};

    if (body.firstName !== undefined && body.firstName.trim() === "") {
      errors.firstName = "First name is required";
    }

    if (body.lastName !== undefined && body.lastName.trim() === "") {
      errors.lastName = "Last name is required";
    }

    if (body.phone !== undefined && body.phone.trim() === "") {
      errors.phone = "Phone number is required";
    }

    if (Object.keys(errors).length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validation failed",
        errors,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update the profile (in production, update database)
    mockUserProfile = {
      ...mockUserProfile,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: mockUserProfile,
      message: "Profile updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to update profile",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH - Partial update (e.g., just profile photo)
export async function PATCH(request: NextRequest) {
  try {
    const body: Partial<UpdateProfileRequest> = await request.json();

    // Update only provided fields
    mockUserProfile = {
      ...mockUserProfile,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: mockUserProfile,
      message: "Profile updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to update profile",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
