import axios from 'axios';
import { cityCatalog } from './demoData';
import { calculateHealthRiskScore } from '../utils/aqi';

const api = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 9000,
});

const openMeteoGeocodingApi = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com',
  timeout: 9000,
});

const openMeteoAirApi = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com',
  timeout: 9000,
});

const openMeteoWeatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com',
  timeout: 9000,
});

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const useOpenWeather = import.meta.env.VITE_USE_OPENWEATHER === 'true';

const calculateAqiValue = (components = {}) =>
  Math.round((components.pm2_5 || 0) * 1.55 + (components.pm10 || 0) * 0.18);

const weatherCodeDescriptions = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'depositing rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  71: 'slight snow',
  73: 'moderate snow',
  75: 'heavy snow',
  80: 'slight rain showers',
  81: 'moderate rain showers',
  82: 'violent rain showers',
  95: 'thunderstorm',
};

const findCity = async (cityName) => {
  const localMatch = cityCatalog.find((city) => city.name.toLowerCase() === cityName.toLowerCase());

  if (!apiKey) {
    throw new Error('OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY in .env and restart the dev server.');
  }

  const { data } = await api.get('/geo/1.0/direct', {
    params: { q: cityName, limit: 1, appid: apiKey },
  });

  if (!data.length) {
    throw new Error(`No city found for "${cityName}".`);
  }

  return {
    name: data[0].name,
    country: data[0].country,
    lat: data[0].lat,
    lon: data[0].lon,
    population: localMatch?.population || 'N/A',
  };
};

const normalizeTrend = (forecast) =>
  (forecast?.list || []).slice(0, 12).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    aqi: calculateAqiValue(item.components),
  }));

const normalizeBundle = ({ city, air, weather, forecast }) => {
  const airItem = air?.list?.[0];
  const components = airItem?.components;
  const weatherItem = weather?.weather?.[0];

  if (!airItem || !components) {
    throw new Error(`Live air quality data is unavailable for "${city.name}".`);
  }

  const bundle = {
    city,
    aqi: airItem.main?.aqi || 0,
    aqiValue: calculateAqiValue(components),
    pollutants: {
      pm2_5: Number((components.pm2_5 || 0).toFixed(1)),
      pm10: Number((components.pm10 || 0).toFixed(1)),
      co: Number((components.co || 0).toFixed(1)),
      no2: Number((components.no2 || 0).toFixed(1)),
      so2: Number((components.so2 || 0).toFixed(1)),
      o3: Number((components.o3 || 0).toFixed(1)),
    },
    weather: {
      temperature: Math.round(weather?.main?.temp ?? 0),
      humidity: weather?.main?.humidity ?? 0,
      description: weatherItem?.description || 'Live weather data',
    },
    trend: normalizeTrend(forecast),
    source: 'OpenWeather live API',
    timestamp: new Date().toISOString(),
  };

  return {
    ...bundle,
    healthRiskScore: calculateHealthRiskScore(bundle),
  };
};

const findCityWithOpenMeteo = async (cityName) => {
  const localMatch = cityCatalog.find((city) => city.name.toLowerCase() === cityName.toLowerCase());
  const { data } = await openMeteoGeocodingApi.get('/v1/search', {
    params: { name: cityName, count: 1, language: 'en', format: 'json' },
  });
  const match = data.results?.[0];

  if (!match) {
    throw new Error(`No city found for "${cityName}".`);
  }

  return {
    name: match.name,
    country: match.country_code,
    lat: match.latitude,
    lon: match.longitude,
    population: localMatch?.population || match.population || 'N/A',
  };
};

const getNearestHourlyIndex = (times = []) => {
  const now = Date.now();
  return times.reduce((nearestIndex, time, index) => {
    const nearestDiff = Math.abs(new Date(times[nearestIndex]).getTime() - now);
    const currentDiff = Math.abs(new Date(time).getTime() - now);
    return currentDiff < nearestDiff ? index : nearestIndex;
  }, 0);
};

const normalizeOpenMeteoBundle = ({ city, air, weather }) => {
  const hourly = air.hourly || {};
  const currentIndex = getNearestHourlyIndex(hourly.time || []);
  const components = {
    pm2_5: hourly.pm2_5?.[currentIndex] || 0,
    pm10: hourly.pm10?.[currentIndex] || 0,
    co: hourly.carbon_monoxide?.[currentIndex] || 0,
    no2: hourly.nitrogen_dioxide?.[currentIndex] || 0,
    so2: hourly.sulphur_dioxide?.[currentIndex] || 0,
    o3: hourly.ozone?.[currentIndex] || 0,
  };
  const aqiValue = Math.round(hourly.us_aqi?.[currentIndex] || calculateAqiValue(components));

  const bundle = {
    city,
    aqi: Math.min(5, Math.max(1, Math.ceil(aqiValue / 100))),
    aqiValue,
    pollutants: {
      pm2_5: Number(components.pm2_5.toFixed(1)),
      pm10: Number(components.pm10.toFixed(1)),
      co: Number(components.co.toFixed(1)),
      no2: Number(components.no2.toFixed(1)),
      so2: Number(components.so2.toFixed(1)),
      o3: Number(components.o3.toFixed(1)),
    },
    weather: {
      temperature: Math.round(weather.current?.temperature_2m ?? 0),
      humidity: weather.current?.relative_humidity_2m ?? 0,
      description: weatherCodeDescriptions[weather.current?.weather_code] || 'live weather data',
    },
    trend: (hourly.time || []).slice(currentIndex, currentIndex + 12).map((time, offset) => ({
      time: new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      aqi: Math.round(hourly.us_aqi?.[currentIndex + offset] || 0),
    })),
    source: 'Open-Meteo live API',
    timestamp: new Date().toISOString(),
  };

  return {
    ...bundle,
    healthRiskScore: calculateHealthRiskScore(bundle),
  };
};

const getOpenMeteoAirQualityBundle = async (cityName) => {
  const city = await findCityWithOpenMeteo(cityName);
  const [airResponse, weatherResponse] = await Promise.all([
    openMeteoAirApi.get('/v1/air-quality', {
      params: {
        latitude: city.lat,
        longitude: city.lon,
        hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi',
        timezone: 'auto',
        past_hours: 1,
        forecast_hours: 12,
      },
    }),
    openMeteoWeatherApi.get('/v1/forecast', {
      params: {
        latitude: city.lat,
        longitude: city.lon,
        current: 'temperature_2m,relative_humidity_2m,weather_code',
        timezone: 'auto',
      },
    }),
  ]);

  return normalizeOpenMeteoBundle({
    city,
    air: airResponse.data,
    weather: weatherResponse.data,
  });
};

const isOpenWeatherAuthError = (error) => error.response?.status === 401;

export const getAirQualityBundle = async (cityName) => {
  if (!useOpenWeather) {
    return getOpenMeteoAirQualityBundle(cityName);
  }

  try {
    const city = await findCity(cityName);
    const [airResponse, weatherResponse, forecastResponse] = await Promise.all([
      api.get('/data/2.5/air_pollution', {
        params: { lat: city.lat, lon: city.lon, appid: apiKey },
      }),
      api.get('/data/2.5/weather', {
        params: { lat: city.lat, lon: city.lon, units: 'metric', appid: apiKey },
      }),
      api.get('/data/2.5/air_pollution/forecast', {
        params: { lat: city.lat, lon: city.lon, appid: apiKey },
      }),
    ]);

    return normalizeBundle({
      city,
      air: airResponse.data,
      weather: weatherResponse.data,
      forecast: forecastResponse.data,
    });
  } catch (error) {
    if (isOpenWeatherAuthError(error) || !apiKey) {
      return getOpenMeteoAirQualityBundle(cityName);
    }

    throw error;
  }
};

export const getCityCatalogBundles = async (limit = 6) => {
  const selected = cityCatalog.slice(0, limit);
  return Promise.all(selected.map((city) => getAirQualityBundle(city.name)));
};
