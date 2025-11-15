import { useCityStore } from "../store/cityStore";
import { simulateEvent } from "../utils/simulator";
import { useSoundEffects } from "../hooks/useAmbients";
import { Coins, Zap, Play } from "lucide-react";

export default function PolicyPanel() {
  const { budget, energy, spendBudget, spendEnergy } = useCityStore();
  const { playClick, playSuccess, playError } = useSoundEffects();

  const handleInvest = () => {
    if (budget >= 50) {
      playSuccess();
      spendBudget(50);
      simulateEvent();
    } else {
      playError();
    }
  };

  const handleUseEnergy = () => {
    if (energy >= 20) {
      playSuccess();
      spendEnergy(20);
      simulateEvent();
    } else {
      playError();
    }
  };

  const handleNextTurn = () => {
    playClick();
    simulateEvent();
  };

  return (
    <div className="bg-building p-6 rounded-lg">
      <h2 className="text-neon mb-4 text-xl font-bold">POLICY TERMINAL</h2>
      <div className="flex gap-4 flex-wrap">
        <button
          className="btn-neon flex items-center gap-2"
          onClick={handleInvest}
          disabled={budget < 50}
        >
          <Coins size={20} />
          <span>INVEST BUDGET</span>
          <span className="text-xs opacity-70">($50)</span>
        </button>
        
        <button
          className="btn-neon flex items-center gap-2"
          onClick={handleUseEnergy}
          disabled={energy < 20}
        >
          <Zap size={20} />
          <span>USE ENERGY</span>
          <span className="text-xs opacity-70">(20)</span>
        </button>
        
        <button
          className="btn-neon flex items-center gap-2"
          onClick={handleNextTurn}
        >
          <Play size={20} />
          <span>NEXT TURN</span>
        </button>
      </div>
    </div>
  );
}
