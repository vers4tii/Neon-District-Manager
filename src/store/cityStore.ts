import { create } from "zustand";

export interface CityState {
  population: number;
  energy: number;
  budget: number;
  events: string[];
  isGameOver: boolean;
  turns: number;
  increasePopulation: (amount: number) => void;
  spendEnergy: (amount: number) => void;
  spendBudget: (amount: number) => void;
  addEvent: (text: string) => void;
  checkGameOver: () => void;
  resetGame: () => void;
}

const initialState = {
  population: 1000,
  energy: 100,
  budget: 500,
  events: ["System initialized..."],
  isGameOver: false,
  turns: 0,
};

export const useCityStore = create<CityState>((set, get) => ({
  ...initialState,
  
  increasePopulation: (amount) => {
    set((state) => ({ 
      population: state.population + amount 
    }));
    get().checkGameOver();
  },
  
  spendEnergy: (amount) => {
    set((state) => ({ 
      energy: Math.max(state.energy - amount, 0) 
    }));
    get().checkGameOver();
  },
  
  spendBudget: (amount) => {
    set((state) => ({ 
      budget: Math.max(state.budget - amount, 0) 
    }));
    get().checkGameOver();
  },
  
  addEvent: (text) => {
    set((state) => ({ 
      events: [...state.events, text],
      turns: state.turns + 1
    }));
  },
  
  checkGameOver: () => {
    const state = get();
    
    if (state.energy <= 0 && state.budget <= 0) {
      set({ 
        isGameOver: true,
        events: [...state.events, "⚠️ CRITICAL: System failure - All resources depleted!"]
      });
    }
    
    if (state.energy <= 0 && state.budget > 0) {
      set({
        events: [...state.events, "⚠️ WARNING: Energy depleted! Budget operations only."]
      });
    }
    
    if (state.budget <= 0 && state.energy > 0) {
      set({
        events: [...state.events, "⚠️ WARNING: Budget depleted! Energy operations only."]
      });
    }
  },
  
  resetGame: () => {
    set({
      ...initialState,
      events: ["System restarted...", "District management initialized..."]
    });
  },
}));