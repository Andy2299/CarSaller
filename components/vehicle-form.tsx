"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const emptyForm = {
  brand: "",
  model: "",
  year: 2020,
  trim: "",
  bodyType: "Sedan",
  transmission: "Automática",
  fuelType: "Gasolina",
  priceBase: 0,
  currencyBase: "CRC",
  mileage: 0,
  color: "",
  province: "",
  city: "",
  description: "",
  photos: [] as string[],
};

export default function VehicleForm() {
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      setError("No se pudo publicar. Revisa los datos.");
      return;
    }
    router.push("/sell/my");
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Marca</label>
          <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
        </div>
        <div>
          <label className="label">Modelo</label>
          <input className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
        </div>
        <div>
          <label className="label">Año</label>
          <input className="input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="label">Versión / Trim</label>
          <input className="input" value={form.trim} onChange={(e) => setForm({ ...form, trim: e.target.value })} />
        </div>
        <div>
          <label className="label">Carrocería</label>
          <input className="input" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })} required />
        </div>
        <div>
          <label className="label">Transmisión</label>
          <input className="input" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} required />
        </div>
        <div>
          <label className="label">Combustible</label>
          <input className="input" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} required />
        </div>
        <div>
          <label className="label">Precio base</label>
          <input className="input" type="number" value={form.priceBase} onChange={(e) => setForm({ ...form, priceBase: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="label">Moneda</label>
          <select className="input" value={form.currencyBase} onChange={(e) => setForm({ ...form, currencyBase: e.target.value })}>
            <option value="CRC">CRC</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label className="label">Kilometraje</label>
          <input className="input" type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="label">Color</label>
          <input className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required />
        </div>
        <div>
          <label className="label">Provincia</label>
          <input className="input" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
        </div>
        <div>
          <label className="label">Ciudad</label>
          <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        </div>
      </div>
      <div>
        <label className="label">Descripción</label>
        <textarea className="input" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" disabled={loading} type="submit">{loading ? "Publicando..." : "Publicar"}</button>
      </div>
    </form>
  );
}
