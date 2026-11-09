# 🌆 Neon District Manager

A turn-based city management game with a retro-neon look. Build a district, keep the lights on, keep your citizens happy, and survive as many turns as you can.

## 🎮 Gameplay

You manage a district through four resources:

| Resource       | Role                                                        |
| -------------- | ----------------------------------------------------------- |
| **Budget**     | Money to build and research. Can go into debt (down to -$200). |
| **Energy**     | Powers your buildings. Capped at 200.                       |
| **Population** | Grows toward your housing capacity. Counts toward the score. |
| **Happiness**  | 0–100. Drives population growth and can end the game.       |

### Turns and actions

Each turn you have **3 actions**. These actions use one each:

- Build a building
- Buy an upgrade
- Demolish a building (refunds 50% of its cost)
- **Invest** – spend $50 for +5 happiness
- **Energy** – sell 20 energy for +$40

When you are done (or out of actions), press **End Turn**. The turn then resolves:

1. Buildings produce income and energy (multiplied by the Efficiency upgrade).
2. Population drifts toward capacity, faster when happiness is high.
3. Happiness changes depending on income, energy balance and buildings.
4. With a 30% chance, a random event happens (tech breakthrough, tax revenue, immigration wave, power surge, market crash).
5. Game over conditions are checked.

### Game over

The game ends when any of these happens:

- **Blackout** – energy stays at 0 for 3 turns in a row
- **Revolt** – happiness reaches 0
- **Bankruptcy** – budget drops below -$200

### Score

Each turn adds `income (if positive) + population / 10 + happiness` to your score. The high score is saved in `localStorage`.

## 🏗️ Buildings

| Building          | Cost | Energy cost | Capacity | Income/turn | Energy/turn | Happiness | Max |
| ----------------- | ---- | ----------- | -------- | ----------- | ----------- | --------- | --- |
| Residential Block | $100 | 10          | +50      | +5          | -2          | +1        | 12  |
| Solar Farm        | $150 | 0           | –        | -5          | +15         | +1        | 10  |
| Factory           | $200 | 20          | +20      | +30         | -10         | -2        | 8   |
| Research Lab      | $300 | 15          | +10      | +10         | -5          | 0         | 6   |
| Neon Park         | $120 | 5           | +20      | -3          | -1          | +2        | 8   |

Base population capacity is 1,000. Buildings add to it. The happiness effect of all buildings is applied every turn (capped at ±3 per turn).

## 🔬 Upgrades

- **Efficiency Upgrade** – +10% income per level, repeatable, cost grows with each level
- **Solar Technology** – +5 energy per turn
- **Recycling System** – +$10 income per turn
- **Automation Tech** – placeholder, no effect yet

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite
- Zustand (state, with persistence of the high score)
- Tailwind CSS 3 (via PostCSS)
- Chart.js + react-chartjs-2
- Tone.js (ambient music and sound effects)
- Framer Motion, Lucide React
- Express (small `server/index.ts` status endpoint, not used by the game yet)

## 🚀 Getting Started

```bash
npm install
npm run dev       # development server on http://localhost:5173
npm run build     # type-check and production build
npm run preview   # preview the production build
npm run lint      # ESLint
```

Audio only starts after your first click or key press (browser autoplay policy).

### Dev cheats

In development mode only, press `Ctrl + Shift + C` to open a cheat panel (+$500, +50 energy, +250 population, reset).

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Stats cards and chart
│   ├── BuildingsPanel.tsx # Build / demolish
│   ├── UpgradesPanel.tsx  # Research upgrades
│   ├── PolicyPanel.tsx    # Invest, Energy, End Turn
│   ├── EventFeed.tsx      # Event log
│   └── GameOver.tsx       # Game over screen
├── hooks/
│   └── useAmbients.ts     # Music and sound effects
├── store/
│   └── cityStore.ts       # Game state and rules (Zustand)
├── utils/
│   └── simulator.ts       # Legacy stub
└── App.tsx
server/
└── index.ts               # Minimal Express API
```

All game rules and balance constants (`MAX_ACTIONS_PER_TURN`, blackout and debt limits, building stats) live in `src/store/cityStore.ts`.

## 🗺️ Ideas / Roadmap

- More buildings (hospital, mall, wind turbine, university) — icons already exist in the UI
- Real effect for Automation Tech
- Pollution, crime and disaster events
- Tutorial and pause/settings menu
- Show the energy cap in the UI (e.g. `120 / 200`)
- Clean up legacy code (`simulator.ts`) and the unused backend

## 🎨 Visual Design

80s/90s cyberpunk look: neon pink (`#c42b9a`) and cyan (`#14fff7`), scanlines, glow effects, Orbitron and Share Tech Mono fonts.
