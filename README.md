# 🌆 Neon District Manager

A turn-based city management game with a retro-neon look. Build a district, keep the lights on, keep your citizens happy and healthy, and survive as many turns as you can.

**▶ Play online:** https://vers4tii.github.io/Neon-District-Manager/

Works on desktop and on phones. Nothing to install, nothing to download.

## 🎯 Goal

Keep the district alive for **as many turns as possible** and reach the **highest score**. Grow the population, but never let the city run out of power, money, happiness or health.

A **How to play** page is built into the game: it opens automatically on your first visit and can be reopened with the **?** button at the top of the page.

## 🎮 Gameplay

### Resources

| Resource       | Role                                                                 |
| -------------- | -------------------------------------------------------------------- |
| **Budget**     | Money to build and research. Debt is allowed down to -$200.          |
| **Energy**     | Powers your buildings and your citizens. Capped at 200.              |
| **Population** | Grows toward your housing capacity. Counts toward the score.         |
| **Happiness**  | 0–100. Drives population growth. At 0 the citizens revolt.           |
| **Pollution**  | 0–100. Produced by industry. Above 25% it hurts health and happiness. |
| **Health**     | 0–100. Hurt by pollution, healed by hospitals. At 0 an epidemic starts. |

### Turns and actions

Each turn you have **3 actions** (**4** with *Automation Tech*). One action is used by:

- building a building
- buying an upgrade (*Automation Tech* itself is free)
- demolishing a building (refunds 50% of its cost)
- **Invest** – spend $50 for +5 happiness
- **Energy** – sell 20 energy for +$40

When you are done, press **Next / End Turn**. The turn then resolves:

1. Buildings produce income and energy (plus a free $25 and 5 energy for the district).
2. Citizens consume energy: 1 per 200 inhabitants.
3. Pollution builds up or fades, and its effect on health is applied.
4. Population moves toward the housing capacity, or shrinks if health is below 30%.
5. Happiness changes (income, energy, buildings, pollution, health, upgrades).
6. A random event may happen (probability grows slowly with the number of turns).
7. Game over conditions are checked.

The **Auto** button ends the turn for you every 8 seconds (paused while the tab is hidden).

### Game over

The game ends when any of these happens:

- **Blackout** – energy stays at 0 for 3 turns in a row
- **Revolt** – happiness reaches 0%
- **Epidemic** – health reaches 0%
- **Bankruptcy** – budget drops below -$200

The game over screen tells you which one it was.

### Score

Each turn adds `income (if positive) + population / 10 + happiness` to your score. The best score is saved in your browser (`localStorage`).

### Random events

Tech breakthrough, tax revenue, immigration wave, power surge, market crash, heatwave, workers' strike, epidemic outbreak, protests.

## 🏗️ Buildings

| Building          | Cost | Energy to build | Capacity | Income/turn | Energy/turn | Happiness | Pollution | Health | Max |
| ----------------- | ---- | --------------- | -------- | ----------- | ----------- | --------- | --------- | ------ | --- |
| Residential Block | $100 | 10              | +50      | +5          | -2          | +1        | –         | –      | 12  |
| Solar Farm        | $150 | 0               | –        | -5          | +15         | +1        | –         | –      | 10  |
| Factory           | $200 | 20              | +20      | +30         | -10         | -2        | +5        | –      | 8   |
| Research Lab      | $300 | 15              | +10      | +10         | -5          | 0         | +1        | –      | 6   |
| Neon Park         | $120 | 5               | +20      | -3          | -1          | +2        | -2        | –      | 8   |
| Hospital          | $250 | 15              | +10      | -15         | -6          | +1        | –         | +4     | 6   |
| Recycling Center  | $220 | 10              | –        | -12         | -5          | 0         | -5        | –      | 6   |

Base population capacity is 1,000. Buildings add to it. The happiness effect of all buildings is applied every turn (capped at ±3 per turn).

## 🔬 Upgrades

Upgrades are grouped by category. Some need another upgrade first (🔒).

| Category    | Upgrade            | Cost | Effect                                              | Requires         |
| ----------- | ------------------ | ---- | --------------------------------------------------- | ---------------- |
| Economy     | Efficiency Upgrade | $500+ | +10% building income per level (5 levels max)      | –                |
| Economy     | Tax Reform         | $300 | +15% total income, -1 happiness per turn            | –                |
| Economy     | Automation Tech    | $600 | +1 action per turn                                  | –                |
| Energy      | Solar Technology   | $300 | +3 energy per turn, +2 per Solar Farm               | –                |
| Energy      | Smart Grid         | $500 | Citizens consume 25% less energy                    | Solar Technology |
| Environment | Recycling System   | $400 | +$10 income and -4 pollution per turn               | –                |
| Environment | Green Tech         | $450 | Polluting buildings emit 40% less                   | Recycling System |
| Society     | Healthcare Program | $400 | Hospitals heal 50% more                             | –                |
| Society     | Public Transport   | $350 | +1 happiness per turn                               | –                |
| Society     | Education System   | $400 | Population grows 50% faster                         | –                |

The Efficiency Upgrade gets more expensive with each level.

## 🖥️ Interface

- **Tooltips everywhere** – hover a building, an upgrade or a stat (tap it on a phone) to see the details. Stat tooltips show the per-turn breakdown and what the next turn will bring.
- **City Stats Terminal** – live stats and a chart with one point per turn (population, budget and energy each have their own scale).
- **Sidebar tabs** – on large screens, Buildings and Upgrades are shown as tabs so the active panel uses the full height.
- **Responsive** – compact action bar and bottom-sheet tooltips on phones.
- **Audio** – ambient music and sound effects (they start after your first click or key press, as browsers require).

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite
- Zustand (game state; only the high score is persisted)
- Tailwind CSS 3 (via PostCSS)
- Chart.js + react-chartjs-2
- Tone.js (music and sound effects)
- Lucide React icons
- Express (a small `server/index.ts` status endpoint, not used by the game yet)

## 🚀 Getting Started

```bash
npm install
npm run dev       # development server on http://localhost:5173
npm run build     # type-check and production build
npm run preview   # preview the production build
npm run lint      # ESLint
```

### Dev cheats

In development mode only, press `Ctrl + Shift + C` to open a cheat panel (+$500, +50 energy, +250 population, reset).

## ☁️ Deployment

The site is deployed automatically to **GitHub Pages** by `.github/workflows/deploy.yml` on every push to `main`.

To set it up on a fork: in the repository, go to *Settings → Pages* and set the source to **GitHub Actions**. The workflow sets `VITE_BASE` so the site works under `/<repository-name>/`.

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Stats cards, stat tooltips and chart
│   ├── BuildingsPanel.tsx # Build / demolish
│   ├── UpgradesPanel.tsx  # Upgrades by category
│   ├── PolicyPanel.tsx    # Invest, Energy, Next Turn, Auto
│   ├── EventFeed.tsx      # Event log
│   ├── HoverCard.tsx      # Reusable tooltip (hover / tap)
│   ├── HowToPlay.tsx      # How to play page
│   └── GameOver.tsx       # Game over screen
├── hooks/
│   └── useAmbients.ts     # Music and sound effects
├── store/
│   └── cityStore.ts       # Game state and all rules (Zustand)
├── utils/
│   └── simulator.ts       # Legacy stub
└── App.tsx
server/
└── index.ts               # Minimal Express API
```

All game rules and balance constants (actions per turn, blackout and debt limits, building stats, upgrade effects) live in `src/store/cityStore.ts`. `getTurnPreview` computes what the next turn will do; it is used both to resolve the turn and to explain the stats in the tooltips.

## 🗺️ Ideas / Roadmap

- More buildings (mall, wind turbine, university, police)
- More events and disasters
- Building cost that grows with each purchase
- Show the energy cap in the UI (e.g. `120 / 200`)
- Clean up legacy code (`simulator.ts`) and the unused backend

## 🎨 Visual Design

80s/90s cyberpunk look: neon pink (`#c42b9a`) and cyan (`#14fff7`), scanlines, glow effects, Orbitron and Share Tech Mono fonts.
