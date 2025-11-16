import { useState } from "react";
import { useCityStore } from "../store/cityStore";
import { useSoundEffects } from "../hooks/useAmbients";
import { Building, Factory, Zap, FlaskConical, TreePine, Hospital, Shield, ShoppingCart, Wind, GraduationCap, Trash2 } from "lucide-react";

export default function BuildingsPanel() {
  const { buildings, budget, energy, buyBuilding, demolishBuilding } = useCityStore();
  const { playSuccess, playError } = useSoundEffects();
  const [filter, setFilter] = useState<"all" | "owned" | "affordable">("all");

  const handleBuyBuilding = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    if (budget >= building.cost && energy >= building.energyCost) {
      playSuccess();
      buyBuilding(buildingId);
    } else {
      playError();
    }
  };

  const handleDemolish = (buildingId: string) => {
    playError();
    demolishBuilding(buildingId);
  };

  const getIcon = (id: string) => {
    const icons: Record<string, any> = {
      housing: <Building size={24} />,
      solar: <Zap size={24} />,
      factory: <Factory size={24} />,
      lab: <FlaskConical size={24} />,
      park: <TreePine size={24} />,
      hospital: <Hospital size={24} />,
      police: <Shield size={24} />,
      mall: <ShoppingCart size={24} />,
      wind: <Wind size={24} />,
      university: <GraduationCap size={24} />
    };
    return icons[id] || <Building size={24} />;
  };

  const filteredBuildings = buildings.filter(building => {
    if (filter === "owned") return building.owned > 0;
    if (filter === "affordable") return budget >= building.cost && energy >= building.energyCost;
    return true;
  });

  return (
    <div className="bg-building p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-neon text-xl font-bold">CONSTRUCT BUILDINGS</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded text-sm ${filter === "all" ? "bg-neon text-bg" : "text-energy border border-energy"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("owned")}
            className={`px-3 py-1 rounded text-sm ${filter === "owned" ? "bg-neon text-bg" : "text-energy border border-energy"}`}
          >
            Owned
          </button>
          <button
            onClick={() => setFilter("affordable")}
            className={`px-3 py-1 rounded text-sm ${filter === "affordable" ? "bg-neon text-bg" : "text-energy border border-energy"}`}
          >
            Affordable
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBuildings.map(building => {
          const canAfford = budget >= building.cost && energy >= building.energyCost;
          const atMax = !!(building.maxOwned && building.owned >= building.maxOwned);
          
          return (
            <div key={building.id} className={`stat-card p-4 ${!canAfford ? "opacity-60" : ""} ${atMax ? "border-[#ff2e63]" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-energy">{getIcon(building.id)}</div>
                  <div>
                    <h3 className="text-energy font-bold text-sm">{building.name}</h3>
                    <p className="text-xs text-energy opacity-70">
                      {building.owned > 0 ? `x${building.owned}` : "Not built"}
                      {building.maxOwned && ` / ${building.maxOwned}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleBuyBuilding(building.id)}
                    disabled={!canAfford || atMax}
                    className="btn-neon text-xs px-2 py-1 disabled:opacity-30"
                    title={atMax ? "Maximum reached" : `Build ${building.name}`}
                  >
                    BUILD
                  </button>
                  {building.owned > 0 && (
                    <button
                      onClick={() => handleDemolish(building.id)}
                      className="text-[#ff2e63] hover:text-white transition-colors p-1"
                      title={`Demolish for ${Math.floor(building.cost * 0.5)} refund`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-energy opacity-80 mb-2">{building.description}</p>
              
              <div className="grid grid-cols-2 gap-1 text-xs text-energy">
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span className={building.cost > budget ? "text-[#ff2e63]" : ""}>${building.cost}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⚡</span>
                  <span className={building.energyCost > energy ? "text-[#ff2e63]" : ""}>{building.energyCost}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span>+{building.populationBonus}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>😊</span>
                  <span className={building.happinessBonus > 0 ? "text-energy" : "text-[#ff2e63]"}>
                    {building.happinessBonus > 0 ? "+" : ""}{building.happinessBonus}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-energy/20 text-xs text-energy">
                <div className="flex justify-between">
                  <span>Income/turn:</span>
                  <span className={building.incomePerTurn >= 0 ? "text-energy" : "text-[#ff2e63]"}>
                    ${building.incomePerTurn > 0 ? "+" : ""}{building.incomePerTurn}
                  </span>
                </div>
                {building.energyPerTurn !== 0 && (
                  <div className="flex justify-between">
                    <span>Energy/turn:</span>
                    <span className={building.energyPerTurn > 0 ? "text-energy" : "text-[#ff2e63]"}>
                      {building.energyPerTurn > 0 ? "+" : ""}{building.energyPerTurn}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}