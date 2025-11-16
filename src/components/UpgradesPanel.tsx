import { useCityStore } from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import { TrendingUp, Zap, Recycle, Bot, Leaf, Heart, GraduationCap, Bus, Grid3x3, DollarSign } from "lucide-react";

export default function UpgradesPanel() {
  const { upgrades, budget, buyUpgrade } = useCityStore();
  const { playSuccess, playError } = useSoundEffects();
  type UpgradeItem = {
    id: string;
    name: string;
    cost: number;
    owned: boolean;
    repeatable?: boolean;
    level?: number;
    description: string;
  };
  const upgradesArray: UpgradeItem[] = Array.isArray(upgrades)
    ? (upgrades as UpgradeItem[])
    : (Object.values(upgrades) as unknown as UpgradeItem[]);

  const handleBuyUpgrade = (upgradeId: string, cost: number, owned: boolean, repeatable?: boolean) => {
    if (owned && !repeatable) {
      playError();
      return;
    }
    
    if (budget >= cost) {
      playSuccess();
      buyUpgrade(upgradeId);
    } else {
      playError();
    }
  };

  const getIcon = (id: string) => {
    const icons: Record<string, any> = {
      efficiency: <TrendingUp size={24} />,
      solar: <Zap size={24} />,
      recycling: <Recycle size={24} />,
      automation: <Bot size={24} />,
      green_tech: <Leaf size={24} />,
      healthcare: <Heart size={24} />,
      education: <GraduationCap size={24} />,
      public_transport: <Bus size={24} />,
      smart_grid: <Grid3x3 size={24} />,
      tax_reform: <DollarSign size={24} />
    };
    return icons[id] || <TrendingUp size={24} />;
  };

  return (
    <div className="bg-building p-6 rounded-lg mb-6">
      <h2 className="text-neon text-xl font-bold mb-4">RESEARCH UPGRADES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {upgradesArray.map((upgrade: {
          id: string;
          name: string;
          cost: number;
          owned: boolean;
          repeatable?: boolean;
          level?: number;
          description: string;
        }) => {
          const canAfford = budget >= upgrade.cost;
          const isOwned = upgrade.owned;
          const isRepeatable = upgrade.repeatable;
          
          return (
            <div 
              key={upgrade.id} 
              className={`stat-card p-4 ${!canAfford ? "opacity-60" : ""} ${isOwned && !isRepeatable ? "border-energy" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`${isOwned ? "text-energy" : "text-energy opacity-50"}`}>
                    {getIcon(upgrade.id)}
                  </div>
                  <div>
                    <h3 className="text-energy font-bold text-sm">{upgrade.name}</h3>
                    <p className="text-xs text-energy opacity-70">
                      {isRepeatable 
                        ? `Level ${upgrade.level || 0}` 
                        : isOwned ? "✓ Owned" : "Not owned"
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyUpgrade(upgrade.id, upgrade.cost, isOwned, isRepeatable)}
                  disabled={!canAfford || (isOwned && !isRepeatable)}
                  className="btn-neon text-xs px-3 py-1 disabled:opacity-30"
                  title={isOwned && !isRepeatable ? "Already owned" : `Purchase for $${upgrade.cost}`}
                >
                  ${upgrade.cost}
                </button>
              </div>
              
              <p className="text-xs text-energy opacity-80 mb-2">{upgrade.description}</p>
              
              {isRepeatable && (
                <div className="text-xs text-neon">
                  ⭐ Repeatable upgrade
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}