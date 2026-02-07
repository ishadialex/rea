import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";

export async function getTransactions(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { type, limit } = req.query;

    const where: Record<string, unknown> = { userId };

    if (type && typeof type === "string") {
      where.type = type;
    }

    const take = limit ? Math.min(parseInt(limit as string, 10), 100) : 50;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
    });

    return success(res, transactions);
  } catch (err) {
    return error(res, "Failed to fetch transactions", 500);
  }
}

export async function getTransaction(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id, userId },
    });

    if (!transaction) {
      return error(res, "Transaction not found", 404);
    }

    return success(res, transaction);
  } catch (err) {
    return error(res, "Failed to fetch transaction", 500);
  }
}
