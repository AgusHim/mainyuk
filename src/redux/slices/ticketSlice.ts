import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, api, ranger_api, user_api } from "../api";
import { PresenceTicket, Ticket } from "@/types/ticket";

interface TicketState {
  tickets: Ticket[] | null;
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: null,
  ticket: null,
  loading: false,
  error: null,
};

export const getTicketsByEventID = createAsyncThunk(
  "tickets.get",
  async (event_id: string, thunk) => {
    const res = await api.get(`/tickets?event_id=${event_id}`);
    return res.data;
  }
);

export const getPublicTickets = createAsyncThunk(
  "tickets.getPublicTIcket",
  async (event_id: string, thunk) => {
    const res = await api.get(`/tickets?event_id=${event_id}`);
    return res.data;
  }
);

export const postTicket = createAsyncThunk(
  "ticket.post",
  async (ticket: Ticket) => {
    const res = await admin_api.post("/tickets", ticket);
    return res.data;
  }
);

export const putTicket = createAsyncThunk(
  "ticket.edit",
  async (ticket: Ticket) => {
    const res = await admin_api.put("/tickets" + `/${ticket.id}`, ticket);
    return res.data;
  }
);

export const deleteTicket = createAsyncThunk(
  "ticket.delete",
  async (id: string) => {
    const res = await admin_api.delete("/tickets" + `/${id}`);
    return res.data;
  }
);

export const getUserTicket = createAsyncThunk(
  "tickets.getUserTicket",
  async (public_id: string, thunk) => {
    const res = await ranger_api.get(`/user_tickets/${public_id}`);
    return res.data;
  }
);

export const postPresenceTicket = createAsyncThunk(
  "tickets.postPresenceTicket",
  async (data:PresenceTicket, thunk) => {
    const res = await ranger_api.post(`/event/${data.slug}/presence`,data);
    return res.data;
  }
);

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setTicket: (state, action) => {
      state.ticket = action.payload as Ticket;
    },
    deleteFromTickets: (state, action) => {
      const updated = state.tickets?.filter(
        (ticket) => ticket.id !== action.payload
      );
      state.tickets = updated!;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      getTicketsByEventID.fulfilled || getPublicTickets.fulfilled,
      (state, action) => {
        state.tickets = action.payload as Ticket[];
        state.loading = false;
      }
    );
    builder.addCase(
      getTicketsByEventID.pending ||
        getPublicTickets.pending ||
        postTicket.pending ||
        putTicket.pending ||
        deleteTicket.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getTicketsByEventID.rejected ||
        postTicket.rejected ||
        putTicket.rejected ||
        deleteTicket.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { setTicket, deleteFromTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
