import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminAuth } from "@/lib/admin-auth";
import {
  sanitizeString,
  validateImagePath,
  validateStarRating,
  ValidationError,
  formatValidationErrors,
} from "@/lib/validation";

export async function GET(request: NextRequest) {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const errors: ValidationError[] = [];

    const name = sanitizeString(body.name, 100);
    if (!name) errors.push({ field: "name", message: "Name is required (max 100 chars)" });

    const designation = sanitizeString(body.designation, 200);
    if (!designation) errors.push({ field: "designation", message: "Designation is required (max 200 chars)" });

    const content = sanitizeString(body.content, 1000);
    if (!content) errors.push({ field: "content", message: "Content is required (max 1000 chars)" });

    const image = validateImagePath(body.image);
    if (!image) errors.push({ field: "image", message: "Valid image path required (/images/... or https://...)" });

    const star = body.star !== undefined ? validateStarRating(body.star) : 5;
    if (body.star !== undefined && star === null) {
      errors.push({ field: "star", message: "Star rating must be an integer 1-5" });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: formatValidationErrors(errors) },
        { status: 400 },
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: { name: name!, designation: designation!, content: content!, image: image!, star: star ?? 5 },
    });

    return NextResponse.json(
      { success: true, data: testimonial, message: "Testimonial created" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 },
    );
  }
}
