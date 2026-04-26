import { configureStore } from '@reduxjs/toolkit';
import aqiReducer from './slices/aqiSlice';
import favoritesReducer from './slices/favoritesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    aqi: aqiReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
  },
});
