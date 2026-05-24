import React from 'react';
import {
  FunnelChart, Funnel, LabelList, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';

import { PyramidData } from '../../data/dummy';
import { ChartsHeader } from '../../components';

const COLORS = ['#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#a855f7'];

// Sort descending so widest segment (largest value) renders at top (funnel orientation)
const funnelData = [...PyramidData]
  .sort((a, b) => b.y - a.y)
  .map((d, i) => ({ name: d.x, value: d.y, label: d.text, fill: COLORS[i % COLORS.length] }));

const Pyramid = () => (
  <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
    <ChartsHeader category="Pyramid" title="Food Comparison Chart" />
    <div className="w-full bg-white dark:bg-secondary-dark-bg rounded-xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height={420}>
        <FunnelChart>
          <Tooltip formatter={(v, n, props) => [props.payload.label || `${v} cal`, props.payload.name]} />
          <Funnel dataKey="value" data={funnelData} isAnimationActive>
            {funnelData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
            <LabelList position="right" fill="currentColor" stroke="none" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Pyramid;
