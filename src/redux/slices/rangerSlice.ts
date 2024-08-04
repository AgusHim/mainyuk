import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api, ranger_api } from "../api";
import { CreateRanger, Ranger } from "@/types/ranger";
import { formatStrToDateTime } from "@/utils/convert";
interface RangerState {
  rangers: Ranger[] | null;
  ranger: Ranger | null;
  loading: boolean;
  error: string | null;
  startAt: string;
  endAt: string;
}
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const nextMonth = today.getMonth() + 1; // Months are zero-based, so add 1

// Get the last day of the current month
const lastDay = new Date(currentYear, nextMonth, 0).getDate();

const initialState: RangerState = {
  rangers: null,
  ranger: null,
  loading: false,
  error: null,
  startAt: new Date(currentYear, currentMonth, 1).toISOString(),
  endAt: new Date(currentYear, currentMonth, lastDay).toISOString(),
};

interface getRengerParams {
  start_at?: string|null;
  end_at?:string|null;
}

export const getRangers = createAsyncThunk(
  "rangers",
  async (params: getRengerParams) => {
    const res = await admin_api.get("/rangers", {
      params: params,
    });
    return res.data;
  }
);

export const getRangerDetail = createAsyncThunk(
  "rangers.detail",
  async (id: string | null, _) => {
    if (id != null) {
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
    const res = await admin_api.post(`/rangers`, data);
    return res.data as Ranger;
  }
);

export const editRanger = createAsyncThunk(
  "rangers.edit",
  async (ranger: Ranger) => {
    const res = await admin_api.put(`/rangers/${ranger.id}`, ranger);
    return res.data as Ranger;
  }
);

export const deleteRanger = createAsyncThunk(
  "ranger.delete",
  async (id: String) => {
    const res = await admin_api.delete(`/rangers/${id}`);
    return res.data;
  }
);

export const RangerSlice = createSlice({
  name: "ranger",
  initialState,
  reducers: {
    resetRanger: (state, _) => {
      state.ranger = null;
    },
    deleteFromListRanger: (state, action) => {
      const updated = state.rangers?.filter(
        (ranger) => ranger.id !== action.payload
      );
      state.rangers = updated!;
    },
    setStartAt: (state, action) => {
      const date = action.payload as string;
      state.startAt = date;
    },
    setEndAt: (state, action) => {
      const date = action.payload as string;
      state.endAt = date;
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
      getRangers.pending ||
        getRangerDetail.pending ||
        postRanger.pending ||
        editRanger.pending ||
        deleteRanger.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      getRangers.rejected ||
        getRangerDetail.rejected ||
        postRanger.rejected ||
        editRanger.rejected ||
        deleteRanger.rejected,
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

export const { resetRanger, deleteFromListRanger, setStartAt, setEndAt } =
  RangerSlice.actions;
export default RangerSlice.reducer;
