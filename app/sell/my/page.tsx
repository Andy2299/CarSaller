import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/vehicle-card";

export default async function MyVehiclesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const vehicles = await prisma.vehicle.findMany({
    where: {
      OR: [{ sellerId: session.user.id }, { tenantId: session.user.tenantId ?? undefined }],
    },
    include: { tenant: true, seller: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mis vehículos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        {vehicles.length === 0 && <p className="text-gray-600">No tienes publicaciones aún.</p>}
      </div>
    </div>
  );
}
