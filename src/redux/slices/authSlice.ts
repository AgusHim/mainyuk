import { User, VerifyOTP } from "@/types/user";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { api, user_api } from "../api";
import { decryptData, encryptData } from "@/utils/crypto";

interface AuthState {
  user: User | null;
  email: string | null;
  loading: boolean;
  loadingGoogle: boolean;
  error: string | null;
}
const initialState: AuthState = {
  user: null,
  email: null,
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

export const loginGoogle = createAsyncThunk(
  "auth.loginGoogle",
  async (redirectTo: string) => {
    const response = await api.get(
      `/auth/google/login?redirectTo=${redirectTo}`
    );
    return response.data.authUrl as string;
  }
);

export const getMe = createAsyncThunk(
  "auth.getMe",
  async () => {
    // baseURL user_api sudah berakhir dengan /user_api, jadi cukup "/me".
    const response = await user_api.get("/me");
    return response.data.user as User;
  }
);

export const getSessionUser = createAsyncThunk(
  "auth.getSessionUser",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("access_token");
    if (token != null && token != "") {
      try {
        const user = await thunkAPI.dispatch(getMe()).unwrap();
        var result = encryptData(user);
        localStorage.setItem("user", result);
        return user;
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
        }
        return null;
      }
    }
    return null;
  }
);

export const editAccount = createAsyncThunk("auth.edit", async (user: User) => {
  const response = await user_api.put(`/auth`, user);
  var result = encryptData(response.data.user);
  localStorage.setItem("user", result);
  return response.data.user as User;
});

export const getAuthGoogleCallback = createAsyncThunk(
  "auth.google.callback",
  async (param: any) => {
    const response = await api.get(`/auth/google/callback`, { params: param });
    var result = encryptData(response.data.user);
    localStorage.setItem("user", result);
    return response.data;
  }
);

export const postRequestOTP = createAsyncThunk(
  "auth.otp.request",
  async (data: VerifyOTP) => {
    const response = await api.post(`/auth/otp/request`, data);
    return response.data;
  }
);

export const postVerifyOTP = createAsyncThunk(
  "auth.otp.verify",
  async (data: VerifyOTP) => {
    const response = await api.post(`/auth/otp/verify`, data);
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
      localStorage.removeItem("access_token");
      state.user = null;
    },
    setEmail: (state, action) => {
      const email = action.payload as string;
      state.email = email;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addMatcher(
      isAnyOf(loginUser.fulfilled, postVerifyOTP.fulfilled),
      (state, action) => {
        state.user = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(getAuthGoogleCallback.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    });
    builder.addCase(loginGoogle.fulfilled, (state, action) => {
      state.loadingGoogle = false;
    });
    builder.addMatcher(
      isAnyOf(
        loginUser.pending,
        getSessionUser.pending,
        getAuthGoogleCallback.pending,
        postRequestOTP.pending,
        postVerifyOTP.pending,
        getMe.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(loginGoogle.pending, (state, _) => {
      state.loadingGoogle = true;
      state.error = null;
    });
    builder.addMatcher(
      isAnyOf(loginUser.rejected, getAuthGoogleCallback.rejected, getMe.rejected),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    builder.addCase(getSessionUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logOutUser, setAuthUser, setEmail } = authSlice.actions;
export default authSlice.reducer;
