import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InboxPage({ searchParams }: { searchParams: { vehicleId?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        { tenantId: session.user.tenantId ?? undefined },
        { sellerId: session.user.id },
      ],
    },
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Inbox</h1>
      {searchParams.vehicleId && (
        <Link href={`/api/conversations?vehicleId=${searchParams.vehicleId}`} className="text-sm text-primary">
          Iniciar chat rápido (API)
        </Link>
      )}
      <div className="space-y-2">
        {conversations.map((c) => (
          <Link key={c.id} href={`/inbox/${c.id}`} className="card p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.vehicle.brand} {c.vehicle.model}</p>
              <p className="text-sm text-gray-600">Estado: {c.status}</p>
            </div>
            <span className="text-sm text-primary">Ver conversación</span>
          </Link>
        ))}
        {conversations.length === 0 && <p className="text-gray-600">No tienes conversaciones aún.</p>}
      </div>
    </div>
  );
}
