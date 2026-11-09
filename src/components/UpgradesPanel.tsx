import { useState, type ReactNode } from "react";
import { getUpgradeCost, upgradeCatalog, useCityStore } from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import {
  TrendingUp,
  Zap,
  Recycle,
  Bot,
  Leaf,
  Heart,
  GraduationCap,
  Bus,
  Grid3x3,
  DollarSign,
} from "lucide-react";

export default function UpgradesPanel() {
  const { upgrades, budget, actionsLeft, buyUpgrade } = useCityStore();
  const { playSuccess, playError } = useSoundEffects();
  const [filter, setFilter] = useState<"all" | "owned" | "affordable">("all");

  const upgradeCostFor = (upgradeId: string) =>
    getUpgradeCost(upgradeId, upgrades.efficiency);

  const handleBuyUpgrade = (
    upgradeId: string,
    cost: number,
    owned: boolean,
    repeatable?: boolean,
  ) => {
    if (owned && !repeatable) {
      playError();
      return;
    }

    if (actionsLeft > 0 && budget >= cost) {
      playSuccess();
      buyUpgrade(upgradeId);
    } else {
      playError();
    }
  };

  const getIcon = (id: string) => {
    const icons: Record<string, ReactNode> = {
      efficiency: <TrendingUp size={24} />,
      solar: <Zap size={24} />,
      recycling: <Recycle size={24} />,
      automation: <Bot size={24} />,
      green_tech: <Leaf size={24} />,
      healthcare: <Heart size={24} />,
      education: <GraduationCap size={24} />,
      public_transport: <Bus size={24} />,
      smart_grid: <Grid3x3 size={24} />,
      tax_reform: <DollarSign size={24} />,
    };
    return icons[id] || <TrendingUp size={24} />;
  };

  const filteredUpgrades = upgradeCatalog.filter((upgrade) => {
    const currentLevel =
      upgrade.id === "efficiency"
        ? upgrades.efficiency
        : Number(Boolean((upgrades as Record<string, unknown>)[upgrade.id]));
    const isOwned = upgrade.repeatable
      ? currentLevel > 0
      : Boolean((upgrades as Record<string, unknown>)[upgrade.id]);
    const isMaxed = !upgrade.repeatable && isOwned;
    const upgradeCost = upgradeCostFor(upgrade.id);

    if (filter === "owned") return isOwned;
    if (filter === "affordable") return !isMaxed && budget >= upgradeCost;
    return true;
  });

  return (
    <div className="bg-building p-4 rounded-lg mb-4 flex flex-col max-h-[42vh] overflow-hidden">
      <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
        <h2 className="text-neon text-xl font-bold">RESEARCH UPGRADES</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded text-xs ${filter === "all" ? "bg-neon text-bg" : "text-energy border border-energy"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("owned")}
            className={`px-2.5 py-1 rounded text-xs ${filter === "owned" ? "bg-neon text-bg" : "text-energy border border-energy"}`}
          >
            Owned
          </button>
          <button
            onClick={() => setFilter("affordable")}
            className={`px-2.5 py-1 rounded text-xs ${filter === "affordable" ? "bg-neon text-bg" : "text-energy border border-energy"}`}
          >
            Affordable
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 overflow-y-auto pr-1 min-h-0 content-start auto-rows-max">
        {filteredUpgrades.map((upgrade) => {
          const currentLevel =
            upgrade.id === "efficiency"
              ? upgrades.efficiency
              : Number(
                  Boolean((upgrades as Record<string, unknown>)[upgrade.id]),
                );
          const isOwned = upgrade.repeatable
            ? currentLevel > 0
            : Boolean((upgrades as Record<string, unknown>)[upgrade.id]);
          const upgradeCost = upgradeCostFor(upgrade.id);
          const isMaxed = isOwned && !upgrade.repeatable;
          const canAfford =
            !isMaxed && actionsLeft > 0 && budget >= upgradeCost;
          const affordabilityClass = isMaxed
            ? ""
            : canAfford
              ? "afford-available"
              : "afford-unavailable";

          return (
            <div
              key={upgrade.id}
              className={`stat-card p-3 ${affordabilityClass} ${isOwned && !upgrade.repeatable ? "border-energy" : ""}`}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`${isOwned ? "text-energy" : "text-energy opacity-50"}`}
                  >
                    {getIcon(upgrade.id)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-energy font-bold text-sm leading-tight">
                      {upgrade.name}
                    </h3>
                    <p className="text-[11px] text-energy opacity-70">
                      {upgrade.repeatable
                        ? `Level ${currentLevel}`
                        : isOwned
                          ? "✓ Owned"
                          : "Not owned"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleBuyUpgrade(
                      upgrade.id,
                      upgradeCost,
                      isOwned,
                      upgrade.repeatable,
                    )
                  }
                  disabled={!canAfford}
                  className={`btn-neon text-[10px] px-2.5 py-1 disabled:cursor-not-allowed ${isMaxed ? "opacity-60" : canAfford ? "afford-available" : "afford-unavailable disabled:opacity-100"}`}
                  title={
                    isOwned && !upgrade.repeatable
                      ? "Already owned"
                      : `Purchase for $${upgradeCost}`
                  }
                >
                  {isMaxed ? "OWNED" : `$${upgradeCost}`}
                </button>
              </div>

              <p className="text-[11px] text-energy opacity-80 mb-2 leading-snug">
                {upgrade.description}
              </p>

              {upgrade.repeatable && (
                <div className="text-[10px] text-neon">⭐ Repeatable</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
