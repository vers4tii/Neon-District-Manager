import React from "react";
import { useCityStore } from "../store/cityStore";
import { simulateEvent } from "../utils/simulator";
import { useSoundEffects } from "../hooks/useAmbients";
import { Coins, Zap, Play, Volume2, VolumeX } from "lucide-react";
import * as Tone from "tone";

export default function PolicyPanel() {
  const { budget, energy, spendBudget, spendEnergy } = useCityStore();
  const { playClick, playSuccess, playError } = useSoundEffects();
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    Tone.Destination.mute = !newState;
  };

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
          disabled={budget < 50}
          title={budget < 50 ? "Insufficient budget" : "Invest $50 to improve district"}
        >
          <Coins size={20} />
          <span>INVEST BUDGET</span>
          <span className="text-xs opacity-70">($50)</span>
        </button>
        
        <button
          className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUseEnergy}
          disabled={energy < 20}
          title={energy < 20 ? "Insufficient energy" : "Use 20 energy for operations"}
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