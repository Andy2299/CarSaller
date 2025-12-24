import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validators";

async function ensureOwnership(vehicleId: string, userId: string, tenantId: string | null) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return null;
  if (vehicle.tenantId && vehicle.tenantId === tenantId) return vehicle;
  if (vehicle.sellerId === userId) return vehicle;
  return undefined;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { tenant: true, seller: true } });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vehicle = await ensureOwnership(params.id, session.user.id, session.user.tenantId ?? null);
  if (vehicle === undefined) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (vehicle === null) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const json = await request.json();
  const parsed = vehicleSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await prisma.vehicle.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const vehicle = await ensureOwnership(params.id, session.user.id, session.user.tenantId ?? null);
  if (vehicle === undefined) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (vehicle === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
