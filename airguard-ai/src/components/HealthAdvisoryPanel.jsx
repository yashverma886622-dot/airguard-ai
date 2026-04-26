import { Activity, Baby, ShieldAlert, UserRound } from 'lucide-react';
import { getHealthAdvice, getSafeOutsideWindow } from '../utils/aqi';

export default function HealthAdvisoryPanel({ bundle }) {
  const advice = getHealthAdvice(bundle.aqiValue, bundle.healthRiskScore);
  const safeWindow = getSafeOutsideWindow(bundle.healthRiskScore);

  const groups = [
    { label: 'General Public', text: advice.general, icon: UserRound },
    { label: 'Children', text: advice.children, icon: Baby },
    { label: 'Elderly', text: advice.elderly, icon: ShieldAlert },
  ];

  return (
    <section className="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 text-white shadow-xl">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold">
            Smart Health Advisory
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Personalized insights based on air quality conditions
          </p>
        </div>

        {/* SAFE TIME CARD */}
        <div className="rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-5 py-3 text-white shadow-md">
          <p className="text-xs uppercase font-semibold">Safe Time Outside</p>
          <p className="text-lg font-bold">{safeWindow}</p>
        </div>
      </div>

      {/* USER GROUPS */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {groups.map(({ label, text, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-white/10 p-5 backdrop-blur-md hover:scale-105 transition"
          >
            <Icon className="mb-3 text-green-400" size={26} />
            <p className="font-bold text-lg">{label}</p>
            <p className="mt-2 text-sm text-gray-300">{text}</p>
          </div>
        ))}
      </div>

      {/* ACTION TAGS */}
      <div className="mt-6 flex flex-wrap gap-3">
        {advice.actions.map((action) => (
          <span
            key={action}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:scale-105 transition"
          >
            <Activity size={14} />
            {action}
          </span>
        ))}
      </div>
    </section>
  );
}