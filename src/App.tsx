import React from "react";
import Dashboard from "./components/Dashboard";
import EventFeed from "./components/EventFeed";
import PolicyPanel from "./components/PolicyPanel";
import { useAmbient } from "./hooks/useAmbients";

export default function App() {
  useAmbient();

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 text-neon">Neon District Manager</h1>
      <Dashboard />
      <EventFeed />
      <PolicyPanel />
    </div>
  );
}
