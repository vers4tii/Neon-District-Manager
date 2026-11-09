import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import EventFeed from "./components/EventFeed";
import BuildingsPanel from "./components/BuildingsPanel";
import UpgradesPanel from "./components/UpgradesPanel";
import PolicyPanel from "./components/PolicyPanel";
import GameOver from "./components/GameOver";
import HowToPlay from "./components/HowToPlay";
import SoundToggle from "./components/SoundToggle";
import { useAmbient } from "./hooks/useAmbients";
import { CircleHelp } from "lucide-react";
import { useCityStore } from "./store/cityStore";

const HOW_TO_PLAY_SEEN_KEY = "neon-district-how-to-play-seen";

export default function App() {
  useAmbient();
  const isGameOver = useCityStore((state) => state.isGameOver);
  const addBudget = useCityStore((state) => state.addBudget);
  const addEnergy = useCityStore((state) => state.addEnergy);
  const increasePopulation = useCityStore((state) => state.increasePopulation);
  const addEvent = useCityStore((state) => state.addEvent);
  const resetGame = useCityStore((state) => state.resetGame);
  const [cheatOpen, setCheatOpen] = useState(false);
  // Shown automatically on the very first visit, then on demand
  const [helpOpen, setHelpOpen] = useState(() => {
    try {
      return !localStorage.getItem(HOW_TO_PLAY_SEEN_KEY);
    } catch {
      return false;
    }
  });

  const closeHelp = () => {
    setHelpOpen(false);
    try {
      localStorage.setItem(HOW_TO_PLAY_SEEN_KEY, "1");
    } catch {
      // storage unavailable: the help simply shows again next time
    }
  };
  const [sidebarTab, setSidebarTab] = useState<"buildings" | "upgrades">(
    "buildings",
  );

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
    <div className="min-h-screen p-3 md:p-4 pb-44 sm:pb-28 relative overflow-hidden">
      {/* Background scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-energy to-transparent animate-pulse"
          style={{ height: "2px", animation: "scanline 8s linear infinite" }}
        />
      </div>

      <div className="max-w-[1500px] mx-auto relative z-10">
        <header className="relative flex flex-col sm:block mb-3 md:mb-5">
          <h1 className="holo-title text-center">NEON DISTRICT MANAGER</h1>
          <div className="order-first self-end mb-1 sm:mb-0 sm:order-none sm:self-auto sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex items-center gap-2">
            <SoundToggle />
            <button
              onClick={() => setHelpOpen(true)}
              className="flex items-center gap-2 text-energy border border-energy rounded px-2.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-energy/10 min-h-[40px]"
              aria-label="How to play"
            >
              <CircleHelp size={18} />
              <span className="hidden md:inline">How to play</span>
            </button>
          </div>
        </header>

        <main>
        {isGameOver ? (
          <GameOver />
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
              <div className="min-w-0 w-full">
                <Dashboard />
                <EventFeed />
              </div>

              <aside
                aria-label="Buildings and upgrades"
                className="w-full xl:sticky xl:top-4 xl:self-start xl:h-[calc(100vh-8.5rem)] xl:min-h-[34rem] flex flex-col gap-4">
                {/* On large screens only one panel is shown, using the full height */}
                <div className="hidden xl:flex gap-2" role="tablist" aria-label="Sidebar">
                  {(["buildings", "upgrades"] as const).map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={sidebarTab === tab}
                      onClick={() => setSidebarTab(tab)}
                      className={`flex-1 px-3 py-2 rounded text-sm font-bold uppercase tracking-wider ${sidebarTab === tab ? "bg-[#ff6bd0] text-bg" : "text-energy border border-energy"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div
                  className={`flex flex-col xl:flex-1 xl:min-h-0 ${sidebarTab === "buildings" ? "" : "xl:hidden"}`}
                >
                  <BuildingsPanel />
                </div>
                <div
                  className={`flex flex-col xl:flex-1 xl:min-h-0 ${sidebarTab === "upgrades" ? "" : "xl:hidden"}`}
                >
                  <UpgradesPanel />
                </div>
              </aside>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50 bg-building/90 backdrop-blur border-t border-neon shadow-lg flex justify-center pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:py-3 md:py-4">
              <PolicyPanel compact />
            </div>
          </>
        )}
        </main>

        <div className="hidden sm:block fixed top-4 left-4 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-energy opacity-50" />
        <div className="hidden sm:block fixed top-4 right-4 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-neon opacity-50" />
        <div className="hidden sm:block fixed bottom-16 left-4 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-neon opacity-50" />
        <div className="hidden sm:block fixed bottom-16 right-4 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-energy opacity-50" />
      </div>

      {helpOpen && <HowToPlay onClose={closeHelp} />}

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
