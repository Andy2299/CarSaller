import { z } from "zod";

export const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  trim: z.string().optional(),
  bodyType: z.string().min(1),
  transmission: z.string().min(1),
  fuelType: z.string().min(1),
  priceBase: z.number().positive(),
  currencyBase: z.enum(["CRC", "USD"]),
  mileage: z.number().nonnegative(),
  color: z.string().min(1),
  province: z.string().min(1),
  city: z.string().min(1),
  description: z.string().min(10),
  photos: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "paused", "sold"]).default("draft"),
  tenantId: z.string().nullable().optional(),
});

export const conversationSchema = z.object({
  vehicleId: z.string().min(1),
  buyerId: z.string().min(1),
  tenantId: z.string().nullable().optional(),
  sellerId: z.string().nullable().optional(),
});

export const messageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(1000),
});

export const exchangeRateSchema = z.object({
  rateUsdToCrc: z.number().positive(),
  source: z.string().min(1),
});

export const membershipSchema = z.object({
  tenantId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["owner", "manager", "agent"]),
});

export type VehiclePayload = z.infer<typeof vehicleSchema>;
