import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";

export async function getProperties(req: Request, res: Response) {
  try {
    const { type, location } = req.query;

    const where: Record<string, unknown> = { isActive: true };

    if (type && typeof type === "string") {
      where.type = type;
    }

    if (location && typeof location === "string") {
      where.location = { contains: location, mode: "insensitive" };
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return success(res, properties);
  } catch (err) {
    return error(res, "Failed to fetch properties", 500);
  }
}

export async function getProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id, isActive: true },
    });

    if (!property) {
      return error(res, "Property not found", 404);
    }

    return success(res, property);
  } catch (err) {
    return error(res, "Failed to fetch property", 500);
  }
}

export async function getFeatured(req: Request, res: Response) {
  try {
    const properties = await prisma.property.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return success(res, properties);
  } catch (err) {
    return error(res, "Failed to fetch featured properties", 500);
  }
}
