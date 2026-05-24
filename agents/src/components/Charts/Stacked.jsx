import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

import { stackedChartData } from '../../data/dummy';

const chartData = stackedChartData[0].map((item, i) => ({
  month: item.x,
  Budget: item.y,
  Expense: stackedChartData[1][i].y,
}));

const Stacked = ({ width, height }) => (
  <div style={{ width: width || '100%', height: height || 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" />
        <YAxis domain={[100, 400]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Budget" stackId="stack" fill="#3b82f6" />
        <Bar dataKey="Expense" stackId="stack" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default Stacked;
