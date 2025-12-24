import { Vehicle, Tenant, User } from "@prisma/client";

export type VehicleWithRelations = Vehicle & { seller?: User | null; tenant?: Tenant | null };
