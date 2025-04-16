import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  plugins,
  scales,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StackedBarChartProps {
  scores: Record<string, number>;
  diffScores: Record<string, number>;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ scores, diffScores }) => {
  const data = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: "Achieved Score",
        data: Object.values(scores),
        backgroundColor: ["#FF6384"],
        hoverBackgroundColor: ["#FF6384"],
      },
      {
        label: "Score Margin",
        data: Object.values(diffScores),
        backgroundColor: ["#a5c3e6"],
        hoverBackgroundColor: ["#a5c3e6"],
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Career Assessment",
      },
    },
  };

  return <Bar data={data} options={options} />;
};
