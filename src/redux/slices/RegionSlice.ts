import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";
import { Region } from "@/types/Region";

interface RegionState {
  province: Region[];
  district: Region[];
  sub_district: Region[];
  loading: boolean;
}

const initialState: RegionState = {
  province: [],
  district: [],
  sub_district: [],
  loading: false,
};

export const getProvince = createAsyncThunk("regions.province", async () => {
  const res = await api.get("/province");
  return res.data;
});

export const getDistrict = createAsyncThunk("regions.district", async (province_code:string) => {
  const res = await api.get(`/district?province_code=${province_code}`);
  return res.data;
});

export const getSubDistrict = createAsyncThunk(
  "regions.sub_district",
  async (district_code:string) => {
    const res = await api.get(`/sub_district?district_code=${district_code}`);
    return res.data;
  }
);

export const paymentMethodSlice = createSlice({
  name: "regions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getProvince.fulfilled, (state, action) => {
      state.province = action.payload as Region[];
      state.loading = false;
    });
    builder.addCase(getDistrict.fulfilled, (state, action) => {
      state.district = action.payload as Region[];
      state.loading = false;
    });
    builder.addCase(getSubDistrict.fulfilled, (state, action) => {
      state.sub_district = action.payload as Region[];
      state.loading = false;
    });

    builder.addCase(
      getProvince.pending || getDistrict.pending || getSubDistrict.pending,
      (state, _) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getProvince.rejected || getDistrict.rejected || getSubDistrict.rejected,

      (state, action) => {
        state.loading = false;
      }
    );
  },
});

export default paymentMethodSlice.reducer;
