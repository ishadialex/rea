import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";

export async function getTickets(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return success(res, tickets);
  } catch (err) {
    return error(res, "Failed to fetch tickets", 500);
  }
}

export async function createTicket(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { subject, category, priority, message } = req.body;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        category,
        priority,
        messages: {
          create: {
            senderId: userId,
            senderType: "user",
            message,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return success(res, ticket, "Ticket created", 201);
  } catch (err) {
    return error(res, "Failed to create ticket", 500);
  }
}

export async function getTicket(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id, userId },
      include: {
        messages: {
          include: {
            attachments: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return error(res, "Ticket not found", 404);
    }

    return success(res, ticket);
  } catch (err) {
    return error(res, "Failed to fetch ticket", 500);
  }
}

export async function updateTicket(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { status } = req.body;

    const existing = await prisma.supportTicket.findUnique({
      where: { id, userId },
    });

    if (!existing) {
      return error(res, "Ticket not found", 404);
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: { status },
    });

    return success(res, ticket, "Ticket updated");
  } catch (err) {
    return error(res, "Failed to update ticket", 500);
  }
}

export async function replyTicket(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { message } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id, userId },
    });

    if (!ticket) {
      return error(res, "Ticket not found", 404);
    }

    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId: userId,
        senderType: "user",
        message,
      },
    });

    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return success(res, ticketMessage, "Reply sent", 201);
  } catch (err) {
    return error(res, "Failed to send reply", 500);
  }
}

export async function uploadAttachment(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const file = req.file;

    if (!file) {
      return error(res, "No file uploaded");
    }

    const attachment = await prisma.fileAttachment.create({
      data: {
        userId,
        messageId: req.body.messageId || null,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: `/uploads/${file.filename}`,
        context: req.body.context || "support",
      },
    });

    return success(res, attachment, "File uploaded", 201);
  } catch (err) {
    return error(res, "Failed to upload file", 500);
  }
}
