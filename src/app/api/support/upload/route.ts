import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Allowed file types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// POST - Upload file for support ticket
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      const response: ApiResponse<null> = {
        success: false,
        message: "No file provided",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const response: ApiResponse<null> = {
        success: false,
        message: "File type not allowed. Please upload images, PDFs, or documents.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const response: ApiResponse<null> = {
        success: false,
        message: "File size exceeds 10MB limit",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // In production:
    // 1. Get user ID from session/token
    // const userId = await getUserIdFromSession(request);
    // 2. Generate unique filename
    // const uniqueFilename = `${userId}/${Date.now()}-${file.name}`;
    // 3. Upload to cloud storage (S3, GCS, Cloudinary, etc.)
    // const uploadResult = await cloudStorage.upload(file, uniqueFilename);
    // 4. Save file metadata to database
    // const fileRecord = await db.supportAttachments.create({
    //   data: {
    //     userId,
    //     filename: file.name,
    //     fileSize: file.size,
    //     mimeType: file.type,
    //     storageUrl: uploadResult.url,
    //   }
    // });
    // 5. Return file URL

    // For mock, convert to base64 data URL (not recommended for production)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const uploadedFile: UploadedFile = {
      id: `FILE-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: dataUrl,
      uploadedAt: new Date().toISOString(),
    };

    const response: ApiResponse<UploadedFile> = {
      success: true,
      data: uploadedFile,
      message: "File uploaded successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to upload file",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
