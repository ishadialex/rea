import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export async function getSettings(req: Request, res: Response) {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId: req.userId! },
      });
    }

    return success(res, {
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      marketingEmails: settings.marketingEmails,
      loginAlerts: settings.loginAlerts,
      sessionTimeout: settings.sessionTimeout,
    });
  } catch (err) {
    console.error("getSettings error:", err);
    return error(res, "Failed to fetch settings", 500);
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const allowedFields = [
      "emailNotifications",
      "pushNotifications",
      "marketingEmails",
      "loginAlerts",
      "sessionTimeout",
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.userId },
      update: data,
      create: { userId: req.userId!, ...data },
    });

    return success(
      res,
      {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        marketingEmails: settings.marketingEmails,
        loginAlerts: settings.loginAlerts,
        sessionTimeout: settings.sessionTimeout,
      },
      "Settings updated successfully"
    );
  } catch (err) {
    console.error("updateSettings error:", err);
    return error(res, "Failed to update settings", 500);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return error(res, "User not found", 404);
    }

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) {
      return error(res, "Current password is incorrect", 401);
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.userId },
      data: { passwordHash: newHash },
    });

    return success(res, null, "Password changed successfully");
  } catch (err) {
    console.error("changePassword error:", err);
    return error(res, "Failed to change password", 500);
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    await prisma.user.update({
      where: { id: req.userId },
      data: { isActive: false },
    });

    // Deactivate all sessions for the user
    await prisma.session.updateMany({
      where: { userId: req.userId },
      data: { isActive: false },
    });

    return success(res, null, "Account has been deactivated");
  } catch (err) {
    console.error("deleteAccount error:", err);
    return error(res, "Failed to delete account", 500);
  }
}
