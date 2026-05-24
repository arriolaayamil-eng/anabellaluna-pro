import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, Tooltip,
} from 'recharts';

const SparkLine = ({ id, height, width, color, data, type, currentColor }) => {
  const h = parseInt(height, 10) || 80;
  const w = parseInt(width, 10) || 200;

  const stroke = currentColor || color || '#8884d8';
  const fill = color || '#8884d8';

  const commonProps = {
    data,
    margin: { top: 2, right: 2, left: 2, bottom: 2 },
  };

  const tipContent = (
    <Tooltip
      contentStyle={{ fontSize: 11, padding: '2px 6px' }}
      formatter={(v, _n, p) => [p.payload.yval, `x: ${p.payload.x}`]}
    />
  );

  let chart;
  if (type === 'Column') {
    chart = (
      <BarChart {...commonProps}>
        {tipContent}
        <Bar dataKey="yval" fill={fill} />
      </BarChart>
    );
  } else if (type === 'Area') {
    chart = (
      <AreaChart {...commonProps}>
        {tipContent}
        <Area
          type="monotone"
          dataKey="yval"
          stroke={stroke}
          fill={fill}
          fillOpacity={0.3}
          dot={false}
          activeDot={{ r: 2 }}
        />
      </AreaChart>
    );
  } else {
    chart = (
      <LineChart {...commonProps}>
        {tipContent}
        <Line
          type="monotone"
          dataKey="yval"
          stroke={stroke}
          strokeWidth={1.5}
          dot={{ r: 2, fill: stroke }}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    );
  }

  return (
    <div id={id} style={{ width: w, height: h }}>
      <ResponsiveContainer width="100%" height="100%">
        {chart}
      </ResponsiveContainer>
    </div>
  );
};

export default SparkLine;
