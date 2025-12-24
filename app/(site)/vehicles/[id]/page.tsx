import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDualPrice } from "@/lib/pricing";
import { FinancingCalculator } from "@/components/financing-calculator";

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { tenant: true, seller: true } });
  if (!vehicle) return notFound();
  const price = await formatDualPrice(vehicle.priceBase, vehicle.currencyBase as "CRC" | "USD");

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="relative h-72 lg:h-full col-span-2">
            <Image
              src={vehicle.photos[0] ?? "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 space-y-3">
            <h1 className="text-2xl font-bold">{vehicle.brand} {vehicle.model} {vehicle.trim}</h1>
            <p className="text-sm text-gray-600">{vehicle.year} · {vehicle.bodyType} · {vehicle.transmission}</p>
            <div>
              <p className="text-2xl font-bold text-primary">{price.base}</p>
              <p className="text-sm text-gray-500">≈ {price.approx}</p>
              <p className="text-xs text-gray-400">{price.disclaimer}</p>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{vehicle.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Combustible:</strong> {vehicle.fuelType}</p>
              <p><strong>Kilometraje:</strong> {vehicle.mileage.toLocaleString()} km</p>
              <p><strong>Color:</strong> {vehicle.color}</p>
              <p><strong>Ubicación:</strong> {vehicle.province}, {vehicle.city}</p>
            </div>
            <div className="space-y-2">
              <Link href={`/inbox?vehicleId=${vehicle.id}`} className="btn-primary w-full justify-center">Iniciar chat</Link>
              <Link href="/calculadora" className="btn-secondary w-full justify-center">Calcular mensualidad</Link>
            </div>
          </div>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-3">Calculadora de financiamiento</h2>
        <FinancingCalculator defaultPrice={vehicle.priceBase} />
      </section>
    </div>
  );
}
