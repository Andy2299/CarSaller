import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: Record<string, unknown> = {};

  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const province = searchParams.get("province");
  const status = searchParams.get("status") ?? "published";
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const mileage = searchParams.get("mileage");
  const tenantOnly = searchParams.get("tenantOnly");
  const privateOnly = searchParams.get("privateOnly");

  if (brand) filters.brand = brand;
  if (model) filters.model = model;
  if (province) filters.province = province;
  if (status) filters.status = status;
  if (tenantOnly === "true") filters.tenantId = { not: null };
  if (privateOnly === "true") filters.tenantId = null;

  if (minYear || maxYear) {
    filters.year = {
      gte: minYear ? Number(minYear) : undefined,
      lte: maxYear ? Number(maxYear) : undefined,
    };
  }

  if (minPrice || maxPrice) {
    filters.priceBase = {
      gte: minPrice ? Number(minPrice) : undefined,
      lte: maxPrice ? Number(maxPrice) : undefined,
    };
  }

  if (mileage) {
    filters.mileage = { lte: Number(mileage) };
  }

  const take = Number(searchParams.get("take") ?? 20);
  const skip = Number(searchParams.get("skip") ?? 0);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const order = searchParams.get("order") ?? "desc";

  const vehicles = await prisma.vehicle.findMany({
    where: filters,
    take,
    skip,
    orderBy: { [orderBy]: order },
    include: { tenant: true, seller: true },
  });

  return NextResponse.json(vehicles);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await request.json();
  const parsed = vehicleSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tenantId = parsed.data.tenantId ?? session.user.tenantId ?? null;

  const vehicle = await prisma.vehicle.create({
    data: {
      ...parsed.data,
      sellerId: tenantId ? null : session.user.id,
      tenantId,
      status: "published",
    },
  });

  return NextResponse.json(vehicle, { status: 201 });
}
