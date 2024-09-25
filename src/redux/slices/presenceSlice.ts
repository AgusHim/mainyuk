import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, api, user_api } from "../api";
import { Presence } from "@/types/presence";
import { config } from "process";

interface PresenceState {
  data: Presence[] | null;
  loading: boolean;
  error: string | null;
}
const initialState: PresenceState = {
  data: null,
  loading: false,
  error: null,
};

export const getPresencesByAuth = createAsyncThunk(
  "presences.getByAuth",
  async (_, thunk) => {
    const res = await user_api.get("/presence");
    console.log("getPresencesByAuth = ", res);
    return res.data;
  }
);

export const getPresences = createAsyncThunk(
  "presences.get",
  async (event_id: string, thunk) => {
    const res = await admin_api.get("/presence", {
      params: {
        event_id: event_id,
      },
    });
    return res.data;
  }
);

export const presenceSlice = createSlice({
  name: "presences",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getPresences.fulfilled, (state, action) => {
      console.log("action payload = ", action.payload);
      state.data = action.payload as Presence[];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getPresencesByAuth.fulfilled, (state, action) => {
      console.log("action payload = ", action.payload);
      state.data = action.payload as Presence[];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(
      getPresences.pending || getPresencesByAuth.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getPresences.rejected || getPresencesByAuth.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export default presenceSlice.reducer;
