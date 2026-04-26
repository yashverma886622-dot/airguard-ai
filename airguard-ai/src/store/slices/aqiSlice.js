import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAirQualityBundle } from '../../services/airQualityApi';

export const fetchCityAirQuality = createAsyncThunk(
  'aqi/fetchCityAirQuality',
  async (city, { rejectWithValue }) => {
    try {
      return await getAirQualityBundle(city);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load air quality data.');
    }
  },
);

const aqiSlice = createSlice({
  name: 'aqi',
  initialState: {
    selectedCity: 'Delhi',
    current: null,
    featured: [],
    status: 'idle',
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
    clearAqiError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityAirQuality.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.selectedCity = action.meta.arg;
      })
      .addCase(fetchCityAirQuality.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCityAirQuality.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedCity, clearAqiError } = aqiSlice.actions;
export default aqiSlice.reducer;
