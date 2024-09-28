import { User } from "@/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, user_api } from "../api";
import { decryptData, encryptData } from "@/utils/crypto";

interface AuthState {
  user: User | null;
  loading: boolean;
  loadingGoogle: boolean;
  error: string | null;
}
const initialState: AuthState = {
  user: null,
  loading: false,
  loadingGoogle: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth.login",
  async (userCredential: any) => {
    const response = await api.post("/login", userCredential);
    var result = encryptData(response.data.user);
    localStorage.setItem("user", result);
    return response.data.user as User;
  }
);

export const loginGoogle = createAsyncThunk("auth.loginGoogle", async () => {
  const response = await api.get("/auth/google/login");
  return response.data.authUrl as string;
});

export const getSessionUser = createAsyncThunk(
  "auth.getSessionUser",
  async () => {
    const str = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (str != null && str != "" && token != null && token != "") {
      var decrypt = decryptData(str);
      const user = decrypt as User;
      return user;
    }
    return null;
  }
);

export const editAccount = createAsyncThunk("auth.edit", async (user: User) => {
  const response = await user_api.put(`/auth`, user);
  var result = encryptData(response.data);
  localStorage.setItem("user", result);
  return response.data.user as User;
});

export const getAuthGoogleCallback = createAsyncThunk(
  "auth.google.callback",
  async (param: any) => {
    const response = await api.get(`/auth/google/callback`, { params: param });
    var result = encryptData(response.data.user);
    localStorage.setItem("user", result);
    return response.data.user as User;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      const user = action.payload as User;
      var encrypted = encryptData(user);
      localStorage.setItem("user", encrypted);
      state.user = user;
    },
    logOutUser: (state, _) => {
      localStorage.removeItem("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      loginUser.fulfilled || getAuthGoogleCallback.fulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(loginGoogle.fulfilled, (state, action) => {
      state.loadingGoogle = false;
    });
    builder.addCase(
      loginUser.pending ||
        getSessionUser.pending ||
        getAuthGoogleCallback.pending,
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(loginGoogle.pending, (state, _) => {
      state.loadingGoogle = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.rejected || getAuthGoogleCallback.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    builder.addCase(getSessionUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
  },
});

export const { logOutUser, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
