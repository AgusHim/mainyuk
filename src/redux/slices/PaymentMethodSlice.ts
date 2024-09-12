import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { user_api } from "../api";
import { PaymentMethod } from "@/types/PaymentMethod";

interface PaymentMethodState {
  data: PaymentMethod[];
  loading: boolean;
  error: string | null;
}
const initialState: PaymentMethodState = {
  data: [
    {
      id: "001",
      name: "BSI",
      type: "BANK",
      code: "bsi_va",
      account_name: "Taufiq",
      account_number: "0321420123231",
    },
    {
      id: "002",
      name: "BNI",
      type: "BANK",
      code: "bni_va",
      account_name: "Taufiq",
      account_number: "0321420123231",
    },
    {
      id: "003",
      name: "Go-Pay",
      type: "E-WALLET",
      code: "gopay",
      account_name: "Taufiq",
      account_number: "0321420123231",
    },
  ],
  loading: false,
  error: null,
};

export const getPaymentMethod = createAsyncThunk("payment_method", async () => {
  const res = await user_api.get("/payment_method");
  return res.data;
});

export const paymentMethodSlice = createSlice({
  name: "payment_method",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getPaymentMethod.fulfilled, (state, action) => {
      state.data = action.payload as PaymentMethod[];
      state.loading = false;
    });
    builder.addCase(getPaymentMethod.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPaymentMethod.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
  },
});

export default paymentMethodSlice.reducer;
