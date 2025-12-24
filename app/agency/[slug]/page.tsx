import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VehicleCard } from "@/components/vehicle-card";

export default async function AgencyPublicPage({ params }: { params: { slug: string } }) {
  const tenant = await prisma.tenant.findUnique({ where: { slug: params.slug } });
  if (!tenant) return notFound();
  const vehicles = await prisma.vehicle.findMany({ where: { tenantId: tenant.id, status: "published" }, include: { tenant: true } });

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
        <p className="text-gray-600">{tenant.description}</p>
        <p className="text-sm text-gray-500">Ubicación: {tenant.province}, {tenant.city}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        {vehicles.length === 0 && <p className="text-gray-600">No hay inventario publicado.</p>}
      </div>
    </div>
  );
}
