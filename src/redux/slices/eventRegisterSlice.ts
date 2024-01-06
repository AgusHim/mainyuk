import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { Event } from "@/types/event";
import { CreatePresence } from "@/types/presence";

interface EventRegisterState {
  event_id: string | null;
  isRegistered: boolean;
  loading: boolean;
  error: string | null;
}
const initialState: EventRegisterState = {
  event_id: null,
  isRegistered: false,
  loading: false,
  error: null,
};

export const postPrecence = createAsyncThunk("presence.post", async (precence:CreatePresence) => {
  const res = await axiosInstance.post("/presence",precence);
  return res.data;
});


export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(postPrecence.fulfilled, (state, action) => {
      state.event_id = action.payload.event.id
      state.isRegistered = true
      state.loading = false;
    });
    builder.addCase(postPrecence.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(postPrecence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default eventSlice.reducer;
