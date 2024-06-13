import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, ranger_api } from "../api";
import { Ranger } from "@/types/ranger";

interface RangerState {
  rangers: Ranger[] | null;
  ranger: Ranger | null;
  loading: boolean;
  error: string | null;
}
const initialState: RangerState = {
  rangers: null,
  ranger: null,
  loading: false,
  error: null,
};

export const getRangers = createAsyncThunk("rangers", async () => {
  const res = await admin_api.get("/rangers");
  return res.data;
});

export const getRangerDetail = createAsyncThunk(
  "rangers.detail",
  async (id: string | null, _) => {
    if(id != null){
      const res = await admin_api.get(`/rangers/${id == null ? "me" : id}`);
       return res.data as Ranger;
    }
    const res = await ranger_api.get(`/rangers/${id == null ? "me" : id}`);
    return res.data as Ranger;
  }
);

export const postRanger = createAsyncThunk(
  "rangers.post",
  async (data: Ranger) => {
    const res = await admin_api.post(`/Ranger`, data);
    return res.data as Ranger;
  }
);

export const RangerSlice = createSlice({
  name: "Ranger",
  initialState,
  reducers: {
    resetRanger: (state, _) => {
      state.ranger = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getRangers.fulfilled, (state, action) => {
      state.rangers = action.payload as Ranger[];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(
      getRangers.pending || getRangerDetail.pending || postRanger.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getRangers.rejected || getRangerDetail.rejected || postRanger.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    builder.addCase(getRangerDetail.fulfilled, (state, action) => {
      state.ranger = action.payload as Ranger;
      state.loading = false;
    });
  },
});

export const { resetRanger } = RangerSlice.actions;
export default RangerSlice.reducer;
