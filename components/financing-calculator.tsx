"use client";

import { useState } from "react";

interface FinancingResult {
  financedAmount: number;
  monthlyPayment: number;
  totalPaid: number;
}

export function FinancingCalculator({ defaultPrice }: { defaultPrice: number }) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPayment, setDownPayment] = useState(0);
  const [term, setTerm] = useState(60);
  const [interest, setInterest] = useState(12);
  const [insurance, setInsurance] = useState(0);
  const [result, setResult] = useState<FinancingResult | null>(null);

  const calculate = () => {
    const financedAmount = Math.max(price - downPayment, 0) + insurance;
    const monthlyRate = interest / 100 / 12;
    const numerator = financedAmount * monthlyRate * Math.pow(1 + monthlyRate, term);
    const denominator = Math.pow(1 + monthlyRate, term) - 1;
    const monthlyPayment = denominator === 0 ? financedAmount / term : numerator / denominator;
    const totalPaid = monthlyPayment * term;
    setResult({ financedAmount, monthlyPayment, totalPaid });
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Precio del vehículo</label>
          <input className="input" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Prima / enganche</label>
          <input className="input" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Plazo (meses)</label>
          <input className="input" type="number" min={12} max={96} value={term} onChange={(e) => setTerm(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Tasa anual (%)</label>
          <input className="input" type="number" value={interest} onChange={(e) => setInterest(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Seguro opcional</label>
          <input className="input" type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} />
        </div>
      </div>
      <button className="btn-primary" onClick={calculate}>Calcular cuota</button>
      {result && (
        <div className="bg-gray-50 border rounded-md p-3 space-y-1 text-sm">
          <p className="font-semibold">Monto financiado: {result.financedAmount.toLocaleString()}</p>
          <p>Cuota mensual aprox.: {result.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p>Total pagado: {result.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      )}
    </div>
  );
}
