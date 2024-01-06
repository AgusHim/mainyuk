import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api"
import { Presence } from "@/types/presence";
import { config } from "process";

interface PresenceState {
  data: Presence[]|null;
  loading: boolean;
  error: string | null;
}
const initialState: PresenceState= {
  data:null,
  loading:false,
  error:null
};

export const getPresence = createAsyncThunk("Presence", async (event_slug:string, thunk) => {
  const res = await axiosInstance.get('/presence',{
    params:{
        "event_slug":event_slug
    }
  });
  return res.data;
});

export const presenceSlice = createSlice({
  name: "Presence",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getPresence.fulfilled, (state, action) => {
      state.data = action.payload as Presence[];
      state.loading = false;
    });
    builder.addCase(getPresence.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPresence.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
    
  },
});

export default presenceSlice.reducer;
