import { useCityStore } from "../store/cityStore";
import { AlertTriangle, RotateCcw } from "lucide-react";

const REASON_TEXT: Record<string, string> = {
  "Prolonged blackout": "Energy stayed at zero for too long - infrastructure shutdown.",
  Epidemic: "Pollution and disease wiped out the district's health.",
  "Citizens revolt": "Citizens lost all hope and took over the streets.",
  Bankruptcy: "The district went too deep into debt to keep operating.",
};

export default function GameOver() {
  const { population, turns, score, highScore, gameOverReason, resetGame } =
    useCityStore();

  return (
    <div
      role="alert"
      className="bg-building p-5 sm:p-8 rounded-lg text-center max-w-2xl mx-auto mt-8 sm:mt-20"
    >
      <AlertTriangle className="text-[#ff2e63] mx-auto mb-4" size={56} />

      <h2 className="text-3xl sm:text-4xl font-bold text-[#ff2e63] mb-4">
        SYSTEM FAILURE
      </h2>

      <div className="text-energy mb-6 text-base sm:text-lg">
        <p className="mb-2 font-bold">{gameOverReason || "The district has collapsed."}</p>
        <p className="mb-4 text-sm opacity-80">
          {REASON_TEXT[gameOverReason] ?? ""}
        </p>
        <p className="text-neon font-bold">
          Final Population: {population.toLocaleString()}
        </p>
        <p className="text-sm mt-1">
          Survived {turns} turns · Score {score.toLocaleString()} · Best{" "}
          {highScore.toLocaleString()}
        </p>
      </div>

      <button
        className="btn-neon flex items-center gap-2 mx-auto"
        onClick={resetGame}
        autoFocus
      >
        <RotateCcw size={20} />
        <span>RESTART SIMULATION</span>
      </button>
    </div>
  );
}
