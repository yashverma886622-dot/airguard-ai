import { Heart, MapPin, Thermometer, Droplets } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { getAqiBand } from '../utils/aqi';

export default function AQICard({ bundle, compact = false }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.cities);
  const isFavorite = favorites.some((city) => city.name === bundle.city.name);
  const band = getAqiBand(bundle.aqiValue);

  return (
    <article className="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 shadow-xl text-white relative overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute -top-10 -left-10 h-40 w-40 bg-green-400 opacity-20 blur-3xl rounded-full"></div>

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={16} />
            {bundle.city.country}
          </div>
          <h2 className="text-3xl font-extrabold mt-1">{bundle.city.name}</h2>
          <p className="text-xs text-gray-500 mt-1">Source: {bundle.source}</p>
        </div>

        <button
          className={`grid h-10 w-10 place-items-center rounded-xl transition ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/10 text-white hover:bg-red-500'
          }`}
          onClick={() => dispatch(toggleFavorite({ name: bundle.city.name, country: bundle.city.country }))}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* AQI MAIN */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">Air Quality Index</p>

        <div className="text-6xl font-extrabold text-green-400 mt-2">
          {bundle.aqiValue}
        </div>

        <p className={`mt-2 text-lg font-bold ${band.textClass}`}>
          {band.label}
        </p>
      </div>

      {/* HEALTH SCORE */}
      <div className="mt-5">
        <p className="text-sm text-gray-400">Health Risk Score</p>
        <p className="text-xl font-bold text-white mt-1">
          {bundle.healthRiskScore}/100
        </p>

        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: `${bundle.healthRiskScore}%` }}
          ></div>
        </div>
      </div>

      {/* WEATHER */}
      {!compact && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/10 p-4 text-center">
            <Thermometer className="mx-auto text-green-400 mb-2" size={20} />
            <p className="text-xs text-gray-400">Temperature</p>
            <p className="text-lg font-bold">{bundle.weather.temperature}°C</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4 text-center">
            <Droplets className="mx-auto text-blue-400 mb-2" size={20} />
            <p className="text-xs text-gray-400">Humidity</p>
            <p className="text-lg font-bold">{bundle.weather.humidity}%</p>
          </div>
        </div>
      )}
    </article>
  );
}