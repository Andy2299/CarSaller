import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AgencyDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de agencia</h1>
      <p className="text-gray-600">Gestiona inventario, equipo y conversaciones internas.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a className="card p-4" href="/agency/dashboard/vehicles">
          <h3 className="font-semibold">Inventario</h3>
          <p className="text-sm text-gray-600">Publica y administra vehículos.</p>
        </a>
        <a className="card p-4" href="/agency/dashboard/team">
          <h3 className="font-semibold">Equipo</h3>
          <p className="text-sm text-gray-600">Invita y define roles.</p>
        </a>
        <a className="card p-4" href="/inbox">
          <h3 className="font-semibold">Chats</h3>
          <p className="text-sm text-gray-600">Responde a compradores.</p>
        </a>
      </div>
    </div>
  );
}
