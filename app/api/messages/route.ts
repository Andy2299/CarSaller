import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { messageSchema } from "@/lib/validators";
import { getIO } from "@/lib/socket";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const authorized =
    conversation.buyerId === session.user.id ||
    conversation.sellerId === session.user.id ||
    (conversation.tenantId && conversation.tenantId === session.user.tenantId);
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = messageSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({ where: { id: parsed.data.conversationId } });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const authorized =
    conversation.buyerId === session.user.id ||
    conversation.sellerId === session.user.id ||
    (conversation.tenantId && conversation.tenantId === session.user.tenantId);
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const message = await prisma.message.create({
    data: {
      content: parsed.data.content,
      senderId: session.user.id,
      conversationId: parsed.data.conversationId,
    },
  });

  getIO()?.to(parsed.data.conversationId).emit("message", message);

  return NextResponse.json(message, { status: 201 });
}
