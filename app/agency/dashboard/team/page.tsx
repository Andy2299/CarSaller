import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");
  if (!session.user.tenantId) redirect("/agency/new");

  const memberships = await prisma.membership.findMany({
    where: { tenantId: session.user.tenantId },
    include: { user: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Equipo</h1>
      <div className="card p-4 space-y-2">
        {memberships.map((m) => (
          <div key={m.id} className="flex items-center justify-between border-b last:border-0 py-2">
            <div>
              <p className="font-semibold">{m.user.name ?? m.user.email}</p>
              <p className="text-sm text-gray-600">{m.user.email}</p>
            </div>
            <span className="text-sm uppercase text-primary">{m.role}</span>
          </div>
        ))}
        {memberships.length === 0 && <p className="text-gray-600">Aún no hay miembros.</p>}
      </div>
      <p className="text-sm text-gray-500">Invitaciones token-based pendientes de implementar.</p>
    </div>
  );
}
