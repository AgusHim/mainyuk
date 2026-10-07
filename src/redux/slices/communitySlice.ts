import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { api, user_api } from "../api";
import { OwnProfile, PublicProfile, UpdateProfile } from "@/types/community";

interface CommunityState {
  profile: OwnProfile | null;
  publicProfile: PublicProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  profile: null,
  publicProfile: null,
  loading: false,
  error: null,
};

export const getMyProfile = createAsyncThunk(
  "community.profile",
  async () => {
    const res = await user_api.get("/community/profile");
    return res.data.profile as OwnProfile;
  }
);

export const updateMyProfile = createAsyncThunk(
  "community.updateProfile",
  async (data: UpdateProfile) => {
    const res = await user_api.put("/community/profile", data);
    return res.data.profile as OwnProfile;
  }
);

export const getPublicProfile = createAsyncThunk(
  "community.publicProfile",
  async (publicId: string) => {
    const res = await api.get(`/community/profiles/${publicId}`);
    return res.data.profile as PublicProfile;
  }
);

export const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(updateMyProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(getPublicProfile.fulfilled, (state, action) => {
      state.publicProfile = action.payload;
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getMyProfile.pending,
        updateMyProfile.pending,
        getPublicProfile.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getMyProfile.rejected,
        updateMyProfile.rejected,
        getPublicProfile.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export default communitySlice.reducer;
