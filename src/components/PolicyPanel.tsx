import React from "react";
import {
  ENERGY_CONVERT_COST,
  INVEST_COST,
  MAX_ACTIONS_PER_TURN,
  useCityStore,
} from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import { Coins, Zap, Play, Volume2, VolumeX } from "lucide-react";
import * as Tone from "tone";

export default function PolicyPanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const {
    budget,
    energy,
    actionsLeft,
    investBudget,
    convertEnergy,
    nextTurn,
  } = useCityStore();
  const { playClick, playSuccess, playError } = useSoundEffects();
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    Tone.getDestination().mute = !newState;
  };

  const handleInvest = () => {
    if (actionsLeft > 0 && budget >= INVEST_COST) {
      playSuccess();
      investBudget();
    } else {
      playError();
    }
  };

  const handleUseEnergy = () => {
    if (actionsLeft > 0 && energy >= ENERGY_CONVERT_COST) {
      playSuccess();
      convertEnergy();
    } else {
      playError();
    }
  };

  const handleNextTurn = () => {
    playClick();
    nextTurn();
  };

  if (compact) {
    return (
      <div className="flex gap-4 flex-wrap justify-center items-center">
        <span
          className={`text-xs font-bold ${actionsLeft > 0 ? "text-energy" : "text-[#ff2e63]"}`}
          title="Actions left this turn (build, upgrade, demolish, invest, sell energy)"
        >
          ACTIONS {actionsLeft}/{MAX_ACTIONS_PER_TURN}
        </span>
        <button
          className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleInvest}
          disabled={actionsLeft <= 0 || budget < INVEST_COST}
          title={
            actionsLeft <= 0
              ? "No actions left this turn"
              : budget < INVEST_COST
                ? "Insufficient budget"
                : "Invest $50: +5 happiness (1 action)"
          }
        >
          <Coins size={20} />
          <span>INVEST</span>
        </button>
        <button
          className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUseEnergy}
          disabled={actionsLeft <= 0 || energy < ENERGY_CONVERT_COST}
          title={
            actionsLeft <= 0
              ? "No actions left this turn"
              : energy < ENERGY_CONVERT_COST
                ? "Insufficient energy"
                : "Sell 20 energy: +$40 (1 action)"
          }
        >
          <Zap size={20} />
          <span>ENERGY</span>
        </button>
        <button
          className="btn-neon flex items-center gap-2"
          onClick={handleNextTurn}
          title="Advance to next turn"
        >
          <Play size={20} />
          <span>{actionsLeft > 0 ? "SKIP TURN" : "END TURN"}</span>
        </button>
      </div>
    );
  }
  return (
    <div className="bg-building p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-neon text-xl font-bold">POLICY TERMINAL</h2>
        <button
          onClick={toggleAudio}
          className="text-energy hover:text-neon transition-colors"
          title={audioEnabled ? "Mute Audio" : "Unmute Audio"}
        >
          {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <button
          className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleInvest}
          disabled={actionsLeft <= 0 || budget < INVEST_COST}
          title={
            actionsLeft <= 0
              ? "No actions left this turn"
              : budget < INVEST_COST
                ? "Insufficient budget"
                : "Invest $50: +5 happiness (1 action)"
          }
        >
          <Coins size={20} />
          <span>INVEST BUDGET</span>
          <span className="text-xs opacity-70">($50)</span>
        </button>
        <button
          className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUseEnergy}
          disabled={actionsLeft <= 0 || energy < ENERGY_CONVERT_COST}
          title={
            actionsLeft <= 0
              ? "No actions left this turn"
              : energy < ENERGY_CONVERT_COST
                ? "Insufficient energy"
                : "Sell 20 energy: +$40 (1 action)"
          }
        >
          <Zap size={20} />
          <span>USE ENERGY</span>
          <span className="text-xs opacity-70">(20)</span>
        </button>
        <button
          className="btn-neon flex items-center gap-2"
          onClick={handleNextTurn}
          title="Advance to next turn"
        >
          <Play size={20} />
          <span>NEXT TURN</span>
        </button>
      </div>
      <div className="mt-4 text-xs text-energy opacity-70">
        <p>💡 TIP: You lose when BOTH energy AND budget reach zero!</p>
      </div>
    </div>
  );
}
