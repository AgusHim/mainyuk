import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import { Agenda } from "@/types/agenda";
import { formatStrToDateTime } from "@/utils/convert";

interface AgendaState {
  data: Agenda[] | null;
  agenda: Agenda | null;
  loading: boolean;
  error: string | null;
  agendaStartAt: string | null;
  agendaEndAt: string | null;
}

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const nextMonth = today.getMonth() + 1; // Months are zero-based, so add 1

// Get the last day of the current month
const lastDay = new Date(currentYear, nextMonth, 0).getDate();

const initialState: AgendaState = {
  data: null,
  agenda: null,
  loading: false,
  error: null,
  agendaStartAt: formatStrToDateTime( new Date(currentYear, currentMonth, 1).toISOString(),"dd-MM-yyyy",false),
  agendaEndAt: formatStrToDateTime( new Date(currentYear, currentMonth, lastDay).toISOString(),"dd-MM-yyyy",false),
};

interface getAgendaParams {
  start_at?: string|null;
  end_at?:string|null;
}

export const getAgenda = createAsyncThunk("agenda", async (params: getAgendaParams) => {
  const res = await admin_api.get("/agenda",{
    params:params,
  });
  return res.data;
});

export const getAgendaDetail = createAsyncThunk(
  "agenda.detail",
  async (slug: string, _) => {
    const res = await admin_api.get(`/agenda/${slug}`);
    return res.data as Agenda;
  }
);

export const postAgenda = createAsyncThunk(
  "agenda.post",
  async (data: Agenda) => {
    const res = await admin_api.post(`/agenda`, data);
    return res.data as Agenda;
  }
);

export const editAgenda = createAsyncThunk(
  "agenda.edit",
  async (data: Agenda) => {
    const res = await admin_api.put(`/agenda/${data.id}`, data);
    return res.data as Agenda;
  }
);

export const deleteAgenda = createAsyncThunk(
  "agenda.delete",
  async (id: String) => {
    const res = await admin_api.delete(`/agenda/${id}`);
    return res.data;
  }
);

export const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {
    setAgenda: (state, action) => {
      state.agenda = action.payload;
    },
    deleteFromListAgenda: (state, action) => {
      const updated = state.data?.filter(agenda => agenda.id !== action.payload);
      state.data = updated!;
    },
    setAgendaStartAt: (state, action) => {
      const date = action.payload as string;
      state.agendaStartAt = date;
    },
    setAgendaEndAt: (state, action) => {
      const date = action.payload as string;
      state.agendaEndAt = date;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getAgenda.fulfilled, (state, action) => {
      state.data = action.payload as Agenda[];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(
      getAgenda.pending || getAgendaDetail.pending || postAgenda.pending || editAgenda.pending || deleteAgenda.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addCase(
      getAgenda.rejected || getAgendaDetail.rejected || postAgenda.rejected || editAgenda.rejected || deleteAgenda.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    builder.addCase(getAgendaDetail.fulfilled, (state, action) => {
      state.agenda = action.payload as Agenda;
      state.loading = false;
    });
  },
});

export const { setAgenda, deleteFromListAgenda, setAgendaStartAt, setAgendaEndAt } = agendaSlice.actions;
export default agendaSlice.reducer;
