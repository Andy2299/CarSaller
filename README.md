# CarSaller

MVP multi-tenant marketplace de vehículos para Costa Rica construido con Next.js 14 (App Router), Prisma y NextAuth.

## Características
- Publicación de vehículos por agencias (tenants) o vendedores privados.
- Precios en CRC y USD con tipo de cambio editable.
- Buscador inicial, detalle de vehículo y calculadora de financiamiento.
- Chat interno (Socket.IO) asociado a vehículos.
- Panel de agencia para inventario y equipo.

## Requisitos
- Node.js 18+
- PostgreSQL

## Configuración
1. Clonar el repositorio.
2. Crear `.env` basado en `.env.example`.
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Ejecutar migraciones y seed:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. Iniciar en desarrollo:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` – servidor de desarrollo.
- `npm run build` / `npm run start` – build y producción.
- `npm run prisma:migrate` – migración (dev).
- `npm run prisma:seed` – datos de ejemplo.

## Credenciales de ejemplo
- owner@demo.com / password123 (agencia demo)
- buyer@demo.com / password123

## Notas
- Subidas de archivos guardan en `./uploads` localmente (lista para abstraer a S3/R2 en fase posterior).
- No hay pagos, WhatsApp ni teléfonos por requerimiento.
