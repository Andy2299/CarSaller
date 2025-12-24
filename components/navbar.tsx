import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";

async function NavAuth() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex items-center gap-4">
      {session?.user ? (
        <>
          <span className="text-sm text-gray-700">Hola, {session.user.name ?? session.user.email}</span>
          <Link href="/sell/my" className="text-sm font-semibold">Mis vehículos</Link>
          <Link href="/inbox" className="text-sm font-semibold">Inbox</Link>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="text-sm font-semibold">Ingresar</Link>
          <Link href="/auth/register" className="text-sm font-semibold">Crear cuenta</Link>
        </>
      )}
      <Link href="/sell/new" className="btn-primary text-sm">Publicar</Link>
    </div>
  );
}

export function NavBar() {
  return (
    <header className="border-b bg-white">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold text-primary">CarSaller</Link>
        <nav className="flex items-center gap-6 text-sm text-gray-700">
          <Link href="/vehicles" className="hidden sm:block">Explorar</Link>
          <Link href="/calculadora" className="hidden sm:block">Calculadora</Link>
          <Link href="/agency/dashboard" className="hidden sm:block">Panel agencia</Link>
        </nav>
        <Suspense fallback={<span className="text-sm">...</span>}>
          {/* @ts-expect-error Async Server Component */}
          <NavAuth />
        </Suspense>
      </div>
    </header>
  );
}
