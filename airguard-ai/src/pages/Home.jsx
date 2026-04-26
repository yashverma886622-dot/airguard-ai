import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellRing, Navigation, ShieldCheck, Sparkles, Wind } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CityList from '../components/CityList';
import Loader from '../components/Loader';
import ErrorComponent from '../components/ErrorComponent';
import { cityCatalog } from '../services/demoData';
import { getCityCatalogBundles } from '../services/airQualityApi';
import { getAqiBand } from '../utils/aqi';

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('desc');

  const loadFeatured = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await getCityCatalogBundles(6);
      setFeatured(data);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  }, []);

  useEffect(() => {
    loadFeatured();
  }, [loadFeatured]);

  const filteredCities = useMemo(() => {
    return featured
      .filter((bundle) => filter === 'All' || getAqiBand(bundle.aqiValue).label === filter)
      .sort((a, b) => (sort === 'desc' ? b.aqiValue - a.aqiValue : a.aqiValue - b.aqiValue));
  }, [featured, filter, sort]);

  const handleSearch = useCallback(
    (city) => {
      navigate(`/dashboard/${encodeURIComponent(city)}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-10">
      
      {/* 🔥 HERO SECTION (UPGRADED LIKE IMAGE) */}
      <section className="grid min-h-[calc(100vh-10rem)] items-center gap-10 lg:grid-cols-[1.1fr,0.9fr] bg-gradient-to-br from-black via-gray-900 to-blue-950 p-8 rounded-2xl shadow-xl">

        {/* LEFT SIDE */}
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-green-400">
            <Sparkles size={16} />
            Real-time air quality intelligence
          </p>

          <h1 className="mt-4 text-5xl font-extrabold text-white leading-tight">
            Air Quality <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Intelligence Platform
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-300 max-w-xl">
            Monitor pollution levels, analyze health risks, and get smart recommendations for safer outdoor living.
          </p>

          <div className="mt-6 max-w-md">
            <SearchBar suggestions={cityCatalog} onSearch={handleSearch} />
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold hover:scale-105 transition"
              to="/dashboard/Delhi"
            >
              Open Dashboard
            </Link>

            <button
              className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
              onClick={() => navigate('/dashboard/Delhi')}
            >
              Explore
            </button>
          </div>
        </div>

        {/* RIGHT SIDE (GLOBE STYLE VISUAL) */}
        <div className="relative flex items-center justify-center">

          {/* Glow Circle */}
          <div className="absolute h-72 w-72 rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur-3xl opacity-30"></div>

          {/* Fake Globe Card */}
          <div className="relative z-10 rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg text-white w-72">

            <h2 className="text-xl font-bold mb-4">Air Stats</h2>

            <div className="text-5xl font-extrabold text-green-400">
              78
            </div>

            <p className="text-sm text-gray-400 mt-2">
              Moderate Air Quality
            </p>

            <div className="mt-4 text-sm text-gray-300">
              Risk Level: 35%
            </div>

            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 w-[35%]"></div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { icon: ShieldCheck, label: 'Health Risk Score', text: 'AI-based pollution risk analysis.' },
          { icon: Navigation, label: 'Safe Time Outside', text: 'Best time suggestions for outdoor activity.' },
          { icon: BellRing, label: 'Smart Alerts', text: 'Get notified on high AQI levels.' },
        ].map(({ icon: Icon, label, text }) => (
          <div key={label} className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-md hover:scale-105 transition">
            <Icon className="mb-3 text-green-400" size={26} />
            <h2 className="text-lg font-bold">{label}</h2>
            <p className="mt-2 text-sm text-gray-400">{text}</p>
          </div>
        ))}
      </div>

      {/* DATA SECTION */}
      {status === 'loading' && <Loader label="Loading featured cities" />}
      {status === 'failed' && <ErrorComponent message={error} onRetry={loadFeatured} />}
      {status === 'succeeded' && (
        <CityList cities={filteredCities} filter={filter} onFilterChange={setFilter} sort={sort} onSortChange={setSort} />
      )}
    </div>
  );
}