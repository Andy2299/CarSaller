import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/vehicle-card";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "published" },
    include: { tenant: true, seller: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Explorar vehículos</h1>
        <p className="text-sm text-gray-600">Filtro rápido MVP. Pendiente filtros detallados.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        {vehicles.length === 0 && <p className="text-gray-600">No hay resultados.</p>}
      </div>
    </div>
  );
}
