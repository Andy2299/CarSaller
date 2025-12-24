"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function TenantForm() {
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, province, city, description }),
    });
    if (!res.ok) {
      setError("No se pudo crear la agencia");
      return;
    }
    const tenant = await res.json();
    router.push(`/agency/${tenant.slug}`);
  };

  return (
    <form className="card p-4 space-y-3" onSubmit={handleSubmit}>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label className="label">Nombre comercial</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="label">Provincia</label>
          <input className="input" value={province} onChange={(e) => setProvince(e.target.value)} required />
        </div>
        <div>
          <label className="label">Ciudad</label>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="label">Descripción</label>
        <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button className="btn-primary" type="submit">Crear</button>
    </form>
  );
}
