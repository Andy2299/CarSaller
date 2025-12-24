import { FinancingCalculator } from "@/components/financing-calculator";

export default function CalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Calculadora de financiamiento</h1>
        <p className="text-gray-600">Simula pagos aproximados en CRC o USD. Usa un tipo de cambio configurable.</p>
      </div>
      <FinancingCalculator defaultPrice={10000000} />
    </div>
  );
}
