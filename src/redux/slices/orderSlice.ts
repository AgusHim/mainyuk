import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, user_api } from "../api";
import { UserTicket } from "@/types/user_ticket";
import { CreateOrder, Order, VerifyOrder } from "@/types/order";
import { PaymentMethod } from "@/types/PaymentMethod";

interface OrderState {
  orders: Order[] | null;
  order: Order | null;
  checkout: UserTicket[];
  payment_method: PaymentMethod | null;
  admin_fee: number;
  loading: boolean;
  isLoadingOrder: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  order: null,
  checkout: [],
  payment_method: null,
  admin_fee: 0,
  loading: false,
  isLoadingOrder: false,
  error: null,
};

interface getOrdersParams {
  status?: string|null;
  event_id?:string|null;
}

export const getOrders = createAsyncThunk("orders", async (_, thunk) => {
  const res = await user_api.get("/orders");
  return res.data;
});

export const getAdminOrders = createAsyncThunk(
  "orders.admin.get",
  async (params:getOrdersParams, thunk) => {
    const res = await admin_api.get("/orders",{
      params:params,
    });
    return res.data;
  }
);

export const getOrderByPublicID = createAsyncThunk(
  "orders.getPublic",
  async (public_id: string, thunk) => {
    const res = await user_api.get(`/orders/${public_id}`);
    return res.data;
  }
);

export const postOrder = createAsyncThunk(
  "order.post",
  async (order: CreateOrder) => {
    const res = await user_api.post("/orders", order);
    return res.data;
  }
);

export const putOrderVerify = createAsyncThunk(
  "orders.verify",
  async (data: VerifyOrder, thunk) => {
    const res = await admin_api.put(`/orders/${data.order_id}/verify`, {
      status: data.status,
    });
    return res.data;
  }
);

const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
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
      if (state.payment_method.type == "bank" && state.admin_fee == 0) {
        const randomCode = generateRandomNumber(10, 200);
        state.admin_fee = randomCode;
      } else {
        state.admin_fee = 0;
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload as Order[];
      state.loading = false;
    });
    builder.addCase(getAdminOrders.fulfilled, (state, action) => {
      state.orders = action.payload as Order[];
      state.loading = false;
    });
    builder.addCase(getOrderByPublicID.fulfilled, (state, action) => {
      state.order = action.payload as Order;
      state.isLoadingOrder = false;
    });
    builder.addCase(postOrder.fulfilled, (state, action) => {
      state.order = action.payload as Order;
      state.isLoadingOrder = false;
    });
    builder.addCase(
      getOrders.pending || getOrderByPublicID.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(postOrder.pending, (state, _) => {
      state.isLoadingOrder = true;
      state.error = null;
    });
    builder.addCase(
      getOrders.rejected || postOrder.rejected,
      (state, action) => {
        state.loading = false;
        state.isLoadingOrder = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const {
  setCheckout,
  setUserTicket,
  setAuthToUserTicket,
  setPaymentMethod,
} = orderSlice.actions;
export default orderSlice.reducer;
