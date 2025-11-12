import { create } from "zustand";

export interface CityState {
  population: number;
  energy: number;
  budget: number;
  events: string[];
  increasePopulation: (amount: number) => void;
  spendEnergy: (amount: number) => void;
  spendBudget: (amount: number) => void;
  addEvent: (text: string) => void;
}

export const useCityStore = create<CityState>((set) => ({
  population: 1000,
  energy: 100,
  budget: 500,
  events: [],
  increasePopulation: (amount) => set((state) => ({ population: state.population + amount })),
  spendEnergy: (amount) => set((state) => ({ energy: Math.max(state.energy - amount, 0) })),
  spendBudget: (amount) => set((state) => ({ budget: Math.max(state.budget - amount, 0) })),
  addEvent: (text) => set((state) => ({ events: [...state.events, text] })),
}));