import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { pollutantLabels } from '../utils/aqi';

export default function ChartSection({ bundle }) {
  const pollutantData = Object.entries(bundle.pollutants).map(([key, value]) => ({
    name: pollutantLabels[key],
    value,
  }));

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="panel motion-card p-5">
        <h3 className="text-lg font-black">AQI Trend</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Rolling hourly estimate for planning outdoor activity.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bundle.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #cbd5e1' }} />
              <Line type="monotone" dataKey="aqi" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel motion-card p-5">
        <h3 className="text-lg font-black">Pollutant Comparison</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Concentration snapshot in micrograms per cubic meter where applicable.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollutantData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #cbd5e1' }} />
              <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
