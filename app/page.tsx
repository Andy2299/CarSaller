import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/vehicle-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "published" },
    include: { tenant: true, seller: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Compra y venta de vehículos en Costa Rica</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Marketplace multi-tenant para agencias y vendedores privados. Precios en CRC y USD, chats internos y calculadora de financiamiento.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/sell/new" className="btn-primary">Publicar vehículo</Link>
          <Link href="/calculadora" className="btn-secondary">Calcular cuota</Link>
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nuevos listados</h2>
          <Link href="/vehicles" className="text-sm font-semibold text-primary">Ver todos</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
          {vehicles.length === 0 && <p className="text-gray-600">No hay vehículos publicados aún.</p>}
        </div>
      </section>
    </div>
  );
}
