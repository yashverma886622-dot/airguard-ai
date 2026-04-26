export const cityCatalog = [
  { name: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.209, population: '32M' },
  { name: 'Mumbai', country: 'IN', lat: 19.076, lon: 72.8777, population: '21M' },
  { name: 'Bengaluru', country: 'IN', lat: 12.9716, lon: 77.5946, population: '13M' },
  { name: 'Kolkata', country: 'IN', lat: 22.5726, lon: 88.3639, population: '15M' },
  { name: 'Chennai', country: 'IN', lat: 13.0827, lon: 80.2707, population: '12M' },
  { name: 'Hyderabad', country: 'IN', lat: 17.385, lon: 78.4867, population: '10M' },
  { name: 'Pune', country: 'IN', lat: 18.5204, lon: 73.8567, population: '7M' },
  { name: 'London', country: 'GB', lat: 51.5072, lon: -0.1276, population: '9M' },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006, population: '19M' },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, population: '37M' },
];

const pollutantProfiles = {
  Delhi: { pm2_5: 86, pm10: 171, co: 780, no2: 58, so2: 18, o3: 64, temp: 31, humidity: 36 },
  Mumbai: { pm2_5: 34, pm10: 74, co: 420, no2: 29, so2: 9, o3: 52, temp: 29, humidity: 71 },
  Bengaluru: { pm2_5: 22, pm10: 48, co: 350, no2: 21, so2: 6, o3: 41, temp: 25, humidity: 58 },
  Kolkata: { pm2_5: 49, pm10: 103, co: 510, no2: 39, so2: 13, o3: 45, temp: 32, humidity: 64 },
  Chennai: { pm2_5: 28, pm10: 58, co: 390, no2: 24, so2: 7, o3: 55, temp: 30, humidity: 73 },
  Hyderabad: { pm2_5: 38, pm10: 86, co: 455, no2: 31, so2: 10, o3: 48, temp: 28, humidity: 49 },
  Pune: { pm2_5: 26, pm10: 66, co: 375, no2: 25, so2: 8, o3: 46, temp: 27, humidity: 52 },
  London: { pm2_5: 15, pm10: 31, co: 270, no2: 33, so2: 5, o3: 38, temp: 14, humidity: 69 },
  'New York': { pm2_5: 18, pm10: 35, co: 310, no2: 28, so2: 4, o3: 44, temp: 17, humidity: 55 },
  Tokyo: { pm2_5: 24, pm10: 45, co: 335, no2: 35, so2: 7, o3: 50, temp: 20, humidity: 62 },
};

export const buildDemoCityBundle = (cityName) => {
  const catalogMatch = cityCatalog.find((city) => city.name.toLowerCase() === cityName.toLowerCase());
  const city = catalogMatch || {
    name: cityName,
    country: 'Global',
    lat: 20.5937,
    lon: 78.9629,
    population: 'N/A',
  };
  const profile = pollutantProfiles[city.name] || pollutantProfiles.Delhi;
  const now = Date.now();
  const aqiIndex = profile.pm2_5 > 55 || profile.pm10 > 120 ? 4 : profile.pm2_5 > 30 ? 3 : profile.pm2_5 > 15 ? 2 : 1;

  return {
    city,
    aqi: aqiIndex,
    aqiValue: Math.round(profile.pm2_5 * 1.55 + profile.pm10 * 0.18),
    pollutants: {
      pm2_5: profile.pm2_5,
      pm10: profile.pm10,
      co: profile.co,
      no2: profile.no2,
      so2: profile.so2,
      o3: profile.o3,
    },
    weather: {
      temperature: profile.temp,
      humidity: profile.humidity,
      description: 'Demo conditions',
    },
    trend: Array.from({ length: 12 }, (_, index) => {
      const wave = Math.sin(index / 1.4) * 9;
      return {
        time: `${String((index * 2) % 24).padStart(2, '0')}:00`,
        aqi: Math.max(18, Math.round(profile.pm2_5 * 1.5 + wave + index * 1.3)),
      };
    }),
    source: 'Demo fallback',
    timestamp: new Date(now).toISOString(),
  };
};
