import { User } from "@/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth.login",
  async (userCredential: any) => {
    const response = await api.post("/login", userCredential);
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
);

export const getSessionUser = createAsyncThunk(
  "auth.getSessionUser",
  async () => {
    const str = localStorage.getItem("user");
    console.log(`Get Session user ${str}`)
    if (str != null) {
      const user = JSON.parse(str) as User;
      return user;
    }
    return null;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getSessionAdmin: (state, _) => {
      const user = localStorage.getItem("admin");
      if (user != null) {
        state.user = JSON.parse(user);
      }
    },
    logOutUser: (state, _) => {
      localStorage.removeItem("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(loginUser.pending || getSessionUser.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
    builder.addCase(getSessionUser.fulfilled, (state, action) => {
      console.log(`GetSession Payload ${action.payload}`)
      state.user = action.payload;
      state.loading = false;
    });
  },
});

export const { getSessionAdmin, logOutUser } = authSlice.actions;
export default authSlice.reducer;
