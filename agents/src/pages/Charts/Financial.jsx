import React from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

import { financialChartData } from '../../data/dummy';
import { ChartsHeader } from '../../components';

const date2017 = new Date('2017-01-01');

const chartData = financialChartData
  .filter((d) => d.x >= date2017)
  .map((d) => ({
    date: d.x.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    high: +d.high.toFixed(2),
    low: +d.low.toFixed(2),
  }));

const tickInterval = Math.max(1, Math.floor(chartData.length / 8));

const Financial = () => (
  <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
    <ChartsHeader category="Financial" title="AAPL Historical — High / Low" />
    <div className="w-full bg-white dark:bg-secondary-dark-bg rounded-xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" interval={tickInterval} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `$${v}`} width={60} />
          <Tooltip formatter={(v, name) => [`$${v}`, name]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={1.5}
            name="High"
            activeDot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#ef4444"
            dot={false}
            strokeWidth={1.5}
            name="Low"
            activeDot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Financial;
