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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    const body = await request.json();
    const errors: ValidationError[] = [];
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = sanitizeString(body.name, 100);
      if (!name) errors.push({ field: "name", message: "Name cannot be empty" });
      else updateData.name = name;
    }
    if (body.designation !== undefined) {
      const designation = sanitizeString(body.designation, 200);
      if (!designation) errors.push({ field: "designation", message: "Designation cannot be empty" });
      else updateData.designation = designation;
    }
    if (body.content !== undefined) {
      const content = sanitizeString(body.content, 1000);
      if (!content) errors.push({ field: "content", message: "Content cannot be empty" });
      else updateData.content = content;
    }
    if (body.image !== undefined) {
      const image = validateImagePath(body.image);
      if (!image) errors.push({ field: "image", message: "Valid image path required" });
      else updateData.image = image;
    }
    if (body.star !== undefined) {
      const star = validateStarRating(body.star);
      if (star === null) errors.push({ field: "star", message: "Must be 1-5" });
      else updateData.star = star;
    }
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") errors.push({ field: "isActive", message: "Must be a boolean" });
      else updateData.isActive = body.isActive;
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: formatValidationErrors(errors) },
        { status: 400 },
      );
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.testimonial.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: updated, message: "Testimonial updated" });
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return NextResponse.json({ success: false, message: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    await prisma.testimonial.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Testimonial deactivated" });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json({ success: false, message: "Failed to delete testimonial" }, { status: 500 });
  }
}
