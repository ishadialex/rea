import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

interface Transfer {
  id: string;
  recipientEmail: string;
  recipientName: string;
  amount: number;
  note: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

interface TransferData {
  balance: number;
  transfers: Transfer[];
}

interface CreateTransferRequest {
  recipientEmail: string;
  amount: number;
  note?: string;
}

// Mock data - In production, replace with actual database calls
let mockBalance = 25000;
let mockTransfers: Transfer[] = [
  {
    id: "TRF-001",
    recipientEmail: "john.doe@example.com",
    recipientName: "John Doe",
    amount: 500,
    note: "Payment for services",
    status: "completed",
    createdAt: "2024-01-15T10:30:00.000Z",
    completedAt: "2024-01-15T10:30:05.000Z",
  },
  {
    id: "TRF-002",
    recipientEmail: "jane.smith@example.com",
    recipientName: "Jane Smith",
    amount: 1250,
    note: "Monthly rent share",
    status: "completed",
    createdAt: "2024-01-12T14:20:00.000Z",
    completedAt: "2024-01-12T14:20:03.000Z",
  },
  {
    id: "TRF-003",
    recipientEmail: "mike.wilson@example.com",
    recipientName: "Mike Wilson",
    amount: 75.5,
    note: "Dinner split",
    status: "completed",
    createdAt: "2024-01-10T19:45:00.000Z",
    completedAt: "2024-01-10T19:45:02.000Z",
  },
];

// GET - Fetch user balance and transfer history
export async function GET(request: NextRequest) {
  try {
    // In production:
    // 1. Get user ID from session/token
    // const userId = await getUserIdFromSession(request);
    // 2. Fetch balance from database
    // const user = await db.users.findUnique({ where: { id: userId } });
    // const balance = user.balance;
    // 3. Fetch transfer history from database
    // const transfers = await db.transfers.findMany({
    //   where: { senderId: userId },
    //   orderBy: { createdAt: 'desc' },
    //   take: 10,
    //   include: { recipient: { select: { email: true, name: true } } }
    // });

    const response: ApiResponse<TransferData> = {
      success: true,
      data: {
        balance: mockBalance,
        transfers: mockTransfers,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to fetch transfer data",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new transfer
export async function POST(request: NextRequest) {
  try {
    const body: CreateTransferRequest = await request.json();

    // Validate inputs
    if (!body.recipientEmail || !body.amount) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Recipient email and amount are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.recipientEmail)) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Invalid email address",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate amount
    if (body.amount <= 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Amount must be greater than 0",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check sufficient balance
    if (body.amount > mockBalance) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Insufficient balance",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // In production:
    // 1. Get user ID from session/token
    // const userId = await getUserIdFromSession(request);
    // 2. Find recipient by email
    // const recipient = await db.users.findUnique({ where: { email: body.recipientEmail } });
    // if (!recipient) return 404 (Recipient not found)
    // if (recipient.id === userId) return 400 (Cannot transfer to yourself)
    // 3. Start database transaction
    // await db.$transaction([
    //   db.users.update({ where: { id: userId }, data: { balance: { decrement: body.amount } } }),
    //   db.users.update({ where: { id: recipient.id }, data: { balance: { increment: body.amount } } }),
    //   db.transfers.create({ data: { senderId: userId, recipientId: recipient.id, amount: body.amount, note: body.note } })
    // ]);
    // 4. Send notification email to recipient
    // await sendTransferNotification(recipient.email, body.amount, senderName);

    // Mock recipient lookup (simulate finding user)
    const mockRecipientNames: Record<string, string> = {
      "john.doe@example.com": "John Doe",
      "jane.smith@example.com": "Jane Smith",
      "mike.wilson@example.com": "Mike Wilson",
    };

    const recipientName = mockRecipientNames[body.recipientEmail] ||
      body.recipientEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    // Create transfer
    const newTransfer: Transfer = {
      id: `TRF-${String(mockTransfers.length + 1).padStart(3, "0")}`,
      recipientEmail: body.recipientEmail,
      recipientName: recipientName,
      amount: body.amount,
      note: body.note || "",
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // Update mock data
    mockBalance -= body.amount;
    mockTransfers = [newTransfer, ...mockTransfers];

    const response: ApiResponse<{ transfer: Transfer; newBalance: number }> = {
      success: true,
      data: {
        transfer: newTransfer,
        newBalance: mockBalance,
      },
      message: `Successfully transferred $${body.amount.toLocaleString()} to ${recipientName}`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to process transfer",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
