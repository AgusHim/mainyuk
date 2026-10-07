import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import { AccountPage, AccountRow } from "@/types/user";

interface UserAdminState {
  users: AccountRow[];
  page: number;
  hasMore: boolean;
  /** Kata kunci yang sedang aktif — dipakai untuk menandai hasil kosong. */
  search: string;
  role: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserAdminState = {
  users: [],
  page: 1,
  hasMore: false,
  search: "",
  role: "",
  loading: false,
  error: null,
};

export const getUsers = createAsyncThunk(
  "userAdmin.list",
  async (params: { page?: number; search?: string; role?: string }) => {
    const res = await admin_api.get("/users", { params });
    return res.data as AccountPage;
  }
);

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload.users;
      state.page = action.payload.page;
      state.hasMore = action.payload.has_more;
      state.loading = false;
    });

    builder.addMatcher(isAnyOf(getUsers.pending), (state, action) => {
      state.loading = true;
      state.error = null;
      // Filter yang sedang dimuat disimpan supaya hasil kosong bisa dibedakan
      // antara "belum ada akun" dan "tidak ada yang cocok".
      const arg = action.meta.arg as { search?: string; role?: string };
      state.search = arg?.search ?? "";
      state.role = arg?.role ?? "";
    });

    builder.addMatcher(isAnyOf(getUsers.rejected), (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
  },
});

export default userAdminSlice.reducer;
