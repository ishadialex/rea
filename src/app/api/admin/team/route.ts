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

export async function GET(request: NextRequest) {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team members" },
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

    const role = sanitizeString(body.role, 100);
    if (!role) errors.push({ field: "role", message: "Role is required (max 100 chars)" });

    const image = validateImagePath(body.image);
    if (!image) errors.push({ field: "image", message: "Valid image path required (/images/... or https://...)" });

    const instagram = body.instagram != null ? validateUrl(body.instagram) : null;
    if (body.instagram && !instagram) {
      errors.push({ field: "instagram", message: "Instagram must be a valid https URL" });
    }

    const order = body.order !== undefined ? validateInt(body.order, 0, 100) : 0;
    if (body.order !== undefined && order === null) {
      errors.push({ field: "order", message: "Order must be an integer 0-100" });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: formatValidationErrors(errors) },
        { status: 400 },
      );
    }

    const member = await prisma.teamMember.create({
      data: { name: name!, role: role!, image: image!, instagram, order: order ?? 0 },
    });

    return NextResponse.json(
      { success: true, data: member, message: "Team member created" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create team member:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create team member" },
      { status: 500 },
    );
  }
}
