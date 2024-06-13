import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import { Divisi } from "@/types/divisi";

interface DivisiState {
  data: Divisi[] | null;
  loading: boolean;
  error: string | null;
}
const initialState: DivisiState = {
  data: null,
  loading: false,
  error: null,
};

export const getDivisi = createAsyncThunk("divisi", async () => {
  const res = await admin_api.get("/divisi");
  return res.data;
});

export const divisiSlice = createSlice({
  name: "divisi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getDivisi.fulfilled, (state, action) => {
      state.data = action.payload as Divisi[];
      state.loading = false;
    });
    builder.addCase(getDivisi.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDivisi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
  },
});

export default divisiSlice.reducer;
