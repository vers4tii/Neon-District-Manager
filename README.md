# 🌆 Neon District Manager

A futuristic city management simulation game with a retro-neon aesthetic. Manage resources, construct buildings, research upgrades, and keep your district thriving in this immersive idle/strategy game.

## 🎮 Game Overview

You are the manager of a neon-lit district. Balance three critical resources:
- **Population** - Your workforce and productivity
- **Energy** - Power for buildings and city operations
- **Budget** - Money to construct and upgrade

Make strategic decisions to keep the district running before both energy and budget hit zero!

---

## ✅ Current Features

### Core Gameplay
- **Real-time Resource Management** - Monitor and manage population, energy, and budget simultaneously
- **City Stats Terminal** - Beautiful dashboard with live stats and chart visualization
- **Turn-Based Events** - Advance turns to trigger income, energy changes, and random events
- **Random Event System** - 30% chance per turn for tech breakthroughs, tax revenue, crises, etc.

### Buildings (4 Available)
- **Residential Block** - Increases population, generates income
- **Solar Farm** - Generates energy, no population bonus
- **Factory** - High income production with energy consumption
- **Research Lab** - Research opportunities with balanced stats

### Upgrades & Progression
- **Efficiency Upgrade** - Incrementally improves income (repeatable)
- **Solar Technology** - Permanently increases energy generation
- **Recycling System** - Permanently increases budget income
- **Automation Tech** - Placeholder for future automation features

### User Interface
- **Sticky Action Bar** - Invest, Use Energy, and Skip Turn buttons always accessible
- **Responsive Sidebar Layout** - Building and upgrade panels on the side (desktop), below on mobile
- **Event Log Feed** - Real-time display of game events
- **Neon Aesthetic** - Retro-cyberpunk visual design with animated effects
- **Audio Controls** - Toggle background music and sound effects

### Audio System
- **Ambient Soundtrack** - Atmospheric drone and synthesizer background music
- **Sound Effects** - Click, success, and error feedback sounds
- **Audio Toggle** - Mute/unmute button in the UI

### Game State
- **Persistent Save Data** - Game progress saved to localStorage
- **High Score Tracking** - Records best score across sessions
- **Game Over Screen** - Detailed end-game state with restart option

---

## 🚧 What's Currently Working

✅ Resource management mechanics  
✅ Building purchase and demolition  
✅ Upgrade system with repeatable and one-time purchases  
✅ Turn simulation with income/energy calculations  
✅ Event log and UI responsiveness  
✅ Audio system with ambient music and SFX  
✅ Game over detection and state persistence  
✅ Sticky action buttons for better UX  
✅ Responsive dashboard layout  

---

## ⚠️ Known Issues & Limitations

### Current Bugs/Issues
- **Limited Building Variety** - Only 4 buildings available (more need implementation)
- **Limited Upgrade Types** - 4 upgrade categories (could expand significantly)
- **Basic Random Events** - Limited event variety (5 event types)
- **No Disaster System** - No natural disasters or crisis events
- **No Population Happiness Mechanics** - Happiness stat exists but isn't fully integrated
- **No Pollution/Environment System** - No environmental consequences for building choices

### UI/UX Limitations
- **Mobile Optimization** - Sidebar stacking could be improved on very small screens
- **No Tutorial** - First-time players might be confused
- **No Pausing** - Game always advances on turn skip
- **No Building Descriptions** - Some building effects aren't clearly explained

### Game Balance
- **Difficulty Curve** - Game can be too easy with solar farms
- **No Scaling** - Late-game can feel repetitive
- **Income Imbalance** - Some buildings are overpowered compared to others
- **Energy Cap** - Hard-coded at 200, may need adjustment

---

## 🚀 Future Features (Planned)

### Additional Buildings
- **Hospital** - Improves happiness, increases budget costs
- **Police Station** - Crime prevention system (future feature)
- **Shopping Mall** - Generates luxury revenue
- **Wind Turbine** - Alternative energy source
- **University** - Education and research bonuses
- **Park** - Happiness and population attraction
- **Recycling Center** - Environmental benefits

### Enhanced Game Mechanics
- **Pollution System** - Buildings create pollution affecting happiness
- **Crime System** - Population becomes unhappy with crime
- **Disaster Events** - Random natural disasters/crises
- **Trade Routes** - Export goods for additional income
- **Population Needs** - Different demographics with unique demands
- **District Zones** - Residential, commercial, industrial zones with adjacency bonuses

### Upgrades & Research
- **Tech Tree** - More structured upgrade progression
- **Building Automation** - Reduce manual button presses
- **Green Energy** - Special research path for eco-friendly buildings
- **Population Controls** - Birth rate and immigration management
- **Infrastructure** - Road networks and public transport

### UI Enhancements
- **Tutorial/Help System** - Guided introduction for new players
- **Pause Feature** - Pause game without skipping turns
- **Settings Menu** - Difficulty modes, visual preferences
- **Statistics Dashboard** - Detailed analytics and graphs
- **Achievements** - Milestone tracking system
- **Leaderboard** - High score competition (multiplayer potential)

### Content Additions
- **Multiple Districts** - Manage several districts with shared resources
- **NPC Characters** - Citizens with personalities and needs
- **Story Campaign** - Narrative-driven goals and milestones
- **Seasons/Time Cycles** - Weather effects and seasonal events
- **Night/Day Cycle** - Visual time progression

### Technical Improvements
- **Backend Integration** - Server-side game state (Express API ready)
- **Cloud Saves** - Save progress to cloud
- **Multiplayer** - Competitive or cooperative modes
- **Mobile App** - Native iOS/Android version
- **Accessibility** - Better keyboard navigation, screen reader support
- **Performance** - Optimize for larger city sizes

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand (with persistence)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Audio**: Tone.js
- **Icons**: Lucide React
- **Backend**: Express.js (Node.js)

---

## 🎮 How to Play

1. **Manage Resources** - Keep an eye on Population, Energy, and Budget
2. **Construct Buildings** - Use the sidebar to build structures that generate income/energy
3. **Research Upgrades** - Upgrade technology to improve efficiency
4. **Skip Turns** - Trigger income generation and random events
5. **Stay Alive** - Avoid having BOTH energy and budget reach zero simultaneously

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Backend Server
```bash
npm run server
# API runs on http://localhost:3000
```

---

## 📝 Project Structure

```
src/
├── components/          # React UI components
│   ├── Dashboard.tsx   # Main stats and charts
│   ├── BuildingsPanel.tsx
│   ├── UpgradesPanel.tsx
│   ├── PolicyPanel.tsx # Action buttons
│   ├── EventFeed.tsx   # Event log
│   └── GameOver.tsx    # Game over screen
├── hooks/              # Custom React hooks
│   └── useAmbients.ts  # Audio system
├── store/              # State management
│   └── cityStore.ts    # Zustand store
├── utils/              # Utility functions
│   └── simulator.ts    # Game event simulation
└── App.tsx             # Main app component
```

---

## 📊 Game Statistics

- **Starting Population**: 1,000
- **Starting Energy**: 100
- **Starting Budget**: $500
- **Max Energy Cap**: 200
- **Game Over Condition**: Energy = 0 AND Budget = 0

---

## 🎨 Visual Design

Inspired by 80s/90s cyberpunk aesthetics with:
- Neon pink (#c42b9a) and cyan (#14fff7) color scheme
- Scanline effects and grid backgrounds
- Animated glow effects and particle systems
- Monospace typography (Share Tech Mono, Orbitron)

---

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated**: November 2025
