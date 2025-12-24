import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "CarSaller | Mercado de Vehículos CR",
  description: "Marketplace multi-tenant para compra y venta de vehículos en Costa Rica.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <NavBar />
          <main className="container-page py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
