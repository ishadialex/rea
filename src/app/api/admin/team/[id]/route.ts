import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminAuth } from "@/lib/admin-auth";
import {
  sanitizeString,
  validateInt,
  validateImagePath,
  validateUrl,
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
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    }

    const body = await request.json();
    const errors: ValidationError[] = [];
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = sanitizeString(body.name, 100);
      if (!name) errors.push({ field: "name", message: "Name cannot be empty" });
      else updateData.name = name;
    }
    if (body.role !== undefined) {
      const role = sanitizeString(body.role, 100);
      if (!role) errors.push({ field: "role", message: "Role cannot be empty" });
      else updateData.role = role;
    }
    if (body.image !== undefined) {
      const image = validateImagePath(body.image);
      if (!image) errors.push({ field: "image", message: "Valid image path required" });
      else updateData.image = image;
    }
    if (body.instagram !== undefined) {
      if (body.instagram === null || body.instagram === "") {
        updateData.instagram = null;
      } else {
        const instagram = validateUrl(body.instagram);
        if (!instagram) errors.push({ field: "instagram", message: "Must be a valid https URL" });
        else updateData.instagram = instagram;
      }
    }
    if (body.order !== undefined) {
      const order = validateInt(body.order, 0, 100);
      if (order === null) errors.push({ field: "order", message: "Must be 0-100" });
      else updateData.order = order;
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

    const updated = await prisma.teamMember.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: updated, message: "Team member updated" });
  } catch (error) {
    console.error("Failed to update team member:", error);
    return NextResponse.json({ success: false, message: "Failed to update team member" }, { status: 500 });
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
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    }

    await prisma.teamMember.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Team member deactivated" });
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return NextResponse.json({ success: false, message: "Failed to delete team member" }, { status: 500 });
  }
}
