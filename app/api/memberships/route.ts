import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { membershipSchema } from "@/lib/validators";

export async function GET() {
  const memberships = await prisma.membership.findMany({ include: { user: true, tenant: true } });
  return NextResponse.json(memberships);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = membershipSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (session.user.tenantId !== parsed.data.tenantId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const membership = await prisma.membership.create({ data: parsed.data });
  return NextResponse.json(membership, { status: 201 });
}
