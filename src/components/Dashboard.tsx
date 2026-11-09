import { useEffect, useRef, type ReactNode } from "react";
import {
  BLACKOUT_LIMIT,
  DEBT_LIMIT,
  POLLUTION_SAFE_LEVEL,
  getEfficiencyMultiplier,
  getTurnPreview,
  useCityStore,
} from "../store/cityStore";
import { HoverCard, TipLines, type TipLine } from "./HoverCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  TrendingUp,
  Zap,
  DollarSign,
  Smile,
  Factory,
  HeartPulse,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function StatCard({
  icon,
  label,
  value,
  colorClass,
  lines,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  colorClass: string;
  lines: TipLine[];
}) {
  return (
    <HoverCard
      content={<TipLines lines={lines} />}
      className="h-full"
      focusable
      label={label}
    >
      <div className="stat-card h-full cursor-help">
        <div className={`flex items-center gap-2 mb-2 ${colorClass}`}>
          {icon}
          <span className="text-xs sm:text-sm font-bold">{label}</span>
        </div>
        <div className={`text-2xl sm:text-3xl font-bold ${colorClass}`}>
          {value}
        </div>
      </div>
    </HoverCard>
  );
}

export default function Dashboard() {
  const state = useCityStore();
  const {
    population,
    energy,
    budget,
    happiness = 0,
    pollution,
    health,
    history,
    blackoutTurns,
    upgrades,
  } = state;
  const preview = getTurnPreview(state);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // No moving particles for people who asked for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(20, 255, 247, 0.5)";
      ctx.strokeStyle = "rgba(20, 255, 247, 0.2)";

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.globalAlpha = 1 - dist / 100;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const lineStyle = {
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 5,
    tension: 0.3,
  };

  // One point per turn. Each resource has its own scale so none is flattened.
  const data = {
    labels: history.map((h) => `T${h.turn}`),
    datasets: [
      {
        ...lineStyle,
        label: "Population (left)",
        data: history.map((h) => h.population),
        borderColor: "#14fff7",
        backgroundColor: "rgba(20, 255, 247, 0.12)",
        fill: true,
        yAxisID: "y",
      },
      {
        ...lineStyle,
        label: "Budget $ (right)",
        data: history.map((h) => h.budget),
        borderColor: "#ff2e63",
        backgroundColor: "rgba(255, 46, 99, 0.08)",
        yAxisID: "y1",
      },
      {
        ...lineStyle,
        label: "Energy (0-200)",
        data: history.map((h) => h.energy),
        borderColor: "#c42b9a",
        borderDash: [5, 4],
        yAxisID: "y2",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#14fff7",
          font: {
            family: "Share Tech Mono, monospace",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(5, 10, 48, 0.9)",
        borderColor: "#14fff7",
        borderWidth: 1,
        titleColor: "#14fff7",
        bodyColor: "#14fff7",
        titleFont: {
          family: "Share Tech Mono, monospace",
        },
        bodyFont: {
          family: "Share Tech Mono, monospace",
        },
      },
    },
    interaction: { mode: "index" as const, intersect: false },
    animation: false as const,
    scales: {
      y: {
        position: "left" as const,
        grid: {
          color: "rgba(20, 255, 247, 0.1)",
        },
        ticks: {
          color: "#14fff7",
        },
      },
      y1: {
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#ff2e63",
        },
      },
      y2: {
        display: false,
        min: 0,
        max: 200,
      },
      x: {
        grid: {
          color: "rgba(20, 255, 247, 0.1)",
        },
        ticks: {
          color: "#14fff7",
        },
      },
    },
  };

  // Green when fine, orange then red when the value is dangerous
  const levelColor = (value: number, higherIsWorse: boolean) => {
    const danger = higherIsWorse ? value : 100 - value;
    if (danger >= 60) return "text-[#ff2e63]";
    if (danger >= 35) return "text-neon";
    return "text-energy";
  };

  const getHappinessColor = () => {
    if (happiness >= 70) return "text-energy";
    if (happiness >= 40) return "text-neon";
    return "text-[#ff2e63]";
  };

  return (
    <div className="bg-building p-4 rounded-lg mb-4 relative">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10">
        <h2 className="text-neon mb-3 text-xl font-bold">
          CITY STATS TERMINAL
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <StatCard
            icon={<TrendingUp size={24} />}
            label="POPULATION"
            value={population.toLocaleString()}
            colorClass="text-energy"
            lines={[
              { heading: "Capacity" },
              {
                label: "Housing capacity",
                value: preview.population.capacity,
                plain: true,
              },
              { heading: "Next turn" },
              { label: "Growth", value: preview.population.change },
              {
                label: "Population",
                value: preview.population.next,
                plain: true,
              },
              {
                note: "Population moves toward the capacity of your buildings, faster when citizens are happy.",
              },
              ...(health < 30
                ? [
                    {
                      note: "Sickness is shrinking the district! Build hospitals.",
                      warn: true,
                    },
                  ]
                : []),
            ]}
          />

          <StatCard
            icon={<Zap size={24} />}
            label="ENERGY"
            value={energy}
            colorClass="text-neon"
            lines={[
              { heading: "Per turn" },
              { label: "Buildings", value: preview.energy.buildings },
              { label: "District base", value: preview.energy.base },
              { label: "Citizens", value: preview.energy.citizens },
              ...(upgrades.solar
                ? [{ label: "Solar Technology", value: preview.energy.solar }]
                : []),
              { label: "Net", value: preview.energy.total },
              { heading: "Next turn" },
              { label: "Energy (max 200)", value: preview.energy.next, plain: true },
              {
                note: `Energy at 0 for ${BLACKOUT_LIMIT} turns in a row ends the game.`,
              },
              ...(blackoutTurns > 0
                ? [
                    {
                      note: `Blackout ${blackoutTurns}/${BLACKOUT_LIMIT}!`,
                      warn: true,
                    },
                  ]
                : []),
            ]}
          />

          <StatCard
            icon={<DollarSign size={24} />}
            label="BUDGET"
            value={`$${budget.toLocaleString()}`}
            colorClass="text-[#ff2e63]"
            lines={[
              { heading: "Per turn" },
              {
                label: `Buildings (x${getEfficiencyMultiplier(upgrades.efficiency).toFixed(1)})`,
                value: preview.income.buildings,
              },
              { label: "District base", value: preview.income.base },
              ...(upgrades.recycling
                ? [{ label: "Recycling System", value: preview.income.recycling }]
                : []),
              ...(upgrades.tax_reform
                ? [{ label: "Tax Reform", value: preview.income.tax }]
                : []),
              { label: "Net", value: preview.income.total },
              { heading: "Next turn" },
              { label: "Budget", value: preview.budgetNext, plain: true },
              {
                note: `Debt is allowed down to -$${Math.abs(DEBT_LIMIT)}, then it is bankruptcy.`,
              },
              ...(budget < 0
                ? [{ note: "The district is in debt!", warn: true }]
                : []),
            ]}
          />

          <StatCard
            icon={<Smile size={24} />}
            label="HAPPINESS"
            value={`${happiness}%`}
            colorClass={getHappinessColor()}
            lines={[
              { heading: "Per turn" },
              { label: "Positive income", value: preview.happiness.income },
              { label: "Energy balance", value: preview.happiness.energy },
              { label: "Buildings", value: preview.happiness.buildings },
              { label: "Pollution", value: preview.happiness.pollution },
              { label: "Poor health", value: preview.happiness.health },
              ...(upgrades.public_transport
                ? [
                    {
                      label: "Public Transport",
                      value: preview.happiness.transport,
                    },
                  ]
                : []),
              ...(upgrades.tax_reform
                ? [{ label: "Tax Reform", value: preview.happiness.tax }]
                : []),
              { label: "Net", value: preview.happiness.total },
              { heading: "Next turn" },
              { label: "Happiness", value: preview.happiness.next, plain: true },
              { note: "Happiness at 0% triggers a revolt (game over)." },
            ]}
          />

          <StatCard
            icon={<Factory size={24} />}
            label="POLLUTION"
            value={`${pollution}%`}
            colorClass={levelColor(pollution, true)}
            lines={[
              { heading: "Per turn" },
              {
                label: "Buildings",
                value: preview.pollution.buildings,
                invert: true,
              },
              {
                label: "Natural cleanup",
                value: preview.pollution.natural,
                invert: true,
              },
              ...(upgrades.recycling
                ? [
                    {
                      label: "Recycling System",
                      value: preview.pollution.recycling,
                      invert: true,
                    },
                  ]
                : []),
              { label: "Net", value: preview.pollution.total, invert: true },
              { heading: "Next turn" },
              { label: "Pollution", value: preview.pollution.next, plain: true },
              {
                note: `Above ${POLLUTION_SAFE_LEVEL}% it damages health and happiness. Parks and Recycling Centers clean it.`,
              },
            ]}
          />

          <StatCard
            icon={<HeartPulse size={24} />}
            label="HEALTH"
            value={`${health}%`}
            colorClass={levelColor(health, false)}
            lines={[
              { heading: "Per turn" },
              { label: "Hospitals", value: preview.health.care },
              { label: "Pollution damage", value: preview.health.penalty },
              { label: "Natural recovery", value: preview.health.recovery },
              { label: "Net", value: preview.health.total },
              { heading: "Next turn" },
              { label: "Health", value: preview.health.next, plain: true },
              {
                note: "Below 40%: -2 happiness per turn. Below 30%: population shrinks. At 0%: epidemic (game over).",
              },
            ]}
          />
        </div>

        <div className="chart-container" style={{ height: "190px" }}>
          <Line
            data={data}
            options={options}
            role="img"
            aria-label={`Line chart of population, budget and energy for each turn. Latest, turn ${history[history.length - 1].turn}: population ${history[history.length - 1].population}, budget ${history[history.length - 1].budget}, energy ${history[history.length - 1].energy}.`}
          />
        </div>
      </div>
    </div>
  );
}
