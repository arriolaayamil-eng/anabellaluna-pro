import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#ec4899'];

const defaultTooltipStyle = {
  contentStyle: {
    background: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'hsl(var(--popover-foreground))',
  },
};

/**
 * AppBarChart — responsive bar chart.
 * @param {any[]} data
 * @param {{ dataKey: string, name?: string, color?: string }[]} bars
 * @param {string} xKey — accessor for x-axis
 * @param {number} height
 * @param {boolean} stacked
 */
export function AppBarChart({ data = [], bars = [], xKey = 'name', height = 300, stacked = false }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip {...defaultTooltipStyle} />
        <Legend />
        {bars.map((b, i) => (
          <Bar
            key={b.dataKey}
            dataKey={b.dataKey}
            name={b.name || b.dataKey}
            fill={b.color || COLORS[i % COLORS.length]}
            stackId={stacked ? 'stack' : undefined}
            radius={stacked ? undefined : [3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * AppLineChart — responsive line chart.
 * @param {any[]} data
 * @param {{ dataKey: string, name?: string, color?: string }[]} lines
 * @param {string} xKey
 * @param {number} height
 */
export function AppLineChart({ data = [], lines = [], xKey = 'name', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip {...defaultTooltipStyle} />
        <Legend />
        {lines.map((l, i) => (
          <Line
            key={l.dataKey}
            type="monotone"
            dataKey={l.dataKey}
            name={l.name || l.dataKey}
            stroke={l.color || COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * AppAreaChart — responsive area chart.
 * @param {any[]} data
 * @param {{ dataKey: string, name?: string, color?: string }[]} areas
 * @param {string} xKey
 * @param {number} height
 */
export function AppAreaChart({ data = [], areas = [], xKey = 'name', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip {...defaultTooltipStyle} />
        <Legend />
        {areas.map((a, i) => {
          const color = a.color || COLORS[i % COLORS.length];
          return (
            <Area
              key={a.dataKey}
              type="monotone"
              dataKey={a.dataKey}
              name={a.name || a.dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * AppPieChart — responsive pie/donut chart.
 * @param {{ name: string, value: number, color?: string }[]} data
 * @param {number} height
 * @param {boolean} donut
 */
export function AppPieChart({ data = [], height = 300, donut = false }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={donut ? '55%' : 0}
          outerRadius="75%"
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={entry.color || COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...defaultTooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
