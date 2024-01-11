import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { Event } from "@/types/event";

interface EventState {
  data: Event[] | null;
  event: Event | null;
  loading: boolean;
  error: string | null;
}
const initialState: EventState = {
  data: null,
  event: null,
  loading: false,
  error: null,
};

export const getEvents = createAsyncThunk("events", async () => {
  const res = await axiosInstance.get("/events");
  return res.data;
});

export const getEventDetail = createAsyncThunk(
  "eventDetail",
  async (slug: string, thunk) => {
    const res = await axiosInstance.get(`/events/${slug}`);
    return res.data as Event;
  }
);

export const getEventByCode = createAsyncThunk(
  "event.byCode",
  async (code: string, thunk) => {
    const res = await axiosInstance.get(`/events/code/${code}`);
    return res.data as Event;
  }
);

export const postEvent = createAsyncThunk("event.post", async (data: Event) => {
  const res = await axiosInstance.post(`/events`, data);
  return res.data as Event;
});

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getEvents.fulfilled, (state, action) => {
      state.data = action.payload as Event[];
      state.loading = false;
    });
    builder.addCase(
      getEvents.pending || getEventDetail.pending || getEventByCode.pending || postEvent.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getEvents.rejected || getEventDetail.rejected || getEventByCode.rejected || postEvent.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    builder.addCase(
      getEventDetail.fulfilled || getEventByCode.fulfilled,
      (state, action) => {
        state.event = action.payload as Event;
        state.loading = false;
      }
    );
  },
});

export default eventSlice.reducer;
