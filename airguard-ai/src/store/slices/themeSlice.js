import { createSlice } from '@reduxjs/toolkit';

const storageKey = 'airguard-ai-theme';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light',
  },
  reducers: {
    hydrateTheme(state) {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') {
        state.mode = saved;
        return;
      }
      state.mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, state.mode);
    },
  },
});

export const { hydrateTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
