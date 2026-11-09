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
  pollutionPerTurn: number;
  healthPerTurn: number;
  owned: number;
  maxOwned?: number;
}

export type UpgradeId =
  | "efficiency"
  | "solar"
  | "recycling"
  | "automation"
  | "green_tech"
  | "healthcare"
  | "smart_grid"
  | "public_transport"
  | "education"
  | "tax_reform";

export type UpgradeCategory = "economy" | "energy" | "environment" | "society";

export const UPGRADE_CATEGORIES: { id: UpgradeCategory; label: string }[] = [
  { id: "economy", label: "Economy" },
  { id: "energy", label: "Energy" },
  { id: "environment", label: "Environment" },
  { id: "society", label: "Society" },
];

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  cost: number;
  description: string;
  effects: string[]; // concrete effects, shown in the tooltip
  category: UpgradeCategory;
  requires?: UpgradeId;
  maxLevel?: number; // default 1
  repeatable?: boolean;
}

export const upgradeCatalog: UpgradeDefinition[] = [
  {
    id: "efficiency",
    name: "Efficiency Upgrade",
    cost: 500,
    category: "economy",
    description: "Optimize every building of the district.",
    effects: ["+10% income from buildings per level", "Maximum 5 levels"],
    repeatable: true,
    maxLevel: 5,
  },
  {
    id: "tax_reform",
    name: "Tax Reform",
    cost: 300,
    category: "economy",
    description: "Squeeze more money out of the citizens.",
    effects: ["+15% on your total income", "-1 happiness per turn"],
  },
  {
    id: "automation",
    name: "Automation Tech",
    cost: 600,
    category: "economy",
    description: "Machines take over the routine work.",
    effects: ["+1 action per turn (3 becomes 4)"],
  },
  {
    id: "solar",
    name: "Solar Technology",
    cost: 300,
    category: "energy",
    description: "Better panels for every Solar Farm.",
    effects: ["+3 energy per turn", "+2 energy per turn for each Solar Farm"],
  },
  {
    id: "smart_grid",
    name: "Smart Grid",
    cost: 500,
    category: "energy",
    requires: "solar",
    description: "A smarter network wastes less power.",
    effects: ["Citizens consume 25% less energy"],
  },
  {
    id: "recycling",
    name: "Recycling System",
    cost: 400,
    category: "environment",
    description: "Turn waste into money and cleaner air.",
    effects: ["+$10 income per turn", "-4 pollution per turn"],
  },
  {
    id: "green_tech",
    name: "Green Tech",
    cost: 450,
    category: "environment",
    requires: "recycling",
    description: "Cleaner production lines.",
    effects: ["Polluting buildings emit 40% less pollution"],
  },
  {
    id: "healthcare",
    name: "Healthcare Program",
    cost: 400,
    category: "society",
    description: "Better equipment and staff in every hospital.",
    effects: ["Hospitals heal 50% more health"],
  },
  {
    id: "public_transport",
    name: "Public Transport",
    cost: 350,
    category: "society",
    description: "Citizens move around easily.",
    effects: ["+1 happiness per turn"],
  },
  {
    id: "education",
    name: "Education System",
    cost: 400,
    category: "society",
    description: "Attracts new families to the district.",
    effects: ["Population grows 50% faster toward its capacity"],
  },
];

export type UpgradeState = { efficiency: number } & Record<
  Exclude<UpgradeId, "efficiency">,
  boolean
>;

const BASE_POPULATION_CAPACITY = 1000;
export const MAX_ACTIONS_PER_TURN = 3;
export const INVEST_COST = 50;
export const ENERGY_CONVERT_COST = 20;
export const BASE_INCOME_PER_TURN = 25;
export const BASE_ENERGY_PER_TURN = 5;
export const HISTORY_LENGTH = 30;
export const AUTO_TURN_SECONDS = 8;
export const POLLUTION_SAFE_LEVEL = 25;
const POLLUTION_NATURAL_DECAY = 3;
const POLLUTION_RECYCLING_DECAY = 4;
const CITIZENS_PER_ENERGY_UNIT = 200; // each 200 citizens use 1 energy / turn
export const BLACKOUT_LIMIT = 3;
export const DEBT_LIMIT = -200;
const EFFICIENCY_BONUS_PER_LEVEL = 0.1;
export const GREEN_TECH_FACTOR = 0.6; // polluting buildings emit 60%
export const HEALTHCARE_BONUS = 0.5; // hospitals heal +50%
export const SMART_GRID_FACTOR = 0.75; // citizens use 75% of the energy
export const EDUCATION_GROWTH = 1.5; // population grows 1.5x faster
export const TAX_REFORM_RATE = 0.15;

export const getEfficiencyMultiplier = (level: number) =>
  1 + level * EFFICIENCY_BONUS_PER_LEVEL;

export const getUpgradeCost = (upgradeId: string, efficiencyLevel: number) => {
  if (upgradeId === "efficiency") {
    return Math.round(500 * (1 + efficiencyLevel * 0.6));
  }
  return upgradeCatalog.find((item) => item.id === upgradeId)?.cost ?? 0;
};

export const getUpgradeLevel = (upgrades: UpgradeState, id: UpgradeId) =>
  id === "efficiency" ? upgrades.efficiency : upgrades[id] ? 1 : 0;

export const isUpgradeMaxed = (
  upgrades: UpgradeState,
  def: UpgradeDefinition,
) => getUpgradeLevel(upgrades, def.id) >= (def.maxLevel ?? 1);

// The upgrade that still has to be bought first, if any
export const getMissingRequirement = (
  upgrades: UpgradeState,
  def: UpgradeDefinition,
) =>
  def.requires && !getUpgradeLevel(upgrades, def.requires)
    ? upgradeCatalog.find((item) => item.id === def.requires)
    : undefined;

export const getMaxActions = (upgrades: UpgradeState) =>
  MAX_ACTIONS_PER_TURN + (upgrades.automation ? 1 : 0);

export const getPopulationCapacity = (buildings: Building[]) =>
  BASE_POPULATION_CAPACITY +
  buildings.reduce((sum, b) => sum + b.populationBonus * b.owned, 0);

export interface TurnSnapshot {
  turn: number;
  population: number;
  energy: number;
  budget: number;
  happiness: number;
}

export interface CityState {
  // Core resources
  population: number;
  energy: number;
  budget: number;
  happiness: number;
  pollution: number; // 0-100, rises with industry
  health: number; // 0-100, hurt by pollution, healed by hospitals

  // Game state
  events: string[];
  isGameOver: boolean;
  gameOverReason: string;
  turns: number;
  score: number;
  highScore: number;
  blackoutTurns: number;
  actionsLeft: number; // build / upgrade / demolish actions left this turn
  history: TurnSnapshot[]; // one entry per turn, for the chart
  autoTurn: boolean; // end the turn automatically on a timer

  // Buildings
  buildings: Building[];

  // Upgrades
  upgrades: UpgradeState; // efficiency is a level (0 = none), the rest are owned or not

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
  setAutoTurn: (enabled: boolean) => void;
  investBudget: () => void;
  convertEnergy: () => void;
}

const initialBuildings: Building[] = [
  {
    id: "housing",
    name: "Residential Block",
    description: "Homes for your citizens. Raises the population capacity.",
    cost: 100,
    energyCost: 10,
    populationBonus: 50,
    incomePerTurn: 5,
    energyPerTurn: -2,
    happinessBonus: 1,
    pollutionPerTurn: 0,
    healthPerTurn: 0,
    owned: 0,
    maxOwned: 12,
  },
  {
    id: "solar",
    name: "Solar Farm",
    description: "Clean power. Your main defense against blackouts.",
    cost: 150,
    energyCost: 0,
    populationBonus: 0,
    incomePerTurn: -5,
    energyPerTurn: 15,
    happinessBonus: 1,
    pollutionPerTurn: 0,
    healthPerTurn: 0,
    owned: 0,
    maxOwned: 10,
  },
  {
    id: "factory",
    name: "Factory",
    description: "Big income, but pollutes and makes citizens unhappy.",
    cost: 200,
    energyCost: 20,
    populationBonus: 20,
    incomePerTurn: 30,
    energyPerTurn: -10,
    happinessBonus: -2,
    pollutionPerTurn: 5,
    healthPerTurn: 0,
    owned: 0,
    maxOwned: 8,
  },
  {
    id: "lab",
    name: "Research Lab",
    description: "Steady income with a little pollution.",
    cost: 300,
    energyCost: 15,
    populationBonus: 10,
    incomePerTurn: 10,
    energyPerTurn: -5,
    happinessBonus: 0,
    pollutionPerTurn: 1,
    healthPerTurn: 0,
    owned: 0,
    maxOwned: 6,
  },
  {
    id: "park",
    name: "Neon Park",
    description: "Makes citizens happy and cleans a bit of the air.",
    cost: 120,
    energyCost: 5,
    populationBonus: 20,
    incomePerTurn: -3,
    energyPerTurn: -1,
    happinessBonus: 2,
    pollutionPerTurn: -2,
    healthPerTurn: 0,
    owned: 0,
    maxOwned: 8,
  },
  {
    id: "hospital",
    name: "Hospital",
    description: "Heals citizens every turn. Expensive to run.",
    cost: 250,
    energyCost: 15,
    populationBonus: 10,
    incomePerTurn: -15,
    energyPerTurn: -6,
    happinessBonus: 1,
    pollutionPerTurn: 0,
    healthPerTurn: 4,
    owned: 0,
    maxOwned: 6,
  },
  {
    id: "recycling_center",
    name: "Recycling Center",
    description: "Filters industrial emissions. Costly to run.",
    cost: 220,
    energyCost: 10,
    populationBonus: 0,
    incomePerTurn: -12,
    energyPerTurn: -5,
    happinessBonus: 0,
    pollutionPerTurn: -5,
    healthPerTurn: 0,
    owned: 0,
    maxOwned: 6,
  },
];

// Building stats once your upgrades are applied
export const getEffectiveBuildingStats = (
  building: Building,
  upgrades: UpgradeState,
) => ({
  pollution:
    building.pollutionPerTurn > 0 && upgrades.green_tech
      ? Math.round(building.pollutionPerTurn * GREEN_TECH_FACTOR)
      : building.pollutionPerTurn,
  health: upgrades.healthcare
    ? building.healthPerTurn +
      Math.floor(building.healthPerTurn * HEALTHCARE_BONUS)
    : building.healthPerTurn,
});

export interface TurnPreview {
  income: {
    buildings: number;
    base: number;
    recycling: number;
    tax: number;
    total: number;
  };
  energy: {
    buildings: number;
    base: number;
    citizens: number;
    solar: number;
    total: number;
    next: number;
  };
  pollution: {
    buildings: number;
    natural: number;
    recycling: number;
    total: number;
    next: number;
  };
  health: {
    care: number;
    penalty: number;
    recovery: number;
    total: number;
    next: number;
  };
  happiness: {
    income: number;
    energy: number;
    buildings: number;
    pollution: number;
    health: number;
    transport: number;
    tax: number;
    total: number;
    next: number;
  };
  population: { capacity: number; change: number; next: number };
  budgetNext: number;
}

type PreviewInput = Pick<
  CityState,
  | "population"
  | "energy"
  | "budget"
  | "happiness"
  | "pollution"
  | "health"
  | "buildings"
  | "upgrades"
>;

// What the next turn will do, before random events. Used both to resolve the
// turn and to explain the stats to the player.
export const getTurnPreview = (state: PreviewInput): TurnPreview => {
  let buildingsIncome = 0;
  let buildingsEnergy = 0;
  let buildingsHappiness = 0;
  let polluting = 0;
  let cleaning = 0;
  let healthCare = 0;
  let solarFarms = 0;

  state.buildings.forEach((b) => {
    buildingsIncome += b.incomePerTurn * b.owned;
    buildingsEnergy += b.energyPerTurn * b.owned;
    buildingsHappiness += b.happinessBonus * b.owned;
    if (b.pollutionPerTurn > 0) polluting += b.pollutionPerTurn * b.owned;
    else cleaning += b.pollutionPerTurn * b.owned;
    healthCare += b.healthPerTurn * b.owned;
    if (b.id === "solar") solarFarms = b.owned;
  });

  const buildingsPollution =
    (state.upgrades.green_tech
      ? Math.round(polluting * GREEN_TECH_FACTOR)
      : polluting) + cleaning;
  if (state.upgrades.healthcare) {
    healthCare += Math.floor(healthCare * HEALTHCARE_BONUS);
  }

  const income = {
    buildings: Math.floor(
      buildingsIncome * getEfficiencyMultiplier(state.upgrades.efficiency),
    ),
    base: BASE_INCOME_PER_TURN,
    recycling: state.upgrades.recycling ? 10 : 0,
    tax: 0,
    total: 0,
  };
  const grossIncome = income.buildings + income.base + income.recycling;
  income.tax = state.upgrades.tax_reform
    ? Math.max(0, Math.floor(grossIncome * TAX_REFORM_RATE))
    : 0;
  income.total = grossIncome + income.tax;

  const energy = {
    buildings: buildingsEnergy,
    base: BASE_ENERGY_PER_TURN,
    // Citizens consume energy: the bigger the district, the more it needs
    citizens: -Math.floor(
      (state.population / CITIZENS_PER_ENERGY_UNIT) *
        (state.upgrades.smart_grid ? SMART_GRID_FACTOR : 1),
    ),
    solar: state.upgrades.solar ? 3 + 2 * solarFarms : 0,
    total: 0,
    next: 0,
  };
  energy.total =
    energy.buildings + energy.base + energy.citizens + energy.solar;
  energy.next = Math.max(0, Math.min(200, state.energy + energy.total));

  // Pollution builds up, then hurts the health of the citizens
  const pollution = {
    buildings: buildingsPollution,
    natural: -POLLUTION_NATURAL_DECAY,
    recycling: state.upgrades.recycling ? -POLLUTION_RECYCLING_DECAY : 0,
    total: 0,
    next: 0,
  };
  pollution.total =
    pollution.buildings + pollution.natural + pollution.recycling;
  pollution.next = Math.max(0, Math.min(100, state.pollution + pollution.total));

  const health = {
    care: healthCare,
    penalty:
      pollution.next > POLLUTION_SAFE_LEVEL
        ? -Math.ceil((pollution.next - POLLUTION_SAFE_LEVEL) / 10)
        : 0,
    recovery: pollution.next <= POLLUTION_SAFE_LEVEL ? 1 : 0,
    total: 0,
    next: 0,
  };
  health.total = health.care + health.penalty + health.recovery;
  health.next = Math.max(0, Math.min(100, state.health + health.total));

  // Population drifts toward capacity (faster when happy); sickness shrinks it
  const capacity = getPopulationCapacity(state.buildings);
  const gap = capacity - state.population;
  const rate =
    gap >= 0
      ? (0.05 + (state.happiness / 100) * 0.15) *
        (state.upgrades.education ? EDUCATION_GROWTH : 1)
      : 0.1;
  const populationChange =
    health.next < 30
      ? -Math.max(1, Math.floor(state.population * 0.03))
      : gap === 0
        ? 0
        : Math.trunc(gap * rate) || Math.sign(gap);

  const happiness = {
    income: income.total > 0 ? 2 : -1,
    energy: energy.total >= 0 ? 1 : -2,
    buildings: Math.max(-3, Math.min(3, Math.round(buildingsHappiness / 2))),
    pollution: -Math.floor(pollution.next / 25),
    health: health.next < 40 ? -2 : 0,
    transport: state.upgrades.public_transport ? 1 : 0,
    tax: state.upgrades.tax_reform ? -1 : 0,
    total: 0,
    next: 0,
  };
  happiness.total =
    happiness.income +
    happiness.energy +
    happiness.buildings +
    happiness.pollution +
    happiness.health +
    happiness.transport +
    happiness.tax;
  happiness.next = Math.max(
    0,
    Math.min(100, state.happiness + happiness.total),
  );

  return {
    income,
    energy,
    pollution,
    health,
    happiness,
    population: {
      capacity,
      change: populationChange,
      next: state.population + populationChange,
    },
    budgetNext: state.budget + income.total,
  };
};

const initialState = {
  population: 1000,
  energy: 100,
  budget: 500,
  happiness: 65,
  pollution: 0,
  health: 80,
  events: ["System initialized...", "District online..."],
  isGameOver: false,
  gameOverReason: "",
  turns: 0,
  score: 0,
  highScore: 0,
  blackoutTurns: 0,
  actionsLeft: MAX_ACTIONS_PER_TURN,
  history: [
    { turn: 0, population: 1000, energy: 100, budget: 500, happiness: 65 },
  ] as TurnSnapshot[],
  autoTurn: false,
  buildings: initialBuildings,
  upgrades: {
    efficiency: 0,
    solar: false,
    recycling: false,
    automation: false,
    green_tech: false,
    healthcare: false,
    smart_grid: false,
    public_transport: false,
    education: false,
    tax_reform: false,
  } as UpgradeState,
};

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      ...initialState,

      increasePopulation: (amount) => {
        set((state) => ({ population: state.population + amount }));
      },

      spendEnergy: (amount) => {
        set((state) => ({
          energy: Math.max(state.energy - amount, 0),
        }));
      },

      addEnergy: (amount) => {
        set((state) => ({
          energy: Math.min(state.energy + amount, 200), // Cap at 200
        }));
      },

      spendBudget: (amount) => {
        set((state) => ({
          budget: state.budget - amount, // may go negative (debt)
        }));
      },

      addBudget: (amount) => {
        set((state) => ({
          budget: state.budget + amount,
        }));
      },

      addEvent: (text) => {
        set((state) => ({
          events: [...state.events.slice(-20), text], // Keep last 20
        }));
      },

      nextTurn: () => {
        const state = get();
        if (state.isGameOver) return;

        const preview = getTurnPreview(state);
        const income = preview.income.total;
        const energyChange = preview.energy.total;
        const populationChange = preview.population.change;
        const newPollution = preview.pollution.next;
        const newHealth = preview.health.next;
        const newPopulation = preview.population.next;
        const newHappiness = preview.happiness.next;

        set({
          turns: state.turns + 1,
          actionsLeft: getMaxActions(state.upgrades),
          budget: state.budget + income,
          energy: Math.max(0, Math.min(200, state.energy + energyChange)),
          population: newPopulation,
          happiness: newHappiness,
          pollution: newPollution,
          health: newHealth,
          score:
            state.score +
            Math.max(0, income) +
            Math.floor(newPopulation / 10) +
            newHappiness,
        });

        get().addEvent(
          `Turn ${state.turns + 1}: Income $${income}, Energy ${energyChange > 0 ? "+" : ""}${energyChange}, Pop ${populationChange >= 0 ? "+" : ""}${populationChange}, Pollution ${newPollution}%, Health ${newHealth}%`,
        );

        if (Math.random() < 0.3 + Math.min(0.2, state.turns * 0.005)) {
          const events = [
            { text: "🌟 Tech breakthrough! +50 energy", effect: () => get().addEnergy(50) },
            { text: "💰 Tax revenue! +$100", effect: () => get().addBudget(100) },
            { text: "👥 Immigration wave! +100 population", effect: () => get().increasePopulation(100) },
            { text: "⚡ Power surge! -30 energy", effect: () => get().spendEnergy(30) },
            { text: "💸 Market crash! -$50", effect: () => get().spendBudget(50) },
            { text: "🔥 Heatwave! -20 energy", effect: () => get().spendEnergy(20) },
            { text: "✊ Workers' strike! -$80", effect: () => get().spendBudget(80) },
            {
              text: "🤒 Epidemic outbreak! -15 health",
              effect: () =>
                set((st) => ({ health: Math.max(0, st.health - 15) })),
            },
            {
              text: "😠 Protests in the streets! -8 happiness",
              effect: () =>
                set((st) => ({ happiness: Math.max(0, st.happiness - 8) })),
            },
          ];

          const event = events[Math.floor(Math.random() * events.length)];
          event.effect();
          get().addEvent(event.text);
        }

        // Blackout counter uses the final energy of the turn
        const blackoutTurns = get().energy <= 0 ? state.blackoutTurns + 1 : 0;
        set({ blackoutTurns });

        const after = get();
        set({
          history: [
            ...after.history,
            {
              turn: after.turns,
              population: after.population,
              energy: after.energy,
              budget: after.budget,
              happiness: after.happiness,
            },
          ].slice(-HISTORY_LENGTH),
        });

        if (blackoutTurns > 0 && blackoutTurns < BLACKOUT_LIMIT) {
          get().addEvent(
            `⚠️ Blackout ${blackoutTurns}/${BLACKOUT_LIMIT}: restore power or the district collapses!`,
          );
        }
        if (get().pollution > 60) {
          get().addEvent(`☣️ Pollution is critical (${get().pollution}%)`);
        }
        if (get().health < 40 && get().health > 0) {
          get().addEvent(`🏥 Citizens are getting sick (health ${get().health}%)`);
        }
        if (get().budget < 0 && get().budget >= DEBT_LIMIT) {
          get().addEvent(`⚠️ District in debt: $${get().budget}`);
        }

        get().checkGameOver();
      },

      buyBuilding: (buildingId) => {
        const state = get();
        const building = state.buildings.find((b) => b.id === buildingId);

        if (!building || state.actionsLeft <= 0) return;

        const maxOwned = building.maxOwned ?? Number.MAX_SAFE_INTEGER;
        if (building.owned >= maxOwned) return;

        if (
          state.budget >= building.cost &&
          state.energy >= building.energyCost
        ) {
          set((state) => ({
            actionsLeft: state.actionsLeft - 1,
            budget: state.budget - building.cost,
            energy: state.energy - building.energyCost,
            buildings: state.buildings.map((b) =>
              b.id === buildingId ? { ...b, owned: b.owned + 1 } : b,
            ),
          }));

          get().addEvent(
            `Built ${building.name} (+${building.populationBonus} capacity)`,
          );
        }
      },

      buyUpgrade: (upgradeId) => {
        const state = get();
        const upgrade = upgradeCatalog.find((item) => item.id === upgradeId);

        if (!upgrade || state.actionsLeft <= 0) return;
        if (isUpgradeMaxed(state.upgrades, upgrade)) return;
        if (getMissingRequirement(state.upgrades, upgrade)) return;

        const cost = getUpgradeCost(upgradeId, state.upgrades.efficiency);
        if (state.budget < cost) return;

        set((state) => ({
          // Automation grants the extra action it costs, so buying it is free
          actionsLeft: state.actionsLeft - (upgradeId === "automation" ? 0 : 1),
          budget: state.budget - cost,
          upgrades: {
            ...state.upgrades,
            [upgradeId]:
              upgradeId === "efficiency" ? state.upgrades.efficiency + 1 : true,
          } as UpgradeState,
        }));

        get().addEvent(`Purchased upgrade: ${upgrade.name}`);
      },

      checkGameOver: () => {
        const state = get();
        if (state.isGameOver) return;

        let reason: string | null = null;
        if (state.blackoutTurns >= BLACKOUT_LIMIT) {
          reason = "Prolonged blackout";
        } else if (state.health <= 0) {
          reason = "Epidemic";
        } else if (state.happiness <= 0) {
          reason = "Citizens revolt";
        } else if (state.budget < DEBT_LIMIT) {
          reason = "Bankruptcy";
        }

        if (reason) {
          set({
            isGameOver: true,
            gameOverReason: reason,
            highScore: Math.max(state.score, state.highScore),
          });
          get().addEvent(`⚠️ CRITICAL: ${reason}! System failure!`);
        }
      },

      resetGame: () => {
        const currentHighScore = get().highScore;
        set({
          ...initialState,
          highScore: currentHighScore,
          buildings: initialBuildings.map((b) => ({ ...b, owned: 0 })),
          events: ["System restarted...", "District management initialized..."],
        });
      },

      setAutoTurn: (enabled) => set({ autoTurn: enabled }),

      investBudget: () => {
        const state = get();
        if (state.actionsLeft <= 0 || state.budget < INVEST_COST) return;

        set({
          actionsLeft: state.actionsLeft - 1,
          budget: state.budget - INVEST_COST,
          happiness: Math.min(100, state.happiness + 5),
        });
        get().addEvent(
          `Invested $${INVEST_COST} in public services (+5 happiness)`,
        );
      },

      convertEnergy: () => {
        const state = get();
        if (state.actionsLeft <= 0 || state.energy < ENERGY_CONVERT_COST)
          return;

        set({
          actionsLeft: state.actionsLeft - 1,
          energy: state.energy - ENERGY_CONVERT_COST,
          budget: state.budget + 40,
        });
        get().addEvent(`Sold ${ENERGY_CONVERT_COST} energy to the grid (+$40)`);
      },

      demolishBuilding: (buildingId: string) => {
        const state = get();
        const building = state.buildings.find((b) => b.id === buildingId);
        if (!building || building.owned <= 0 || state.actionsLeft <= 0) return;

        const refund = Math.floor(building.cost * 0.5);
        set((state) => {
          const buildings = state.buildings.map((b) =>
            b.id === buildingId ? { ...b, owned: b.owned - 1 } : b,
          );
          return {
            actionsLeft: state.actionsLeft - 1,
            budget: state.budget + refund,
            buildings,
            population: Math.min(
              state.population,
              getPopulationCapacity(buildings),
            ),
          };
        });
        get().addEvent(`Demolished ${building.name} and refunded $${refund}`);
      },
    }),
    {
      name: "neon-district-storage",
      partialize: (state) => ({ highScore: state.highScore }),
    },
  ),
);
