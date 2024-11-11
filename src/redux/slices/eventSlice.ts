import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, api } from "../api";
import { Event } from "@/types/event";
import { UserTicket } from "@/types/user_ticket";

interface EventState {
  data: Event[] | null;
  event: Event | null;
  participants: UserTicket[] | null;
  loading: boolean;
  error: string | null;
}
const initialState: EventState = {
  data: null,
  event: null,
  participants: null,
  loading: false,
  error: null,
};

export const getEvents = createAsyncThunk("events", async () => {
  const res = await api.get("/events");
  return res.data;
});

export const getEventsHome = createAsyncThunk("home.events", async () => {
  const res = await api.get("/events", {
    params: {
      limit: 10,
    },
  });
  return res.data;
});

export const getEventDetail = createAsyncThunk(
  "eventDetail",
  async (slug: string, thunk) => {
    const res = await api.get(`/events/${slug}`);
    return res.data as Event;
  }
);

export const getEventByCode = createAsyncThunk(
  "event.byCode",
  async (code: string, thunk) => {
    const res = await api.get(`/events/code/${code}`);
    return res.data as Event;
  }
);

export const postEvent = createAsyncThunk("event.post", async (data: Event) => {
  const res = await api.post(`/events`, data);
  return res.data as Event;
});

export const getEventParticipants = createAsyncThunk(
  "events.participants",
  async (id: string) => {
    const res = await admin_api.get(`/events/${id}/participants`);
    return res.data;
  }
);

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      getEvents.fulfilled || getEventsHome.fulfilled,
      (state, action) => {
        state.data = action.payload as Event[];
        state.loading = false;
      }
    );
    builder.addCase(getEventParticipants.fulfilled, (state, action) => {
      state.participants = action.payload as UserTicket[];
      state.loading = false;
    });
    builder.addCase(getEventsHome.fulfilled, (state, action) => {
      state.data = action.payload as Event[];
      state.loading = false;
    });
    builder.addCase(
      getEvents.pending ||
        getEventsHome.pending ||
        getEventDetail.pending ||
        getEventByCode.pending ||
        postEvent.pending ||
        getEventParticipants.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getEvents.rejected ||
        getEventsHome.rejected ||
        getEventDetail.rejected ||
        getEventByCode.rejected ||
        postEvent.rejected ||
        getEventParticipants.rejected,
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
