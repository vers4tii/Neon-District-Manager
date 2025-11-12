import React from "react";
import { useAmbient } from "./hooks/useAmbients";

export default function App() {
  useAmbient();

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 text-neon">Neon District Manager</h1>
    </div>
  );
}
