import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { user_api } from "../api";
import { UserTicket } from "@/types/user_ticket";
import { CreateOrder, Order } from "@/types/order";

interface OrderTicket {
  ticket_id: string | null;
  qty: UserTicket[] | null;
  user_tickets: UserTicket[];
}

interface OrderState {
  orders: Order[] | null;
  checkout: OrderTicket[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  checkout: [],
  loading: false,
  error: null,
};

export const getOrders = createAsyncThunk("orders", async (_, thunk) => {
  const res = await user_api.get("/orders");
  return res.data;
});

export const postOrder = createAsyncThunk(
  "order.post",
  async (order: CreateOrder) => {
    const res = await user_api.post("/orders", order);
    return res.data;
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setQtyTickets: (state, action) => {
      const data = action.payload as OrderTicket;
      const index = state.checkout?.findIndex(
        (item) => item.ticket_id === data.ticket_id
      );
      if (index != -1) {
        state.checkout[index].qty = data.qty;
      } else {
        state.checkout.push({
          ticket_id: data.ticket_id,
          qty: data.qty,
          user_tickets: [],
        });
      }
    },
    setUserTicket: (state, action) => {
      const data = action.payload as any;

      state.checkout[data.index].user_tickets[data.user_index] =
        data.user_ticket;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload as Order[];
      state.loading = false;
    });
    builder.addCase(getOrders.pending || postOrder.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getOrders.rejected || postOrder.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { setQtyTickets, setUserTicket } = orderSlice.actions;
export default orderSlice.reducer;
