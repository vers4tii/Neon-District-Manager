import Dashboard from "./components/Dashboard";
import EventFeed from "./components/EventFeed";
import BuildingsPanel from "./components/BuildingsPanel";
import UpgradesPanel from "./components/UpgradesPanel";
import PolicyPanel from "./components/PolicyPanel";
// Removed duplicate import
import GameOver from "./components/GameOver";
import { useAmbient } from "./hooks/useAmbients";
import { useCityStore } from "./store/cityStore";

export default function App() {
  useAmbient();
  const isGameOver = useCityStore((state) => state.isGameOver);

  return (
    <div className="min-h-screen p-6 relative">
      {/* Background scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-energy to-transparent animate-pulse" 
             style={{ height: '2px', animation: 'scanline 8s linear infinite' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="holo-title mb-8 text-center">
          NEON DISTRICT MANAGER
        </h1>
        
        {isGameOver ? (
          <GameOver />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Dashboard />
                <EventFeed />
              </div>
              <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
                <BuildingsPanel />
                <UpgradesPanel />
              </div>
            </div>
            {/* Sticky action bar for PolicyPanel */}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-building/90 backdrop-blur border-t border-neon shadow-lg flex justify-center py-4">
              <PolicyPanel compact />
            </div>
          </>
        )}

        {/* Corner decorations */}
        <div className="fixed top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-energy opacity-50" />
        <div className="fixed top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon opacity-50" />
        <div className="fixed bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon opacity-50" />
        <div className="fixed bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-energy opacity-50" />
      </div>
    </div>
  );
}