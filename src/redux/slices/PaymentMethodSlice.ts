import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, user_api } from "../api";
import { PaymentMethod } from "@/types/PaymentMethod";

interface PaymentMethodState {
  data: PaymentMethod[];
  paymentMethod: PaymentMethod | null;
  loading: boolean;
  error: string | null;
}
const initialState: PaymentMethodState = {
  data: [],
  paymentMethod: null,
  loading: false,
  error: null,
};

export const getPaymentMethod = createAsyncThunk(
  "payment_methods.get",
  async () => {
    const res = await user_api.get("/payment_methods");
    return res.data;
  }
);

export const postPaymentMethod = createAsyncThunk(
  "payment_methods.post",
  async (method: PaymentMethod) => {
    const res = await admin_api.post("/payment_methods", method);
    return res.data;
  }
);

export const putPaymentMethod = createAsyncThunk(
  "payment_methods.edit",
  async (method: PaymentMethod) => {
    const res = await admin_api.put(`/payment_methods/${method.id}`, method);
    return res.data;
  }
);

export const deletePaymentMethod = createAsyncThunk(
  "payment_methods.delete",
  async (id: string) => {
    const res = await admin_api.delete(`/payment_methods/${id}`);
    return res.data;
  }
);

export const paymentMethodSlice = createSlice({
  name: "payment_methods",
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload as PaymentMethod;
    },
    deleteFromPaymentMethods: (state, action) => {
      const updated = state.data?.filter(
        (method) => method.id !== action.payload
      );
      state.data = updated!;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getPaymentMethod.fulfilled, (state, action) => {
      state.data = action.payload as PaymentMethod[];
      state.loading = false;
    });
    builder.addCase(
      postPaymentMethod.fulfilled || putPaymentMethod.fulfilled,
      (state, action) => {
        state.paymentMethod = action.payload as PaymentMethod;
        state.loading = false;
      }
    );
    builder.addCase(
      getPaymentMethod.pending ||
        postPaymentMethod.pending ||
        putPaymentMethod.pending ||
        deletePaymentMethod.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getPaymentMethod.rejected ||
        postPaymentMethod.rejected ||
        putPaymentMethod.rejected ||
        deletePaymentMethod.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { setPaymentMethod, deleteFromPaymentMethods } =
  paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;
