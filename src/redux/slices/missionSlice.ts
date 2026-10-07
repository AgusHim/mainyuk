import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api, api, user_api } from "../api";
import {
  AdminClaimView,
  ClaimMission,
  ClaimStatus,
  ClaimView,
  CreateMission,
  Mission,
  MissionView,
  UpdateMission,
} from "@/types/mission";

interface MissionState {
  missions: MissionView[] | null;
  mission: MissionView | null;
  myClaims: ClaimView[];
  myClaimsHasMore: boolean;
  adminMissions: Mission[] | null;
  adminMission: Mission | null;
  claimsForReview: AdminClaimView[];
  claimsHasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: MissionState = {
  missions: null,
  mission: null,
  myClaims: [],
  myClaimsHasMore: false,
  adminMissions: null,
  adminMission: null,
  claimsForReview: [],
  claimsHasMore: false,
  loading: false,
  error: null,
};

/* ---------- sisi anggota ---------- */

export const getMissions = createAsyncThunk("mission.list", async () => {
  const res = await api.get("/missions");
  return res.data.missions as MissionView[];
});

export const getMissionDetail = createAsyncThunk(
  "mission.detail",
  async (id: string) => {
    const res = await api.get(`/missions/${id}`);
    return res.data.mission as MissionView;
  }
);

export const claimMission = createAsyncThunk(
  "mission.claim",
  async (params: { id: string; data: ClaimMission }) => {
    const res = await user_api.post(`/missions/${params.id}/claims`, params.data);
    return res.data.claim as ClaimView;
  }
);

export const getMyClaims = createAsyncThunk(
  "mission.myClaims",
  async (page: number = 1) => {
    const res = await user_api.get("/missions/claims", { params: { page } });
    return res.data as {
      claims: ClaimView[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

/* ---------- sisi pengurus ---------- */

export const getAdminMissions = createAsyncThunk(
  "mission.adminList",
  async () => {
    const res = await admin_api.get("/missions");
    return res.data.missions as Mission[];
  }
);

export const createMission = createAsyncThunk(
  "mission.create",
  async (data: CreateMission) => {
    const res = await admin_api.post("/missions", data);
    return res.data.mission as Mission;
  }
);

export const updateMission = createAsyncThunk(
  "mission.update",
  async (params: { id: string; data: UpdateMission }) => {
    const res = await admin_api.put(`/missions/${params.id}`, params.data);
    return res.data.mission as Mission;
  }
);

export const deleteMission = createAsyncThunk(
  "mission.delete",
  async (id: string) => {
    await admin_api.delete(`/missions/${id}`);
    return id;
  }
);

export const getClaimsForReview = createAsyncThunk(
  "mission.claimsForReview",
  async (params: { status?: ClaimStatus | ""; page?: number }) => {
    const res = await admin_api.get("/missions/claims", { params });
    return res.data as {
      claims: AdminClaimView[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const approveClaim = createAsyncThunk(
  "mission.approveClaim",
  async (params: { id: string; reason?: string }) => {
    const res = await admin_api.put(`/missions/claims/${params.id}/approve`, {
      reason: params.reason ?? "",
    });
    return res.data.claim as ClaimView;
  }
);

export const rejectClaim = createAsyncThunk(
  "mission.rejectClaim",
  async (params: { id: string; reason: string }) => {
    const res = await admin_api.put(`/missions/claims/${params.id}/reject`, {
      reason: params.reason,
    });
    return res.data.claim as ClaimView;
  }
);

export const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    setAdminMission: (state, action) => {
      state.adminMission = action.payload;
    },
    // Klaim yang sudah diputuskan dikeluarkan dari antrean tanpa perlu memuat
    // ulang seluruh halaman.
    removeClaimFromQueue: (state, action) => {
      state.claimsForReview = state.claimsForReview.filter(
        (claim) => claim.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMissions.fulfilled, (state, action) => {
      state.missions = action.payload;
      state.loading = false;
    });
    builder.addCase(getMissionDetail.fulfilled, (state, action) => {
      state.mission = action.payload;
      state.loading = false;
    });
    builder.addCase(getMyClaims.fulfilled, (state, action) => {
      state.myClaims =
        action.payload.page <= 1
          ? action.payload.claims
          : [...state.myClaims, ...action.payload.claims];
      state.myClaimsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getAdminMissions.fulfilled, (state, action) => {
      state.adminMissions = action.payload;
      state.loading = false;
    });
    builder.addCase(createMission.fulfilled, (state, action) => {
      state.adminMissions = [...(state.adminMissions ?? []), action.payload];
      state.loading = false;
    });
    builder.addCase(updateMission.fulfilled, (state, action) => {
      state.adminMissions = (state.adminMissions ?? []).map((mission) =>
        mission.id === action.payload.id ? action.payload : mission
      );
      state.loading = false;
    });
    builder.addCase(deleteMission.fulfilled, (state, action) => {
      state.adminMissions = (state.adminMissions ?? []).filter(
        (mission) => mission.id !== action.payload
      );
      state.loading = false;
    });
    builder.addCase(getClaimsForReview.fulfilled, (state, action) => {
      state.claimsForReview = action.payload.claims;
      state.claimsHasMore = action.payload.has_more;
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getMissions.pending,
        getMissionDetail.pending,
        claimMission.pending,
        getMyClaims.pending,
        getAdminMissions.pending,
        createMission.pending,
        updateMission.pending,
        deleteMission.pending,
        getClaimsForReview.pending,
        approveClaim.pending,
        rejectClaim.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getMissions.rejected,
        getMissionDetail.rejected,
        claimMission.rejected,
        getMyClaims.rejected,
        getAdminMissions.rejected,
        createMission.rejected,
        updateMission.rejected,
        deleteMission.rejected,
        getClaimsForReview.rejected,
        approveClaim.rejected,
        rejectClaim.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { setAdminMission, removeClaimFromQueue } = missionSlice.actions;
export default missionSlice.reducer;
