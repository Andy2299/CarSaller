"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/" });
    if (res?.error) setError("Credenciales inválidas");
    else window.location.href = searchParams.get("callbackUrl") ?? "/";
  };

  return (
    <div className="max-w-md mx-auto card p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Ingresar</h1>
        <p className="text-sm text-gray-600">Acceso a tu cuenta para gestionar vehículos y chats.</p>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn-primary w-full justify-center" type="submit">Ingresar</button>
      </form>
    </div>
  );
}
