import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "manager", "agent"]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const json = await request.json();
  const parsed = inviteSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const invitation = await prisma.invitation.create({
    data: {
      tenantId: session.user.tenantId,
      email: parsed.data.email,
      role: parsed.data.role,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return NextResponse.json(invitation, { status: 201 });
}
