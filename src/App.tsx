import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import EventFeed from "./components/EventFeed";
import BuildingsPanel from "./components/BuildingsPanel";
import UpgradesPanel from "./components/UpgradesPanel";
import PolicyPanel from "./components/PolicyPanel";
import GameOver from "./components/GameOver";
import { useAmbient } from "./hooks/useAmbients";
import { useCityStore } from "./store/cityStore";

export default function App() {
  useAmbient();
  const isGameOver = useCityStore((state) => state.isGameOver);
  const addBudget = useCityStore((state) => state.addBudget);
  const addEnergy = useCityStore((state) => state.addEnergy);
  const increasePopulation = useCityStore((state) => state.increasePopulation);
  const addEvent = useCityStore((state) => state.addEvent);
  const resetGame = useCityStore((state) => state.resetGame);
  const [cheatOpen, setCheatOpen] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        setCheatOpen((open) => !open);
        return;
      }

      if (event.key === "Escape" && cheatOpen) {
        setCheatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cheatOpen]);

  return (
    <div className="min-h-screen p-3 md:p-4 pb-28 relative overflow-hidden">
      {/* Background scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-energy to-transparent animate-pulse"
          style={{ height: "2px", animation: "scanline 8s linear infinite" }}
        />
      </div>

      <div className="max-w-[1500px] mx-auto relative z-10">
        <h1 className="holo-title mb-4 md:mb-5 text-center">
          NEON DISTRICT MANAGER
        </h1>

        {isGameOver ? (
          <GameOver />
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
              <div className="min-w-0 w-full">
                <Dashboard />
                <EventFeed />
              </div>

              <aside className="w-full xl:sticky xl:top-4 xl:self-start flex flex-col gap-4">
                <BuildingsPanel />
                <UpgradesPanel />
              </aside>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50 bg-building/90 backdrop-blur border-t border-neon shadow-lg flex justify-center py-3 md:py-4">
              <PolicyPanel compact />
            </div>
          </>
        )}

        <div className="fixed top-4 left-4 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-energy opacity-50" />
        <div className="fixed top-4 right-4 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-neon opacity-50" />
        <div className="fixed bottom-16 left-4 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-neon opacity-50" />
        <div className="fixed bottom-16 right-4 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-energy opacity-50" />
      </div>

      {import.meta.env.DEV && cheatOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/80 backdrop-blur-sm">
          <div className="bg-building border border-neon rounded-xl p-5 w-[min(90vw,420px)] shadow-[0_0_25px_rgba(20,255,247,0.2)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-neon text-xl font-bold">DEV CHEATS</h2>
              <button
                onClick={() => setCheatOpen(false)}
                className="text-energy hover:text-neon text-lg"
                aria-label="Close cheat panel"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="btn-neon afford-available text-xs px-3 py-2"
                onClick={() => {
                  addBudget(500);
                  addEvent("DEV CHEAT: +$500 budget");
                }}
              >
                +$500
              </button>
              <button
                className="btn-neon afford-available text-xs px-3 py-2"
                onClick={() => {
                  addEnergy(50);
                  addEvent("DEV CHEAT: +50 energy");
                }}
              >
                +50 Energy
              </button>
              <button
                className="btn-neon afford-available text-xs px-3 py-2"
                onClick={() => {
                  increasePopulation(250);
                  addEvent("DEV CHEAT: +250 population");
                }}
              >
                +250 Pop
              </button>
              <button
                className="btn-neon afford-unavailable text-xs px-3 py-2"
                onClick={() => {
                  resetGame();
                  addEvent("DEV CHEAT: district reset");
                }}
              >
                Reset
              </button>
            </div>

            <p className="mt-4 text-xs text-energy/80">
              Hotkey: Ctrl + Shift + C · Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
