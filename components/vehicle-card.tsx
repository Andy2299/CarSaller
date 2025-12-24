import Link from "next/link";
import Image from "next/image";
import { VehicleWithRelations } from "@/types/prisma";
import { formatDualPrice } from "@/lib/pricing";

export async function VehicleCard({ vehicle }: { vehicle: VehicleWithRelations }) {
  const price = await formatDualPrice(vehicle.priceBase, vehicle.currencyBase as "CRC" | "USD");
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={vehicle.photos[0] ?? "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{vehicle.brand} • {vehicle.year}</p>
            <h3 className="text-lg font-semibold">{vehicle.model} {vehicle.trim ?? ""}</h3>
          </div>
          <div className="text-right">
            <p className="text-primary font-bold">{price.base}</p>
            <p className="text-xs text-gray-500">≈ {price.approx}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{vehicle.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{vehicle.province}</span>
          <span>{vehicle.mileage.toLocaleString()} km</span>
        </div>
        <Link href={`/vehicles/${vehicle.id}`} className="btn-secondary text-sm mt-2">Ver detalle</Link>
      </div>
    </div>
  );
}
