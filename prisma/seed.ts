import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-agencia" },
    update: {},
    create: {
      name: "Agencia Demo",
      slug: "demo-agencia",
      description: "Lote demo multi-tenant",
      province: "San José",
      city: "San José",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@demo.com" },
    update: {},
    create: { email: "owner@demo.com", name: "Owner Demo", passwordHash: password, tenantId: tenant.id },
  });

  await prisma.membership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: owner.id } },
    update: {},
    create: { tenantId: tenant.id, userId: owner.id, role: "owner" },
  });

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@demo.com" },
    update: {},
    create: { email: "buyer@demo.com", name: "Comprador Demo", passwordHash: password },
  });

  await prisma.exchangeRate.upsert({
    where: { id: "seed" },
    update: { rateUsdToCrc: 520, source: "manual" },
    create: { id: "seed", rateUsdToCrc: 520, source: "manual" },
  });

  const vehicles = [
    {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      trim: "SE",
      bodyType: "Sedan",
      transmission: "Automática",
      fuelType: "Gasolina",
      priceBase: 12000000,
      currencyBase: "CRC",
      mileage: 35000,
      color: "Blanco",
      province: "San José",
      city: "Escazú",
      description: "Sedan confiable ideal para ciudad, un solo dueño, mantenimientos al día.",
      photos: ["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d"],
      status: "published" as const,
      tenantId: tenant.id,
    },
    {
      brand: "Hyundai",
      model: "Tucson",
      year: 2019,
      trim: "GLS",
      bodyType: "SUV",
      transmission: "Automática",
      fuelType: "Gasolina",
      priceBase: 22000,
      currencyBase: "USD",
      mileage: 60000,
      color: "Negro",
      province: "Heredia",
      city: "Belén",
      description: "SUV espaciosa con historial de agencia y todas las llantas nuevas.",
      photos: ["https://images.unsplash.com/photo-1502877828070-33c90e745145"],
      status: "published" as const,
      sellerId: buyer.id,
    },
  ];

  for (const data of vehicles) {
    await prisma.vehicle.create({ data });
  }

  console.log("Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
