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
    const existing = await prisma.investmentOption.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Investment option not found" }, { status: 404 });
    }

    const body = await request.json();
    const errors: ValidationError[] = [];
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = sanitizeString(body.title, 200);
      if (!title) errors.push({ field: "title", message: "Title cannot be empty" });
      else updateData.title = title;
    }
    if (body.image !== undefined) {
      const image = validateImagePath(body.image);
      if (!image) errors.push({ field: "image", message: "Valid image path required" });
      else updateData.image = image;
    }
    if (body.minInvestment !== undefined) {
      const minInvestment = sanitizeString(body.minInvestment, 50);
      if (!minInvestment) errors.push({ field: "minInvestment", message: "Cannot be empty" });
      else updateData.minInvestment = minInvestment;
    }
    if (body.description !== undefined) {
      const description = sanitizeString(body.description, 2000);
      if (!description) errors.push({ field: "description", message: "Cannot be empty" });
      else updateData.description = description;
    }
    if (body.link !== undefined) {
      const link = validateUrl(body.link);
      if (!link) errors.push({ field: "link", message: "Valid link required" });
      else updateData.link = link;
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

    const updated = await prisma.investmentOption.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: updated, message: "Investment option updated" });
  } catch (error) {
    console.error("Failed to update investment option:", error);
    return NextResponse.json({ success: false, message: "Failed to update investment option" }, { status: 500 });
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
    const existing = await prisma.investmentOption.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Investment option not found" }, { status: 404 });
    }

    await prisma.investmentOption.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Investment option deactivated" });
  } catch (error) {
    console.error("Failed to delete investment option:", error);
    return NextResponse.json({ success: false, message: "Failed to delete investment option" }, { status: 500 });
  }
}
