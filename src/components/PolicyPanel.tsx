import React, { useEffect } from "react";
import {
  AUTO_TURN_SECONDS,
  ENERGY_CONVERT_COST,
  INVEST_COST,
  getMaxActions,
  useCityStore,
} from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import { Coins, Zap, Play, Timer, Volume2, VolumeX } from "lucide-react";
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
    upgrades,
    investBudget,
    convertEnergy,
    turns,
    isGameOver,
    autoTurn,
    setAutoTurn,
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

  // Auto mode: end the turn every few seconds (timer restarts each turn)
  useEffect(() => {
    if (!autoTurn || isGameOver) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) nextTurn();
    }, AUTO_TURN_SECONDS * 1000);
    return () => window.clearTimeout(id);
  }, [autoTurn, isGameOver, turns, nextTurn]);

  const handleNextTurn = () => {
    playClick();
    nextTurn();
  };

  const maxActions = getMaxActions(upgrades);
  const actionButton =
    "btn-neon flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 py-2 sm:px-3 lg:px-4 text-[10px] sm:text-sm lg:text-base tracking-normal sm:tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed";

  if (compact) {
    return (
      <div className="w-full max-w-5xl px-2">
        <div
          className={`text-center text-xs font-bold mb-1.5 sm:mb-0 sm:hidden ${actionsLeft > 0 ? "text-energy" : "text-[#ff2e63]"}`}
        >
          ACTIONS {actionsLeft}/{maxActions}
        </div>
        <div className="grid grid-cols-4 gap-1.5 sm:flex sm:gap-4 sm:flex-wrap sm:justify-center sm:items-center">
          <span
            className={`hidden sm:inline text-xs font-bold ${actionsLeft > 0 ? "text-energy" : "text-[#ff2e63]"}`}
            title="Actions left this turn (build, upgrade, demolish, invest, sell energy)"
          >
            ACTIONS {actionsLeft}/{maxActions}
          </span>
          <button
            className={actionButton}
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
            className={actionButton}
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
            className="btn-neon flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 py-2 sm:px-3 lg:px-4 text-[10px] sm:text-sm lg:text-base tracking-normal sm:tracking-[0.1em]"
            onClick={handleNextTurn}
            title="Advance to next turn"
          >
            <Play size={20} />
            <span className="sm:hidden">NEXT</span>
            <span className="hidden sm:inline">
              {actionsLeft > 0 ? "SKIP TURN" : "END TURN"}
            </span>
          </button>
          <button
            className={`btn-neon flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 py-2 sm:px-3 lg:px-4 text-[10px] sm:text-sm lg:text-base tracking-normal sm:tracking-[0.1em] relative overflow-hidden ${autoTurn ? "afford-available" : ""}`}
            onClick={() => setAutoTurn(!autoTurn)}
            title={`Automatically end the turn every ${AUTO_TURN_SECONDS}s`}
          >
            <Timer size={20} />
            <span>AUTO {autoTurn ? "ON" : "OFF"}</span>
            {autoTurn && (
              <span
                key={turns}
                className="auto-turn-bar"
                style={{ animationDuration: `${AUTO_TURN_SECONDS}s` }}
              />
            )}
          </button>
        </div>
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
