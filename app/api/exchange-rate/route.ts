import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exchangeRateSchema } from "@/lib/validators";

export async function GET() {
  const rate = await prisma.exchangeRate.findFirst({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(rate);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const parsed = exchangeRateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const rate = await prisma.exchangeRate.create({ data: parsed.data });
  return NextResponse.json(rate, { status: 201 });
}
