import { prisma } from "./prisma";

export async function getExchangeRate() {
  const rate = await prisma.exchangeRate.findFirst({ orderBy: { updatedAt: "desc" } });
  return rate ?? { rateUsdToCrc: 520, source: "manual", updatedAt: new Date() };
}

export async function formatDualPrice(priceBase: number, currencyBase: "CRC" | "USD") {
  const rate = await getExchangeRate();
  const formatterCrc = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
  const formatterUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const baseFormatted = currencyBase === "CRC" ? formatterCrc.format(priceBase) : formatterUsd.format(priceBase);
  const converted = currencyBase === "CRC" ? formatterUsd.format(priceBase / rate.rateUsdToCrc) : formatterCrc.format(priceBase * rate.rateUsdToCrc);

  return {
    base: baseFormatted,
    approx: converted,
    currencyBase,
    disclaimer: "Los montos en moneda secundaria son aproximados según el tipo de cambio vigente.",
  };
}
