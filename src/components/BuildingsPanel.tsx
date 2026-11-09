import { useState, type ReactNode } from "react";
import {
  getEffectiveBuildingStats,
  useCityStore,
  type Building as BuildingData,
} from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import { HoverCard, TipLines, type TipLine } from "./HoverCard";
import {
  Building,
  Factory,
  Zap,
  FlaskConical,
  TreePine,
  Hospital,
  Shield,
  ShoppingCart,
  Wind,
  GraduationCap,
  Trash2,
  Recycle,
} from "lucide-react";

export default function BuildingsPanel() {
  const {
    buildings,
    budget,
    energy,
    actionsLeft,
    upgrades,
    buyBuilding,
    demolishBuilding,
  } = useCityStore();
  const { playSuccess, playError } = useSoundEffects();
  const [filter, setFilter] = useState<"all" | "owned" | "affordable">("all");

  const isAtMax = (building: BuildingData) =>
    !!(building.maxOwned && building.owned >= building.maxOwned);

  const handleBuyBuilding = (buildingId: string) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return;

    if (
      actionsLeft > 0 &&
      !isAtMax(building) &&
      budget >= building.cost &&
      energy >= building.energyCost
    ) {
      playSuccess();
      buyBuilding(buildingId);
    } else {
      playError();
    }
  };

  const handleDemolish = (buildingId: string) => {
    if (actionsLeft <= 0) {
      playError();
      return;
    }
    playError();
    demolishBuilding(buildingId);
  };

  const getIcon = (id: string) => {
    const icons: Record<string, ReactNode> = {
      housing: <Building size={24} />,
      solar: <Zap size={24} />,
      factory: <Factory size={24} />,
      lab: <FlaskConical size={24} />,
      park: <TreePine size={24} />,
      hospital: <Hospital size={24} />,
      recycling_center: <Recycle size={24} />,
      police: <Shield size={24} />,
      mall: <ShoppingCart size={24} />,
      wind: <Wind size={24} />,
      university: <GraduationCap size={24} />,
    };
    return icons[id] || <Building size={24} />;
  };

  const getTooltipLines = (building: BuildingData): TipLine[] => {
    const effective = getEffectiveBuildingStats(building, upgrades);
    const atMax = isAtMax(building);
    const lines: TipLine[] = [
      {
        title: building.name,
        subtitle: `Built: ${building.owned}${building.maxOwned ? ` / ${building.maxOwned}` : ""}`,
      },
    ];

    if (building.description) lines.push({ note: building.description });

    lines.push(
      { heading: "Build cost" },
      { label: "Money", value: `$${building.cost}` },
      { label: "Energy", value: `${building.energyCost}` },
      { heading: "Each building, per turn" },
      { label: "Income", value: building.incomePerTurn },
      { label: "Energy", value: building.energyPerTurn },
      { label: "Happiness", value: building.happinessBonus },
      { label: "Pollution", value: effective.pollution, invert: true },
      { label: "Health", value: effective.health },
      { label: "Housing capacity", value: building.populationBonus },
    );

    if (building.owned > 0) {
      lines.push(
        { heading: `Your ${building.owned} built` },
        { label: "Income", value: building.incomePerTurn * building.owned },
        { label: "Energy", value: building.energyPerTurn * building.owned },
        {
          label: "Pollution",
          value: effective.pollution * building.owned,
          invert: true,
        },
        { label: "Health", value: effective.health * building.owned },
      );
    }

    if (upgrades.green_tech && building.pollutionPerTurn > 0) {
      lines.push({ note: "Green Tech already reduces its pollution." });
    }
    if (upgrades.healthcare && building.healthPerTurn > 0) {
      lines.push({ note: "Healthcare Program already boosts its healing." });
    }

    lines.push({
      note: `Demolishing refunds $${Math.floor(building.cost * 0.5)}. Building and demolishing use 1 action.`,
    });

    if (atMax) lines.push({ note: "Maximum reached.", warn: true });
    else if (actionsLeft <= 0)
      lines.push({ note: "No actions left this turn.", warn: true });
    else if (budget < building.cost)
      lines.push({ note: "Not enough money.", warn: true });
    else if (energy < building.energyCost)
      lines.push({ note: "Not enough energy.", warn: true });

    return lines;
  };

  const filteredBuildings = buildings.filter((building) => {
    const atMax = isAtMax(building);

    if (filter === "owned") return building.owned > 0;
    if (filter === "affordable") {
      return !atMax && budget >= building.cost && energy >= building.energyCost;
    }
    return true;
  });

  const filterButton = (
    value: "all" | "owned" | "affordable",
    label: string,
  ) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-3 py-1.5 sm:py-1 rounded text-xs sm:text-sm ${filter === value ? "bg-neon text-bg" : "text-energy border border-energy"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-building p-3 sm:p-4 rounded-lg mb-4 flex flex-col max-h-[65vh] xl:max-h-[42vh] overflow-hidden">
      <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
        <h2 className="text-neon text-lg sm:text-xl font-bold">
          CONSTRUCT BUILDINGS
        </h2>

        <div className="flex gap-2">
          {filterButton("all", "All")}
          {filterButton("owned", "Owned")}
          {filterButton("affordable", "Affordable")}
        </div>
      </div>

      <p className="sm:hidden text-[11px] text-energy opacity-60 mb-2">
        Tap a card for details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3 overflow-y-auto pr-1 min-h-0 content-start auto-rows-max">
        {filteredBuildings.map((building) => {
          const atMax = isAtMax(building);
          const canAfford =
            actionsLeft > 0 &&
            !atMax &&
            budget >= building.cost &&
            energy >= building.energyCost;
          const affordabilityClass = atMax
            ? ""
            : canAfford
              ? "afford-available"
              : "afford-unavailable";

          return (
            <HoverCard
              key={building.id}
              content={<TipLines lines={getTooltipLines(building)} />}
            >
              <div
                className={`stat-card p-3 sm:p-4 cursor-help ${affordabilityClass} ${atMax ? "border-[#ff2e63]" : ""}`}
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-energy shrink-0">
                      {getIcon(building.id)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-energy font-bold text-sm leading-tight">
                        {building.name}
                      </h3>
                      <p className="text-xs text-energy opacity-70">
                        {building.owned > 0
                          ? `x${building.owned}`
                          : "Not built"}
                        {building.maxOwned && ` / ${building.maxOwned}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleBuyBuilding(building.id)}
                      disabled={!canAfford || atMax}
                      className={`btn-neon text-xs px-3 py-2 sm:px-2 sm:py-1 disabled:cursor-not-allowed ${atMax ? "opacity-60" : canAfford ? "afford-available" : "afford-unavailable disabled:opacity-100"}`}
                    >
                      {atMax ? "MAX" : "BUILD"}
                    </button>
                    {building.owned > 0 && (
                      <button
                        onClick={() => handleDemolish(building.id)}
                        className="text-[#ff2e63] hover:text-white transition-colors p-2 sm:p-1"
                        aria-label={`Demolish ${building.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-xs text-energy">
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span
                      className={building.cost > budget ? "text-[#ff2e63]" : ""}
                    >
                      ${building.cost}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⚡</span>
                    <span
                      className={
                        building.energyCost > energy ? "text-[#ff2e63]" : ""
                      }
                    >
                      {building.energyCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>+{building.populationBonus}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>😊</span>
                    <span
                      className={
                        building.happinessBonus >= 0
                          ? "text-energy"
                          : "text-[#ff2e63]"
                      }
                    >
                      {building.happinessBonus > 0 ? "+" : ""}
                      {building.happinessBonus}
                    </span>
                  </div>
                  {building.pollutionPerTurn !== 0 && (
                    <div className="flex items-center gap-1">
                      <span>☣️</span>
                      <span
                        className={
                          building.pollutionPerTurn > 0
                            ? "text-[#ff2e63]"
                            : "text-energy"
                        }
                      >
                        {building.pollutionPerTurn > 0 ? "+" : ""}
                        {building.pollutionPerTurn}
                      </span>
                    </div>
                  )}
                  {building.healthPerTurn !== 0 && (
                    <div className="flex items-center gap-1">
                      <span>❤️</span>
                      <span className="text-energy">
                        +{building.healthPerTurn}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-energy/20 text-xs text-energy">
                  <div className="flex justify-between">
                    <span>Income/turn:</span>
                    <span
                      className={
                        building.incomePerTurn >= 0
                          ? "text-energy"
                          : "text-[#ff2e63]"
                      }
                    >
                      ${building.incomePerTurn > 0 ? "+" : ""}
                      {building.incomePerTurn}
                    </span>
                  </div>
                  {building.energyPerTurn !== 0 && (
                    <div className="flex justify-between">
                      <span>Energy/turn:</span>
                      <span
                        className={
                          building.energyPerTurn > 0
                            ? "text-energy"
                            : "text-[#ff2e63]"
                        }
                      >
                        {building.energyPerTurn > 0 ? "+" : ""}
                        {building.energyPerTurn}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </HoverCard>
          );
        })}
      </div>
    </div>
  );
}
