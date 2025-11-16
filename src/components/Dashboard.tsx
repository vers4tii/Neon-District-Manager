import { useEffect, useRef } from "react";
import { useCityStore } from "../store/cityStore";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { TrendingUp, Zap, DollarSign, Smile } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { population, energy, budget, happiness = 0 } = useCityStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    let animationId: number;
    
    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(20, 255, 247, 0.5)';
      ctx.strokeStyle = 'rgba(20, 255, 247, 0.2)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
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

  const data = {
    labels: ["Now"],
    datasets: [
      {
        label: "Population",
        data: [population],
        borderColor: "#14fff7",
        backgroundColor: "rgba(20, 255, 247, 0.3)",
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
      {
        label: "Energy",
        data: [energy],
        borderColor: "#c42b9a",
        backgroundColor: "rgba(196, 43, 154, 0.3)",
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
      {
        label: "Budget",
        data: [budget],
        borderColor: "#ff2e63",
        backgroundColor: "rgba(255, 46, 99, 0.3)",
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#14fff7',
          font: {
            family: 'Share Tech Mono, monospace',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(5, 10, 48, 0.9)',
        borderColor: '#14fff7',
        borderWidth: 1,
        titleColor: '#14fff7',
        bodyColor: '#14fff7',
        titleFont: {
          family: 'Share Tech Mono, monospace'
        },
        bodyFont: {
          family: 'Share Tech Mono, monospace'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(20, 255, 247, 0.1)'
        },
        ticks: {
          color: '#14fff7'
        }
      },
      x: {
        grid: {
          color: 'rgba(20, 255, 247, 0.1)'
        },
        ticks: {
          color: '#14fff7'
        }
      }
    }
  };

  const getHappinessColor = () => {
    if (happiness >= 70) return "text-energy";
    if (happiness >= 40) return "text-neon";
    return "text-[#ff2e63]";
  };

  return (
    <div className="bg-building p-6 rounded-lg mb-6 relative">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"
        style={{ zIndex: 0 }}
      />
      
      <div className="relative z-10">
        <h2 className="text-neon mb-4 text-2xl font-bold">CITY STATS TERMINAL</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-energy" size={24} />
              <span className="text-energy text-sm font-bold">POPULATION</span>
            </div>
            <div className="text-3xl font-bold text-energy">{population.toLocaleString()}</div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-neon" size={24} />
              <span className="text-neon text-sm font-bold">ENERGY</span>
            </div>
            <div className="text-3xl font-bold text-neon">{energy}</div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-[#ff2e63]" size={24} />
              <span className="text-[#ff2e63] text-sm font-bold">BUDGET</span>
            </div>
            <div className="text-3xl font-bold text-[#ff2e63]">${budget.toLocaleString()}</div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Smile className={getHappinessColor()} size={24} />
              <span className={`${getHappinessColor()} text-sm font-bold`}>HAPPINESS</span>
            </div>
            <div className={`text-3xl font-bold ${getHappinessColor()}`}>{happiness}%</div>
          </div>
        </div>

        <div className="chart-container" style={{ height: '200px' }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}