import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChatPanel } from "@/components/chat-panel";

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const conversation = await prisma.conversation.findUnique({ where: { id: params.conversationId }, include: { vehicle: true } });
  if (!conversation) redirect("/inbox");

  const authorized =
    conversation.buyerId === session.user.id ||
    conversation.sellerId === session.user.id ||
    (conversation.tenantId && conversation.tenantId === session.user.tenantId);

  if (!authorized) redirect("/inbox");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chat sobre {conversation.vehicle.brand} {conversation.vehicle.model}</h1>
        <span className="text-sm text-gray-500">Estado: {conversation.status}</span>
      </div>
      <ChatPanel conversationId={conversation.id} userId={session.user.id} />
    </div>
  );
}
