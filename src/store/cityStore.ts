import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Building {
  id: string;
  name: string;
  description?: string;
  cost: number;
  energyCost: number;
  populationBonus: number;
  incomePerTurn: number;
  energyPerTurn: number;
  happinessBonus: number;
  owned: number;
  maxOwned?: number;
}

export interface CityState {
  // Core resources
  population: number;
  energy: number;
  budget: number;
  happiness?: number;
    
  // Game state
  events: string[];
  isGameOver: boolean;
  turns: number;
  score: number;
  highScore: number;
  
  // Buildings
  buildings: Building[];
  
  // Upgrades
  upgrades: {
    efficiency: number;
    solar: boolean;
    recycling: boolean;
    automation: boolean;
  };
  
  // Actions
  increasePopulation: (amount: number) => void;
  spendEnergy: (amount: number) => void;
  addEnergy: (amount: number) => void;
  spendBudget: (amount: number) => void;
  addBudget: (amount: number) => void;
  addEvent: (text: string) => void;
  checkGameOver: () => void;
  resetGame: () => void;
  nextTurn: () => void;
  buyBuilding: (buildingId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  demolishBuilding: (buildingId: string) => void;
}

const initialBuildings: Building[] = [
  {
    id: "housing",
    name: "Residential Block",
    cost: 100,
    energyCost: 10,
    populationBonus: 50,
    incomePerTurn: 5,
    energyPerTurn: -2,
    happinessBonus: 0,
    owned: 0
  },
  {
    id: "solar",
    name: "Solar Farm",
    cost: 150,
    energyCost: 0,
    populationBonus: 0,
    incomePerTurn: -5,
    energyPerTurn: 15,
    happinessBonus: 0,
    owned: 0
  },
  {
    id: "factory",
    name: "Factory",
    cost: 200,
    energyCost: 20,
    populationBonus: 20,
    incomePerTurn: 30,
    energyPerTurn: -10,
    happinessBonus: 0,
    owned: 0
  },
  {
    id: "lab",
    name: "Research Lab",
    cost: 300,
    energyCost: 15,
    populationBonus: 10,
    incomePerTurn: 10,
    energyPerTurn: -5,
    happinessBonus: 0,
    owned: 0
  }
];

const initialState = {
  population: 1000,
  energy: 100,
  budget: 500,
  events: ["System initialized...", "District online..."],
  isGameOver: false,
  turns: 0,
  score: 0,
  highScore: 0,
  buildings: initialBuildings,
  upgrades: {
    efficiency: 1,
    solar: false,
    recycling: false,
    automation: false
  }
};

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      increasePopulation: (amount) => {
        set((state) => ({ 
          population: state.population + amount,
          score: state.score + amount
        }));
      },
      
      spendEnergy: (amount) => {
        set((state) => ({ 
          energy: Math.max(state.energy - amount, 0) 
        }));
        get().checkGameOver();
      },
      
      addEnergy: (amount) => {
        set((state) => ({ 
          energy: Math.min(state.energy + amount, 200) // Cap at 200
        }));
      },
      
      spendBudget: (amount) => {
        set((state) => ({ 
          budget: Math.max(state.budget - amount, 0) 
        }));
        get().checkGameOver();
      },
      
      addBudget: (amount) => {
        set((state) => ({ 
          budget: state.budget + amount 
        }));
      },
      
      addEvent: (text) => {
        set((state) => ({ 
          events: [...state.events.slice(-20), text] // Keep last 20
        }));
      },
      
      nextTurn: () => {
        const state = get();
        let income = 0;
        let energyChange = 0;
        
        // Calculate income and energy from buildings
        state.buildings.forEach(building => {
          if (building.owned > 0) {
            income += building.incomePerTurn * building.owned;
            energyChange += building.energyPerTurn * building.owned;
          }
        });
        
        // Apply efficiency upgrade
        income = Math.floor(income * state.upgrades.efficiency);
        
        // Apply solar upgrade
        if (state.upgrades.solar) {
          energyChange += 5;
        }
        
        // Apply recycling upgrade
        if (state.upgrades.recycling) {
          income += 10;
        }
        
        set((state) => ({
          turns: state.turns + 1,
          budget: state.budget + income,
          energy: Math.max(0, Math.min(200, state.energy + energyChange)),
          score: state.score + Math.max(0, income)
        }));
        
        get().addEvent(`Turn ${state.turns + 1}: Income $${income}, Energy ${energyChange > 0 ? '+' : ''}${energyChange}`);
        
        // Random events (30% chance)
        if (Math.random() < 0.3) {
          const events = [
            { 
              text: "🌟 Tech breakthrough! +50 energy", 
              effect: () => get().addEnergy(50) 
            },
            { 
              text: "💰 Tax revenue! +$100", 
              effect: () => get().addBudget(100) 
            },
            { 
              text: "👥 Immigration wave! +100 population", 
              effect: () => get().increasePopulation(100) 
            },
            { 
              text: "⚡ Power surge! -30 energy", 
              effect: () => get().spendEnergy(30) 
            },
            { 
              text: "💸 Market crash! -$50", 
              effect: () => get().spendBudget(50) 
            }
          ];
          
          const event = events[Math.floor(Math.random() * events.length)];
          get().addEvent(event.text);
          event.effect();
        }
        
        get().checkGameOver();
      },
      
      buyBuilding: (buildingId) => {
        const state = get();
        const building = state.buildings.find(b => b.id === buildingId);
        
        if (!building) return;
        
        if (state.budget >= building.cost && state.energy >= building.energyCost) {
          set((state) => ({
            budget: state.budget - building.cost,
            energy: state.energy - building.energyCost,
            population: state.population + building.populationBonus,
            buildings: state.buildings.map(b => 
              b.id === buildingId ? { ...b, owned: b.owned + 1 } : b
            )
          }));
          
          get().addEvent(`Built ${building.name} (+${building.populationBonus} pop)`);
        }
      },
      
      buyUpgrade: (upgradeId) => {
        const upgradeCosts: Record<string, number> = {
          efficiency: 500,
          solar: 300,
          recycling: 400,
          automation: 600
        };
        
        const cost = upgradeCosts[upgradeId];
        const state = get();
        
        if (state.budget >= cost) {
          set((state) => ({
            budget: state.budget - cost,
            upgrades: {
              ...state.upgrades,
              [upgradeId]: upgradeId === 'efficiency' ? state.upgrades.efficiency + 0.1 : true
            }
          }));
          
          get().addEvent(`Purchased upgrade: ${upgradeId}`);
        }
      },
      
      checkGameOver: () => {
        const state = get();
        
        if (state.energy <= 0 && state.budget <= 0) {
          set({ 
            isGameOver: true,
            highScore: Math.max(state.score, state.highScore)
          });
          get().addEvent("⚠️ CRITICAL: System failure!");
        }
      },
      
      resetGame: () => {
        const currentHighScore = get().highScore;
        set({
          ...initialState,
          highScore: currentHighScore,
          buildings: initialBuildings.map(b => ({ ...b, owned: 0 })),
          events: ["System restarted...", "District management initialized..."]
        });
      },

      demolishBuilding: (buildingId: string) => {
        const state = get();
        const building = state.buildings.find(b => b.id === buildingId);
        if (!building || building.owned <= 0) return;
        set((state) => ({
          buildings: state.buildings.map(b => 
            b.id === buildingId ? { ...b, owned: b.owned - 1 } : b
          )
        }));
        get().addEvent(`Demolished ${building.name}`);
      },

    }),
    {
      name: 'neon-district-storage',
      partialize: (state) => ({ highScore: state.highScore })
    }
  )
);