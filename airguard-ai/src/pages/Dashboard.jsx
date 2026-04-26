import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AQICard from '../components/AQICard';
import ChartSection from '../components/ChartSection';
import HealthAdvisoryPanel from '../components/HealthAdvisoryPanel';
import Loader from '../components/Loader';
import ErrorComponent from '../components/ErrorComponent';
import { fetchCityAirQuality } from '../store/slices/aqiSlice';
import { cityCatalog } from '../services/demoData';
import { pollutantLabels } from '../utils/aqi';

export default function Dashboard() {
  const { city = 'Delhi' } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, status, error, lastUpdated } = useSelector((state) => state.aqi);

  const loadCity = useCallback(
    (cityName) => {
      dispatch(fetchCityAirQuality(cityName));
    },
    [dispatch],
  );

  useEffect(() => {
    loadCity(decodeURIComponent(city));
  }, [city, loadCity]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      loadCity(decodeURIComponent(city));
    }, 300000);
    return () => window.clearInterval(timer);
  }, [city, loadCity]);

  const handleSearch = useCallback(
    (cityName) => {
      navigate(`/dashboard/${encodeURIComponent(cityName)}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-6">
      
      {/*  HERO SECTION UPGRADED */}
      <section className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-6 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-green-300">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight">
            AirGuard AI
          </h1>
          <p className="text-sm text-blue-200 mt-1">
            Smart Air Quality Insights & Health Advisory
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="min-w-0 sm:w-80">
            <SearchBar value={decodeURIComponent(city)} suggestions={cityCatalog} onSearch={handleSearch} />
          </div>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-5 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
            type="button"
            onClick={() => loadCity(decodeURIComponent(city))}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {status === 'loading' && !current && <Loader label="Loading city air data" />}
      {status === 'failed' && <ErrorComponent message={error} onRetry={() => loadCity(decodeURIComponent(city))} />}

      {current && (
        <>
          <section className="grid gap-5 lg:grid-cols-[0.9fr,1.1fr]">
            <AQICard bundle={current} />

            {/*  POLLUTANTS CARD UPGRADED */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg text-white">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">Pollutants</h2>
                  <p className="text-sm text-gray-300">
                    Last updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'just now'}
                  </p>
                </div>

                {current.aqiValue > 100 && (
                  <span className="rounded-xl bg-red-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
                    ⚠ High AQI
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Object.entries(current.pollutants).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl bg-gray-800 p-4 text-center shadow-md hover:scale-105 transition"
                  >
                    <p className="text-xs font-bold uppercase text-gray-400">
                      {pollutantLabels[key]}
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-green-400">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <HealthAdvisoryPanel bundle={current} />
          <ChartSection bundle={current} />
        </>
      )}
    </div>
  );
}