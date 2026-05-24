import React from 'react';

import { areaCustomSeries } from '../../data/dummy';
import { ChartsHeader } from '../../components';
import { AppAreaChart } from '../../components/ui/Chart';

// Transform Syncfusion per-series format → Recharts unified row format
// areaCustomSeries[i].dataSource has { x: Date, y: number }
const areaData = areaCustomSeries[0].dataSource.map((point, i) => {
  const row = { year: point.x.getFullYear().toString() };
  areaCustomSeries.forEach((series) => {
    row[series.name] = series.dataSource[i].y;
  });
  return row;
});
const areas = areaCustomSeries.map((s) => ({ dataKey: s.name }));

const Area = () => (
  <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
    <ChartsHeader category="Area" title="Inflation Rate in percentage" />
    <div className="w-full bg-white dark:bg-secondary-dark-bg rounded-xl p-4 shadow-sm">
      <AppAreaChart data={areaData} areas={areas} xKey="year" height={400} />
    </div>
  </div>
);

export default Area;
