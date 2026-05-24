import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981'];

const Doughnut = ({ id, data, legendVisiblity, height }) => {
  const h = parseInt(height, 10) || 200;
  const pieData = data.map((d) => ({ name: d.x, value: d.y, label: d.text }));

  return (
    <div id={id} style={{ height: h }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n, p) => [p.payload.label || v, n]} />
          {legendVisiblity && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Doughnut;
