import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";

export async function getUserInvestments(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const investments = await prisma.userInvestment.findMany({
      where: { userId },
      include: {
        investmentOption: {
          select: {
            title: true,
            image: true,
            minInvestment: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(res, investments);
  } catch (err) {
    return error(res, "Failed to fetch investments", 500);
  }
}

export async function createInvestment(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { investmentOptionId, amount } = req.body;

    const option = await prisma.investmentOption.findUnique({
      where: { id: investmentOptionId },
    });

    if (!option) {
      return error(res, "Investment option not found", 404);
    }

    if (!option.isActive) {
      return error(res, "Investment option is no longer available");
    }

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

    const [investment] = await prisma.$transaction([
      prisma.userInvestment.create({
        data: {
          userId,
          investmentOptionId,
          amount,
          status: "active",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "investment",
          amount: -amount,
          status: "completed",
          description: `Investment in ${option.title}`,
          reference: investmentOptionId,
        },
      }),
    ]);

    return success(res, investment, "Investment created", 201);
  } catch (err) {
    return error(res, "Failed to create investment", 500);
  }
}
