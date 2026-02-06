import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/user";

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  message: string;
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

interface TicketReply {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  authorName: string;
  attachments?: FileAttachment[];
}

interface CreateTicketRequest {
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  message: string;
  attachments?: FileAttachment[];
}

// Mock tickets data - In production, replace with actual database calls
let mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    subject: "Unable to complete KYC verification",
    category: "kyc",
    priority: "high",
    status: "in_progress",
    message: "I've been trying to complete my KYC verification for the past 3 days but the document upload keeps failing. I've tried different browsers and file formats but nothing works. Please help.",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-16T14:20:00.000Z",
    replies: [
      {
        id: "REP-001",
        message: "Thank you for reaching out. We apologize for the inconvenience. Can you please confirm what file format and size you're trying to upload? Our system accepts PNG, JPG, and PDF files up to 10MB.",
        isStaff: true,
        createdAt: "2024-01-15T14:00:00.000Z",
        authorName: "Support Team",
      },
      {
        id: "REP-002",
        message: "I've been uploading a JPG file that's about 2MB. It gets stuck at 50% every time.",
        isStaff: false,
        createdAt: "2024-01-16T09:30:00.000Z",
        authorName: "You",
      },
      {
        id: "REP-003",
        message: "Thank you for the information. We've identified an issue with our upload service and are working on a fix. We'll notify you once it's resolved. In the meantime, you can try using our mobile app which has a separate upload system.",
        isStaff: true,
        createdAt: "2024-01-16T14:20:00.000Z",
        authorName: "Support Team",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Question about investment returns",
    category: "investment",
    priority: "medium",
    status: "resolved",
    message: "I'd like to understand how the projected returns are calculated for the renewable energy project. The documentation mentions 12% annual returns but I want to know what factors could affect this.",
    createdAt: "2024-01-10T08:15:00.000Z",
    updatedAt: "2024-01-12T16:45:00.000Z",
    replies: [
      {
        id: "REP-004",
        message: "Great question! The projected 12% annual return is based on historical performance data and current market conditions. Factors that could affect returns include: energy prices, government incentives, operational costs, and overall market demand. Would you like me to send you our detailed investment prospectus?",
        isStaff: true,
        createdAt: "2024-01-11T10:00:00.000Z",
        authorName: "Investment Team",
      },
      {
        id: "REP-005",
        message: "Yes, please send the prospectus. That would be very helpful.",
        isStaff: false,
        createdAt: "2024-01-12T11:20:00.000Z",
        authorName: "You",
      },
      {
        id: "REP-006",
        message: "The prospectus has been sent to your registered email address. Please let us know if you have any other questions. I'm marking this ticket as resolved, but feel free to reopen it if you need further assistance.",
        isStaff: true,
        createdAt: "2024-01-12T16:45:00.000Z",
        authorName: "Investment Team",
      },
    ],
  },
];

// GET - Fetch all support tickets for user
export async function GET(request: NextRequest) {
  try {
    // In production:
    // 1. Get user ID from session/token
    // const userId = await getUserIdFromSession(request);
    // 2. Fetch tickets from database where userId matches
    // const tickets = await db.supportTickets.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: 'desc' },
    //   include: { replies: true }
    // });

    const response: ApiResponse<SupportTicket[]> = {
      success: true,
      data: mockTickets,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to fetch tickets",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const body: CreateTicketRequest = await request.json();

    // Validate inputs
    if (!body.subject || !body.category || !body.message) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Subject, category, and message are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (body.message.length < 20) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Please provide more details in your message",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // In production:
    // 1. Get user ID from session/token
    // const userId = await getUserIdFromSession(request);
    // 2. Create ticket in database
    // const ticket = await db.supportTickets.create({
    //   data: {
    //     userId,
    //     subject: body.subject,
    //     category: body.category,
    //     priority: body.priority || 'medium',
    //     status: 'open',
    //     message: body.message,
    //   }
    // });
    // 3. Send notification email to support team
    // await sendSupportNotification(ticket);

    const newTicket: SupportTicket = {
      id: `TKT-${String(mockTickets.length + 1).padStart(3, "0")}`,
      subject: body.subject,
      category: body.category,
      priority: body.priority || "medium",
      status: "open",
      message: body.message,
      attachments: body.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };

    mockTickets = [newTicket, ...mockTickets];

    const response: ApiResponse<SupportTicket> = {
      success: true,
      data: newTicket,
      message: "Support ticket created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to create ticket",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
