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
    const options = await prisma.investmentOption.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    console.error("Failed to fetch investment options:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch investment options" },
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

    const title = sanitizeString(body.title, 200);
    if (!title) errors.push({ field: "title", message: "Title is required (max 200 chars)" });

    const image = validateImagePath(body.image);
    if (!image) errors.push({ field: "image", message: "Valid image path required (/images/... or https://...)" });

    const minInvestment = sanitizeString(body.minInvestment, 50);
    if (!minInvestment) errors.push({ field: "minInvestment", message: "Minimum investment is required (max 50 chars)" });

    const description = sanitizeString(body.description, 2000);
    if (!description) errors.push({ field: "description", message: "Description is required (max 2000 chars)" });

    const link = validateUrl(body.link);
    if (!link) errors.push({ field: "link", message: "Valid link required (relative path or https URL)" });

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

    const option = await prisma.investmentOption.create({
      data: {
        title: title!,
        image: image!,
        minInvestment: minInvestment!,
        description: description!,
        link: link!,
        order: order ?? 0,
      },
    });

    return NextResponse.json(
      { success: true, data: option, message: "Investment option created" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create investment option:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create investment option" },
      { status: 500 },
    );
  }
}
