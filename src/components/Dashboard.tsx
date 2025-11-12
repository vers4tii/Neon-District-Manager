import React from "react";
import { useCityStore } from "../store/cityStore";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { population, energy, budget } = useCityStore();

  const data = {
    labels: ["Now"],
    datasets: [
      {
        label: "Population",
        data: [population],
        borderColor: "#14fff7",
        backgroundColor: "rgba(20, 255, 247, 0.2)",
      },
      {
        label: "Energy",
        data: [energy],
        borderColor: "#c42b9a",
        backgroundColor: "rgba(196, 43, 154, 0.2)",
      },
      {
        label: "Budget",
        data: [budget],
        borderColor: "#ff2e63",
        backgroundColor: "rgba(255, 46, 99, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-building p-4 rounded-lg mb-4">
      <h2 className="text-neon mb-2">City Stats</h2>
      <Line data={data} />
      <div className="flex justify-between mt-4 text-energy">
        <span>Population: {population}</span>
        <span>Energy: {energy}</span>
        <span>Budget: {budget}</span>
      </div>
    </div>
  );
}
