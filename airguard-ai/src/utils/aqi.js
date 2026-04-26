export const aqiBands = [
  { max: 50, label: 'Good', tone: 'green', className: 'bg-emerald-500', textClass: 'text-emerald-700 dark:text-emerald-300' },
  { max: 100, label: 'Moderate', tone: 'yellow', className: 'bg-yellow-400', textClass: 'text-yellow-700 dark:text-yellow-300' },
  { max: Infinity, label: 'Poor', tone: 'red', className: 'bg-red-500', textClass: 'text-red-700 dark:text-red-300' },
];

export const getAqiBand = (aqiValue = 0) => aqiBands.find((band) => aqiValue <= band.max) || aqiBands[2];

export const pollutantLabels = {
  pm2_5: 'PM2.5',
  pm10: 'PM10',
  co: 'CO',
  no2: 'NO2',
  so2: 'SO2',
  o3: 'O3',
};

export const calculateHealthRiskScore = ({ aqiValue = 0, pollutants = {}, weather = {} }) => {
  const particleLoad = (pollutants.pm2_5 || 0) * 1.15 + (pollutants.pm10 || 0) * 0.35;
  const gasLoad = (pollutants.no2 || 0) * 0.4 + (pollutants.o3 || 0) * 0.25 + (pollutants.so2 || 0) * 0.45;
  const humidityStress = weather.humidity > 70 ? 8 : weather.humidity < 30 ? 5 : 0;
  return Math.min(100, Math.round(aqiValue * 0.42 + particleLoad * 0.34 + gasLoad * 0.16 + humidityStress));
};

export const getSafeOutsideWindow = (riskScore) => {
  if (riskScore <= 35) return 'Anytime today, prefer green spaces.';
  if (riskScore <= 60) return 'Before 9 AM or after 6 PM.';
  if (riskScore <= 78) return 'Short trips under 30 minutes only.';
  return 'Stay indoors; ventilate with filtered air.';
};

export const getHealthAdvice = (aqiValue, riskScore) => {
  if (aqiValue <= 50 && riskScore <= 35) {
    return {
      general: 'Safe for normal outdoor routines and light exercise.',
      children: 'Outdoor play is acceptable with hydration breaks.',
      elderly: 'Good window for walks, keep medicines handy as usual.',
      actions: ['Safe for exercise', 'Open windows briefly', 'Hydrate well'],
    };
  }

  if (aqiValue <= 100 && riskScore <= 65) {
    return {
      general: 'Limit prolonged exertion near traffic corridors.',
      children: 'Prefer indoor play during peak traffic hours.',
      elderly: 'Take a mask for longer outdoor errands.',
      actions: ['Reduce intense workouts', 'Use N95 near roads', 'Check symptoms'],
    };
  }

  return {
    general: 'Avoid outdoor activity unless necessary.',
    children: 'Keep children indoors and avoid schoolyard sports.',
    elderly: 'Wear a fitted mask outdoors and keep rescue medication accessible.',
    actions: ['Wear mask', 'Avoid outdoor activity', 'Use purifier if available'],
  };
};
