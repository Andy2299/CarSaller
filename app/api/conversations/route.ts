import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { conversationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId");

  const conversations = await prisma.conversation.findMany({
    where: {
      ...(vehicleId ? { vehicleId } : {}),
      OR: [
        { buyerId: session.user.id },
        { sellerId: session.user.id },
        { tenantId: session.user.tenantId ?? undefined },
      ],
    },
    include: { vehicle: true },
  });

  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = conversationSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const conversation = await prisma.conversation.create({
    data: {
      vehicleId: parsed.data.vehicleId,
      buyerId: session.user.id,
      sellerId: parsed.data.sellerId,
      tenantId: parsed.data.tenantId,
    },
  });

  return NextResponse.json(conversation, { status: 201 });
}
