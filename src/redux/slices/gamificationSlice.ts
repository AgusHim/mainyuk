import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api, api, user_api } from "../api";
import {
  AdjustXP,
  LeaderboardPage,
  LeaderboardPeriod,
  LevelRule,
  UpdateXPRule,
  XPLedgerEntry,
  XPRule,
  XPSummary,
} from "@/types/gamification";

interface GamificationState {
  summary: XPSummary | null;
  history: XPLedgerEntry[];
  historyHasMore: boolean;
  leaderboard: LeaderboardPage | null;
  levelRules: LevelRule[] | null;
  xpRules: XPRule[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: GamificationState = {
  summary: null,
  history: [],
  historyHasMore: false,
  leaderboard: null,
  levelRules: null,
  xpRules: null,
  loading: false,
  error: null,
};

export const getXPSummary = createAsyncThunk("gamification.summary", async () => {
  const res = await user_api.get("/xp");
  return res.data.summary as XPSummary;
});

export const getXPHistory = createAsyncThunk(
  "gamification.history",
  async (page: number = 1) => {
    const res = await user_api.get("/xp/history", { params: { page } });
    return res.data as {
      entries: XPLedgerEntry[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getLeaderboard = createAsyncThunk(
  "gamification.leaderboard",
  async (params: { period?: LeaderboardPeriod; page?: number }) => {
    const res = await api.get("/leaderboard", { params });
    return res.data as LeaderboardPage;
  }
);

export const getLevelRules = createAsyncThunk(
  "gamification.levelRules",
  async () => {
    const res = await admin_api.get("/level_rules");
    return res.data.rules as LevelRule[];
  }
);

export const getXPRules = createAsyncThunk("gamification.xpRules", async () => {
  const res = await admin_api.get("/xp/rules");
  return res.data.rules as XPRule[];
});

export const updateXPRule = createAsyncThunk(
  "gamification.updateXPRule",
  async (params: { source_type: string; data: UpdateXPRule }) => {
    const res = await admin_api.put(
      `/xp/rules/${params.source_type}`,
      params.data
    );
    return res.data.rule as XPRule;
  }
);

export const adjustXP = createAsyncThunk(
  "gamification.adjustXP",
  async (data: AdjustXP) => {
    const res = await admin_api.post("/xp/adjustments", data);
    return res.data.entry as XPLedgerEntry;
  }
);

export const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getXPSummary.fulfilled, (state, action) => {
      state.summary = action.payload;
      state.loading = false;
    });
    builder.addCase(getXPHistory.fulfilled, (state, action) => {
      // Halaman pertama mengganti daftar; halaman berikutnya menambah.
      state.history =
        action.payload.page <= 1
          ? action.payload.entries
          : [...state.history, ...action.payload.entries];
      state.historyHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getLeaderboard.fulfilled, (state, action) => {
      state.leaderboard = action.payload;
      state.loading = false;
    });
    builder.addCase(getLevelRules.fulfilled, (state, action) => {
      state.levelRules = action.payload;
      state.loading = false;
    });
    builder.addCase(getXPRules.fulfilled, (state, action) => {
      state.xpRules = action.payload;
      state.loading = false;
    });
    builder.addCase(updateXPRule.fulfilled, (state, action) => {
      state.xpRules = (state.xpRules ?? []).map((rule) =>
        rule.source_type === action.payload.source_type ? action.payload : rule
      );
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getXPSummary.pending,
        getXPHistory.pending,
        getLeaderboard.pending,
        getLevelRules.pending,
        getXPRules.pending,
        updateXPRule.pending,
        adjustXP.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getXPSummary.rejected,
        getXPHistory.rejected,
        getLeaderboard.rejected,
        getLevelRules.rejected,
        getXPRules.rejected,
        updateXPRule.rejected,
        adjustXP.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export default gamificationSlice.reducer;
