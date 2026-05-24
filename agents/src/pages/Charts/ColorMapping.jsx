import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer,
} from 'recharts';

import { colorMappingData, rangeColorMapping } from '../../data/dummy';
import { ChartsHeader } from '../../components';

const chartData = colorMappingData[0].map((d) => ({ name: d.x, temperature: d.y }));

const getBarColor = (value) => {
  const match = rangeColorMapping.find(
    (r) => value >= Number(r.start) && value <= Number(r.end),
  );
  return match ? match.colors[0] : '#8884d8';
};

const ColorMapping = () => (
  <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
    <ChartsHeader category="Color Mapping" title="USA CLIMATE - WEATHER BY MONTH" />
    <div className="w-full bg-white dark:bg-secondary-dark-bg rounded-xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 30]} tickFormatter={(v) => `${v}°C`} />
          <Tooltip formatter={(v) => [`${v}°C`, 'Temperature']} />
          <Bar dataKey="temperature" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={getBarColor(entry.temperature)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-3 text-sm">
        {rangeColorMapping.map((r) => (
          <span key={r.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: r.colors[0] }}
            />
            {r.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default ColorMapping;
