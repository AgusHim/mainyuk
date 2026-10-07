import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import { MetricsView } from "@/types/metrics";

interface MetricsState {
  metrics: MetricsView | null;
  loading: boolean;
  error: string | null;
}

const initialState: MetricsState = {
  metrics: null,
  loading: false,
  error: null,
};

export const getMetrics = createAsyncThunk("metrics.show", async () => {
  const res = await admin_api.get("/metrics");
  return res.data.metrics as MetricsView;
});

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMetrics.fulfilled, (state, action) => {
      state.metrics = action.payload;
      state.loading = false;
    });

    builder.addMatcher(isAnyOf(getMetrics.pending), (state, _) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(getMetrics.rejected), (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
  },
});

export default metricsSlice.reducer;
