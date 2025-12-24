import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import slugify from "slugify";

const tenantSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  province: z.string().min(1),
  city: z.string().min(1),
});

export async function GET() {
  const tenants = await prisma.tenant.findMany({ include: { memberships: true } });
  return NextResponse.json(tenants);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const parsed = tenantSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const slug = slugify(parsed.data.name, { lower: true, strict: true });

  const tenant = await prisma.tenant.create({
    data: {
      ...parsed.data,
      slug,
      memberships: {
        create: {
          role: "owner",
          userId: session.user.id,
        },
      },
    },
  });

  await prisma.user.update({ where: { id: session.user.id }, data: { tenantId: tenant.id } });

  return NextResponse.json(tenant, { status: 201 });
}
