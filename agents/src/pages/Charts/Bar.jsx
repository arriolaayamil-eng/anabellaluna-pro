import React from 'react';

import { barCustomSeries } from '../../data/dummy';
import { ChartsHeader } from '../../components';
import { AppBarChart } from '../../components/ui/Chart';

// Transform Syncfusion per-series format → Recharts unified row format
const countries = barCustomSeries[0].dataSource.map((d) => d.x);
const barData = countries.map((country) => {
  const row = { name: country };
  barCustomSeries.forEach((series) => {
    row[series.name] = series.dataSource.find((d) => d.x === country)?.y ?? 0;
  });
  return row;
});
const bars = barCustomSeries.map((s) => ({ dataKey: s.name }));

const Bar = () => (
  <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
    <ChartsHeader category="Bar" title="Olympic Medal Counts - RIO" />
    <div className="w-full bg-white dark:bg-secondary-dark-bg rounded-xl p-4 shadow-sm">
      <AppBarChart data={barData} bars={bars} xKey="name" height={400} />
    </div>
  </div>
);

export default Bar;
