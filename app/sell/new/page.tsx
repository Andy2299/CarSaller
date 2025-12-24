import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import VehicleForm from "@/components/vehicle-form";

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Publicar vehículo</h1>
        <p className="text-gray-600">Completa la información para publicar. Todos los contactos serán por chat interno.</p>
      </div>
      <VehicleForm />
    </div>
  );
}
