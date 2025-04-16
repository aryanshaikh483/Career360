import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  scores: Record<string, number>;
}

export const PieChart: React.FC<PieChartProps> = ({ scores }) => {
  const data = {
    labels: Object.keys(scores),
    datasets: [
      {
        data: Object.values(scores),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#E7E9ED',
          '#8D5A97',
          '#F7464A',
          '#46BFBD'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#E7E9ED',
          '#8D5A97',
          '#F7464A',
          '#46BFBD'
        ],
      },
    ],
  };

  return <Pie data={data} />;
};
