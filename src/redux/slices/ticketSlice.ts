import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { user_api } from "../api";
import { CreateOrder, Order } from "@/types/order";
import { Ticket } from "@/types/ticket";

interface TicketState {
  tickets: Ticket[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: null,
  loading: false,
  error: null,
};

export const getTicketsByEventID = createAsyncThunk("tickets", async (_, thunk) => {
  const res = await user_api.get("/tickets");
  return res.data;
});

export const postTicket = createAsyncThunk(
  "ticket.post",
  async (ticket: Ticket) => {
    const res = await user_api.post("/tickets", ticket);
    return res.data;
  }
);

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getTicketsByEventID.fulfilled, (state, action) => {
      state.tickets = action.payload as Ticket[];
      state.loading = false;
    });
    builder.addCase(getTicketsByEventID.pending || postTicket.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getTicketsByEventID.rejected || postTicket.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export default ticketSlice.reducer;
