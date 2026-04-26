import { createSlice } from '@reduxjs/toolkit';

const storageKey = 'airguard-ai-favorites';

const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  localStorage.setItem(storageKey, JSON.stringify(favorites));
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    cities: loadFavorites(),
  },
  reducers: {
    toggleFavorite(state, action) {
      const city = action.payload;
      const exists = state.cities.some((item) => item.name === city.name);
      state.cities = exists ? state.cities.filter((item) => item.name !== city.name) : [...state.cities, city];
      saveFavorites(state.cities);
    },
    removeFavorite(state, action) {
      state.cities = state.cities.filter((city) => city.name !== action.payload);
      saveFavorites(state.cities);
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
