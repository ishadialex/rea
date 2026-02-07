import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";

export async function deposit(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { method, amount, details } = req.body;

    const [operation] = await prisma.$transaction([
      prisma.fundOperation.create({
        data: {
          userId,
          type: "deposit",
          method,
          amount,
          status: "completed",
          details: JSON.stringify(details || {}),
          completedAt: new Date(),
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "deposit",
          amount,
          status: "completed",
          description: `Deposit via ${method}`,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      }),
    ]);

    return success(res, operation, "Deposit successful", 201);
  } catch (err) {
    return error(res, "Failed to process deposit", 500);
  }
}

export async function withdraw(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { method, amount, details } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return error(res, "User not found", 404);
    }

    if (user.balance < amount) {
      return error(res, "Insufficient balance");
    }

    const [operation] = await prisma.$transaction([
      prisma.fundOperation.create({
        data: {
          userId,
          type: "withdrawal",
          method,
          amount,
          status: "completed",
          details: JSON.stringify(details || {}),
          completedAt: new Date(),
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "withdrawal",
          amount: -amount,
          status: "completed",
          description: `Withdrawal via ${method}`,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return success(res, operation, "Withdrawal successful", 201);
  } catch (err) {
    return error(res, "Failed to process withdrawal", 500);
  }
}

export async function getHistory(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const operations = await prisma.fundOperation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return success(res, operations);
  } catch (err) {
    return error(res, "Failed to fetch fund history", 500);
  }
}
