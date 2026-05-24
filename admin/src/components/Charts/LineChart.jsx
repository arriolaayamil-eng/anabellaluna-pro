import React from 'react';
import { lineChartData, lineCustomSeries } from '../../data/dummy';
import { AppLineChart } from '../ui/Chart';

const chartData = lineChartData[0].map((point, i) => {
  const row = { year: point.x.getFullYear().toString() };
  lineCustomSeries.forEach((series) => {
    row[series.name] = series.dataSource[i].y;
  });
  return row;
});
const lines = lineCustomSeries.map((s) => ({ dataKey: s.name }));

const LineChart = () => (
  <AppLineChart data={chartData} lines={lines} xKey="year" height={420} />
);

export default LineChart;
