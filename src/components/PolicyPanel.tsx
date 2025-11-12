import React from "react";
import { useCityStore } from "../store/cityStore";
import { simulateEvent } from "../utils/simulator";

export default function PolicyPanel() {
  const spendBudget = useCityStore((state) => state.spendBudget);
  const spendEnergy = useCityStore((state) => state.spendEnergy);

  return (
    <div className="bg-building p-4 rounded-lg flex gap-4">
      <button
        className="bg-neon px-4 py-2 rounded hover:brightness-125"
        onClick={() => { spendBudget(50); simulateEvent(); }}
      >
        Invest Budget
      </button>
      <button
        className="bg-neon px-4 py-2 rounded hover:brightness-125"
        onClick={() => { spendEnergy(20); simulateEvent(); }}
      >
        Use Energy
      </button>
      <button
        className="bg-neon px-4 py-2 rounded hover:brightness-125"
        onClick={simulateEvent}
      >
        Next Turn
      </button>
    </div>
  );
}
