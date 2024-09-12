import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { user_api } from "../api";
import { UserTicket } from "@/types/user_ticket";
import { CreateOrder, Order } from "@/types/order";
import { PaymentMethod } from "@/types/PaymentMethod";

interface OrderState {
  orders: Order[] | null;
  checkout: UserTicket[];
  payment_method: PaymentMethod | null;
  admin_fee:number;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  checkout: [
    {
      ticket_id: "ticket_id_1",
      ticket_name: "Tiket Name 1",
    },
  ],
  payment_method: null,
  admin_fee:0,
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

const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
      console.log(`ActionPayload = ${action.payload}`);
      state.checkout = action.payload as UserTicket[];
    },
    setUserTicket: (state, action) => {
      const data = action.payload as any;
      if (data.type == "name") {
        state.checkout[data.index].user_name = data.value;
      }
      if (data.type == "email") {
        state.checkout[data.index].user_email = data.value;
      }
      if (data.type == "gender") {
        state.checkout[data.index].user_gender = data.value;
      }
    },
    setAuthToUserTicket: (state, action) => {
      const data = action.payload as any;
      state.checkout[data.index].user_name = data.auth.name;
      state.checkout[data.index].user_email = data.auth.email;
      state.checkout[data.index].user_gender = data.auth.gender;
    },
    setPaymentMethod: (state, action) => {
      state.payment_method = action.payload as PaymentMethod;
      if(state.payment_method.type == "BANK" && state.admin_fee ==0){
        const randomCode = generateRandomNumber(10,200);
        state.admin_fee = randomCode;
      }
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

export const { setCheckout, setUserTicket, setAuthToUserTicket,setPaymentMethod } =
  orderSlice.actions;
export default orderSlice.reducer;
