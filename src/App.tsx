import Dashboard from "./components/Dashboard";
import EventFeed from "./components/EventFeed";
import PolicyPanel from "./components/PolicyPanel";
import { useAmbient } from "./hooks/useAmbients";

export default function App() {
  useAmbient();

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
        
        <Dashboard />
        <EventFeed />
        <PolicyPanel />

        {/* Corner decorations */}
        <div className="fixed top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-energy opacity-50" />
        <div className="fixed top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon opacity-50" />
        <div className="fixed bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon opacity-50" />
        <div className="fixed bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-energy opacity-50" />
      </div>
    </div>
  );
}