import { useCityStore } from "../store/cityStore";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GameOver() {
  const { population, resetGame } = useCityStore();

  return (
    <div className="bg-building p-8 rounded-lg text-center max-w-2xl mx-auto mt-20">
      <AlertTriangle className="text-[#ff2e63] mx-auto mb-4" size={64} />
      
      <h2 className="text-4xl font-bold text-[#ff2e63] mb-4">
        SYSTEM FAILURE
      </h2>
      
      <div className="text-energy mb-6 text-lg">
        <p className="mb-4">The district has collapsed due to resource depletion.</p>
        <p className="text-neon font-bold">Final Population: {population.toLocaleString()}</p>
      </div>

      <div className="bg-bg p-4 rounded mb-6 text-left text-sm text-energy opacity-70">
        <p className="mb-2">⚠️ Energy reached zero - Infrastructure shutdown</p>
        <p>⚠️ Budget depleted - Unable to maintain operations</p>
      </div>

      <button
        className="btn-neon flex items-center gap-2 mx-auto"
        onClick={resetGame}
      >
        <RotateCcw size={20} />
        <span>RESTART SIMULATION</span>
      </button>
    </div>
  );
}