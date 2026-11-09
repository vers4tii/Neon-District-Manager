import { useState, type ReactNode } from "react";
import {
  UPGRADE_CATEGORIES,
  getEfficiencyMultiplier,
  getMissingRequirement,
  getUpgradeCost,
  getUpgradeLevel,
  isUpgradeMaxed,
  upgradeCatalog,
  useCityStore,
  type UpgradeDefinition,
} from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import { HoverCard, TipLines, type TipLine } from "./HoverCard";
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
  Lock,
} from "lucide-react";

export default function UpgradesPanel() {
  const { upgrades, budget, actionsLeft, buyUpgrade } = useCityStore();
  const { playSuccess, playError } = useSoundEffects();
  const [filter, setFilter] = useState<"all" | "owned" | "affordable">("all");

  const costOf = (upgrade: UpgradeDefinition) =>
    getUpgradeCost(upgrade.id, upgrades.efficiency);

  // Everything the player needs to know about one upgrade right now
  const statusOf = (upgrade: UpgradeDefinition) => {
    const level = getUpgradeLevel(upgrades, upgrade.id);
    const maxed = isUpgradeMaxed(upgrades, upgrade);
    const missing = getMissingRequirement(upgrades, upgrade);
    const cost = costOf(upgrade);
    const canBuy =
      !maxed && !missing && actionsLeft > 0 && budget >= cost;
    return { level, maxed, missing, cost, canBuy };
  };

  const handleBuyUpgrade = (upgrade: UpgradeDefinition) => {
    if (statusOf(upgrade).canBuy) {
      playSuccess();
      buyUpgrade(upgrade.id);
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

  const getTooltipLines = (upgrade: UpgradeDefinition): TipLine[] => {
    const { level, maxed, missing, cost } = statusOf(upgrade);
    const category = UPGRADE_CATEGORIES.find((c) => c.id === upgrade.category);
    const maxLevel = upgrade.maxLevel ?? 1;

    const lines: TipLine[] = [
      {
        title: upgrade.name,
        subtitle: `${category?.label ?? ""}${maxLevel > 1 ? ` · Level ${level}/${maxLevel}` : ""}`,
      },
      { note: upgrade.description, plain: true },
      { heading: "Effects" },
      ...upgrade.effects.map((effect) => ({
        note: `• ${effect}`,
        plain: true,
      })),
    ];

    if (upgrade.id === "efficiency") {
      lines.push(
        { heading: "Income multiplier" },
        {
          label: "Now",
          value: `x${getEfficiencyMultiplier(level).toFixed(1)}`,
        },
        ...(maxed
          ? []
          : [
              {
                label: "Next level",
                value: `x${getEfficiencyMultiplier(level + 1).toFixed(1)}`,
              },
            ]),
      );
    }

    lines.push({ heading: "Purchase" });
    lines.push({
      label: "Cost",
      value: maxed ? "Owned" : `$${cost}`,
    });
    if (upgrade.requires) {
      const required = upgradeCatalog.find((u) => u.id === upgrade.requires);
      lines.push({
        label: "Requires",
        value: `${required?.name ?? upgrade.requires} ${missing ? "✗" : "✓"}`,
      });
    }

    const unlocks = upgradeCatalog.filter((u) => u.requires === upgrade.id);
    if (unlocks.length > 0) {
      lines.push({
        note: `Unlocks: ${unlocks.map((u) => u.name).join(", ")}`,
      });
    }

    lines.push({ note: "Buying an upgrade uses 1 action." });

    if (maxed) lines.push({ note: "Fully upgraded.", plain: true });
    else if (missing)
      lines.push({ note: `Buy ${missing.name} first.`, warn: true });
    else if (actionsLeft <= 0)
      lines.push({ note: "No actions left this turn.", warn: true });
    else if (budget < cost)
      lines.push({ note: "Not enough money.", warn: true });

    return lines;
  };

  const matchesFilter = (upgrade: UpgradeDefinition) => {
    const { level, maxed, canBuy } = statusOf(upgrade);
    if (filter === "owned") return level > 0;
    if (filter === "affordable") return !maxed && canBuy;
    return true;
  };

  const filterButton = (
    value: "all" | "owned" | "affordable",
    label: string,
  ) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-2.5 py-1.5 sm:py-1 rounded text-xs ${filter === value ? "bg-neon text-bg" : "text-energy border border-energy"}`}
    >
      {label}
    </button>
  );

  const sections = UPGRADE_CATEGORIES.map((category) => ({
    category,
    items: upgradeCatalog.filter(
      (upgrade) => upgrade.category === category.id && matchesFilter(upgrade),
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="bg-building p-3 sm:p-4 rounded-lg mb-4 flex flex-col max-h-[65vh] xl:max-h-[42vh] overflow-hidden">
      <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
        <h2 className="text-neon text-lg sm:text-xl font-bold">
          RESEARCH UPGRADES
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

      <div className="overflow-y-auto pr-1 min-h-0 flex flex-col gap-4">
        {sections.length === 0 && (
          <p className="text-xs text-energy opacity-60">
            No upgrade matches this filter.
          </p>
        )}

        {sections.map(({ category, items }) => (
          <section key={category.id}>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neon mb-2">
              {category.label}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-2.5 content-start auto-rows-max">
              {items.map((upgrade) => {
                const { level, maxed, missing, cost, canBuy } =
                  statusOf(upgrade);
                const maxLevel = upgrade.maxLevel ?? 1;
                const stateClass = maxed
                  ? "border-energy"
                  : missing
                    ? "opacity-60"
                    : canBuy
                      ? "afford-available"
                      : "afford-unavailable";

                return (
                  <HoverCard
                    key={upgrade.id}
                    content={<TipLines lines={getTooltipLines(upgrade)} />}
                  >
                    <div className={`stat-card p-3 cursor-help ${stateClass}`}>
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`shrink-0 text-energy ${level > 0 ? "" : "opacity-50"}`}
                          >
                            {getIcon(upgrade.id)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-energy font-bold text-sm leading-tight">
                              {upgrade.name}
                            </h4>
                            <p className="text-[11px] text-energy opacity-70">
                              {maxLevel > 1
                                ? `Level ${level} / ${maxLevel}`
                                : maxed
                                  ? "✓ Owned"
                                  : "Not owned"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBuyUpgrade(upgrade)}
                          disabled={!canBuy}
                          className={`btn-neon flex items-center gap-1 text-[11px] px-3 py-2 sm:px-2.5 sm:py-1 shrink-0 disabled:cursor-not-allowed ${
                            maxed || missing
                              ? "opacity-60"
                              : canBuy
                                ? "afford-available"
                                : "afford-unavailable disabled:opacity-100"
                          }`}
                        >
                          {missing && <Lock size={12} />}
                          {maxed ? "OWNED" : missing ? "LOCKED" : `$${cost}`}
                        </button>
                      </div>

                      <p className="text-[11px] text-energy opacity-80 mb-1.5 leading-snug">
                        {upgrade.description}
                      </p>

                      <ul className="text-[11px] text-neon leading-snug space-y-0.5">
                        {upgrade.effects.map((effect) => (
                          <li key={effect}>• {effect}</li>
                        ))}
                      </ul>

                      {missing && (
                        <p className="mt-1.5 text-[11px] text-[#ff2e63]">
                          🔒 Requires {missing.name}
                        </p>
                      )}
                    </div>
                  </HoverCard>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
