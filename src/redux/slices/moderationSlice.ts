import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import { PublicProfile } from "@/types/community";
import {
  DecideContent,
  DecideReport,
  ModerationAuditLog,
  ModerationReport,
  Report,
  ReportStatus,
  RestrictAccount,
  Thread,
  ThreadStatus,
} from "@/types/thread";

interface ModerationState {
  reports: ModerationReport[];
  reportsHasMore: boolean;
  reviewThreads: Thread[];
  reviewThreadsHasMore: boolean;
  restrictedAccounts: PublicProfile[];
  restrictedHasMore: boolean;
  auditLogs: ModerationAuditLog[];
  auditHasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ModerationState = {
  reports: [],
  reportsHasMore: false,
  reviewThreads: [],
  reviewThreadsHasMore: false,
  restrictedAccounts: [],
  restrictedHasMore: false,
  auditLogs: [],
  auditHasMore: false,
  loading: false,
  error: null,
};

/* ---------- antrean laporan ---------- */

export const getModerationReports = createAsyncThunk(
  "moderation.reports",
  async (params: { status?: ReportStatus | ""; page?: number }) => {
    const res = await admin_api.get("/moderation/reports", { params });
    return res.data as {
      reports: ModerationReport[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const actionReport = createAsyncThunk(
  "moderation.actionReport",
  async (params: { id: string; data: DecideReport }) => {
    const res = await admin_api.put(
      `/moderation/reports/${params.id}/action`,
      params.data
    );
    return res.data.report as Report;
  }
);

export const dismissReport = createAsyncThunk(
  "moderation.dismissReport",
  async (params: { id: string; data: DecideContent }) => {
    const res = await admin_api.put(
      `/moderation/reports/${params.id}/dismiss`,
      params.data
    );
    return res.data.report as Report;
  }
);

/* ---------- pemeriksaan konten ---------- */

export const getModerationThreads = createAsyncThunk(
  "moderation.threads",
  async (params: { status?: ThreadStatus | ""; page?: number }) => {
    const res = await admin_api.get("/moderation/threads", { params });
    return res.data as {
      threads: Thread[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

// `action` adalah salah satu dari "hide", "restore", atau "delete". Server
// menolak perpindahan status yang tidak sah lewat tabel transisinya sendiri.
export const moderateThread = createAsyncThunk(
  "moderation.moderateThread",
  async (params: { id: string; action: string; data: DecideContent }) => {
    const res = await admin_api.put(
      `/moderation/threads/${params.id}/${params.action}`,
      params.data
    );
    return res.data.thread as Thread;
  }
);

export const moderateThreadComment = createAsyncThunk(
  "moderation.moderateComment",
  async (params: { id: string; action: string; data: DecideContent }) => {
    const res = await admin_api.put(
      `/moderation/thread_comments/${params.id}/${params.action}`,
      params.data
    );
    return res.data.comment as { public_id: string };
  }
);

/* ---------- akun dibatasi ---------- */

export const getRestrictedAccounts = createAsyncThunk(
  "moderation.restricted",
  async (page: number = 1) => {
    const res = await admin_api.get("/moderation/accounts/restricted", {
      params: { page },
    });
    return res.data as {
      accounts: PublicProfile[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const restrictAccount = createAsyncThunk(
  "moderation.restrict",
  async (params: { publicId: string; data: RestrictAccount }) => {
    const res = await admin_api.put(
      `/moderation/accounts/${params.publicId}/restrict`,
      params.data
    );
    return res.data.account as PublicProfile;
  }
);

/* ---------- riwayat keputusan ---------- */

export const getModerationAuditLogs = createAsyncThunk(
  "moderation.auditLogs",
  async (page: number = 1) => {
    const res = await admin_api.get("/moderation/audit_logs", {
      params: { page },
    });
    return res.data as {
      audit_logs: ModerationAuditLog[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const moderationSlice = createSlice({
  name: "moderation",
  initialState,
  reducers: {
    // Laporan yang sudah diputuskan dikeluarkan dari antrean tanpa perlu
    // memuat ulang seluruh halaman.
    removeReportFromQueue: (state, action) => {
      state.reports = state.reports.filter(
        (row) => row.report.id !== action.payload
      );
    },
    removeRestrictedAccount: (state, action) => {
      state.restrictedAccounts = state.restrictedAccounts.filter(
        (account) => account.public_id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getModerationReports.fulfilled, (state, action) => {
      state.reports = action.payload.reports;
      state.reportsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getModerationThreads.fulfilled, (state, action) => {
      state.reviewThreads = action.payload.threads;
      state.reviewThreadsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getRestrictedAccounts.fulfilled, (state, action) => {
      state.restrictedAccounts =
        action.payload.page <= 1
          ? action.payload.accounts
          : [...state.restrictedAccounts, ...action.payload.accounts];
      state.restrictedHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getModerationAuditLogs.fulfilled, (state, action) => {
      state.auditLogs =
        action.payload.page <= 1
          ? action.payload.audit_logs
          : [...state.auditLogs, ...action.payload.audit_logs];
      state.auditHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(restrictAccount.fulfilled, (state, action) => {
      state.restrictedAccounts = [
        action.payload,
        ...state.restrictedAccounts.filter(
          (account) => account.public_id !== action.payload.public_id
        ),
      ];
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getModerationReports.pending,
        actionReport.pending,
        dismissReport.pending,
        getModerationThreads.pending,
        moderateThread.pending,
        moderateThreadComment.pending,
        getRestrictedAccounts.pending,
        restrictAccount.pending,
        getModerationAuditLogs.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getModerationReports.rejected,
        actionReport.rejected,
        dismissReport.rejected,
        getModerationThreads.rejected,
        moderateThread.rejected,
        moderateThreadComment.rejected,
        getRestrictedAccounts.rejected,
        restrictAccount.rejected,
        getModerationAuditLogs.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { removeReportFromQueue, removeRestrictedAccount } =
  moderationSlice.actions;
export default moderationSlice.reducer;
