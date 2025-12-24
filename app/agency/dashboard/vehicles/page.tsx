import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/vehicle-card";
import Link from "next/link";

export default async function AgencyVehiclesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");
  if (!session.user.tenantId) redirect("/agency/new");

  const vehicles = await prisma.vehicle.findMany({ where: { tenantId: session.user.tenantId }, include: { tenant: true } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario de agencia</h1>
        <Link href="/sell/new" className="btn-primary">Agregar</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        {vehicles.length === 0 && <p className="text-gray-600">Aún no hay vehículos.</p>}
      </div>
    </div>
  );
}
