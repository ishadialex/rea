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

interface TicketReply {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  authorName: string;
  attachments?: FileAttachment[];
}

interface CreateReplyRequest {
  message: string;
  attachments?: FileAttachment[];
}

// POST - Add reply to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const body: CreateReplyRequest = await request.json();

    // Validate input
    if (!body.message || body.message.trim().length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Message is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // In production:
    // 1. Get user ID from session/token
    // const userId = await getUserIdFromSession(request);
    // 2. Verify ticket exists and belongs to user
    // const ticket = await db.supportTickets.findUnique({
    //   where: { id: ticketId, userId }
    // });
    // if (!ticket) return 404
    // if (ticket.status === 'closed') return 400 (can't reply to closed ticket)
    // 3. Create reply in database
    // const reply = await db.ticketReplies.create({
    //   data: {
    //     ticketId,
    //     userId,
    //     message: body.message,
    //     isStaff: false
    //   }
    // });
    // 4. Update ticket's updatedAt timestamp
    // 5. Send notification to support team

    const newReply: TicketReply = {
      id: `REP-${Date.now()}`,
      message: body.message,
      isStaff: false,
      createdAt: new Date().toISOString(),
      authorName: "You",
      attachments: body.attachments || [],
    };

    const response: ApiResponse<TicketReply> = {
      success: true,
      data: newReply,
      message: "Reply sent successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to send reply",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
