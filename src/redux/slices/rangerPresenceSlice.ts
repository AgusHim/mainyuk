import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, ranger_api } from "../api";
import { RangerPresence } from "@/types/rengerPresence";

interface RangerPresenceState {
  data: RangerPresence[] | null;
  rangers: RangerPresence[] | null;
  loading: boolean;
  error: string | null;
}
const initialState: RangerPresenceState = {
  data: null,
  rangers: null,
  loading: false,
  error: null,
};

export const getRangerPresence = createAsyncThunk(
  "ranger.presence.get",
  async () => {
    const res = await ranger_api.get("/rangers/presence");

    return res.data;
  }
);

export const getRangersPresence = createAsyncThunk(
  "rangers.presence.get",
  async () => {
    const res = await admin_api.get("/rangers/presence");

    return res.data;
  }
);

export const getRangerPresenceByAgendaID = createAsyncThunk(
  "ranger.presence.get",
  async (agendaID: string | null, _) => {
    const res = await admin_api.get("/rangers/presence", {
      params: {
        agenda_id: agendaID,
      },
    });
    return res.data;
  }
);

export const postRangerPresence = createAsyncThunk(
  "ranger.presence.post",
  async (presence: RangerPresence) => {
    const response = await admin_api.post("/rangers/presence", presence);
    return response.data;
  }
);

export const rPresenceSlice = createSlice({
  name: "ranger.presence",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getRangerPresence.fulfilled, (state, action) => {
      state.data = action.payload as RangerPresence[];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getRangersPresence.fulfilled, (state, action) => {
      state.rangers = action.payload as RangerPresence[];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(
      getRangerPresence.pending || getRangersPresence.pending || postRangerPresence.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getRangerPresence.rejected || getRangersPresence.rejected || postRangerPresence.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export default rPresenceSlice.reducer;
