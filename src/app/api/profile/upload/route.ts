import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

// POST - Upload profile photo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      const response: ApiResponse<null> = {
        success: false,
        message: "No file uploaded",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const response: ApiResponse<null> = {
        success: false,
        message: "File size exceeds 5MB limit",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll simulate the upload and return a mock URL

    // Read the file as base64 for preview purposes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // In production, you would:
    // 1. Upload to cloud storage
    // 2. Return the CDN URL
    // const uploadResult = await uploadToCloudStorage(buffer, file.name);

    const response: ApiResponse<{ url: string }> = {
      success: true,
      data: {
        url: dataUrl, // In production, this would be the CDN URL
      },
      message: "Photo uploaded successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to upload photo",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
