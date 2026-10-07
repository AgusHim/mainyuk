import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import {
  AdminDonationView,
  AuditLog,
  Campaign,
  CampaignStatus,
  CampaignUpdate,
  CampaignUpdateInput,
  CampaignView,
  ConfirmDonation,
  CreateCampaign,
  Donation,
  DonationFilter,
  ReportView,
  UpdateCampaign,
} from "@/types/fundraising";

interface CampaignAdminState {
  campaigns: CampaignView[] | null;
  campaign: CampaignView | null;
  donations: AdminDonationView[];
  donationsHasMore: boolean;
  report: ReportView | null;
  auditLogs: AuditLog[];
  auditHasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignAdminState = {
  campaigns: null,
  campaign: null,
  donations: [],
  donationsHasMore: false,
  report: null,
  auditLogs: [],
  auditHasMore: false,
  loading: false,
  error: null,
};

/* ---------- campaign ---------- */

export const getAdminCampaigns = createAsyncThunk(
  "campaignAdmin.list",
  async (status?: CampaignStatus | "") => {
    const res = await admin_api.get("/campaigns", {
      params: status ? { status } : undefined,
    });
    return res.data.campaigns as CampaignView[];
  }
);

export const createCampaign = createAsyncThunk(
  "campaignAdmin.create",
  async (data: CreateCampaign) => {
    const res = await admin_api.post("/campaigns", data);
    return res.data.campaign as Campaign;
  }
);

export const updateCampaign = createAsyncThunk(
  "campaignAdmin.update",
  async (params: { id: string; data: UpdateCampaign }) => {
    const res = await admin_api.put(`/campaigns/${params.id}`, params.data);
    return res.data.campaign as Campaign;
  }
);

export const setCampaignStatus = createAsyncThunk(
  "campaignAdmin.setStatus",
  async (params: { id: string; status: CampaignStatus; reason?: string }) => {
    const res = await admin_api.put(`/campaigns/${params.id}/status`, {
      status: params.status,
      reason: params.reason ?? "",
    });
    return res.data.campaign as Campaign;
  }
);

export const deleteCampaign = createAsyncThunk(
  "campaignAdmin.delete",
  async (id: string) => {
    await admin_api.delete(`/campaigns/${id}`);
    return id;
  }
);

export const getCampaignReport = createAsyncThunk(
  "campaignAdmin.report",
  async (id: string) => {
    const res = await admin_api.get(`/campaigns/${id}/report`);
    return res.data.report as ReportView;
  }
);

/* ---------- update campaign ---------- */

export const createCampaignUpdate = createAsyncThunk(
  "campaignAdmin.createUpdate",
  async (params: { campaignId: string; data: CampaignUpdateInput }) => {
    const res = await admin_api.post(
      `/campaigns/${params.campaignId}/updates`,
      params.data
    );
    return res.data.update as CampaignUpdate;
  }
);

export const updateCampaignUpdate = createAsyncThunk(
  "campaignAdmin.updateUpdate",
  async (params: { id: string; data: CampaignUpdateInput }) => {
    const res = await admin_api.put(`/campaign_updates/${params.id}`, params.data);
    return res.data.update as CampaignUpdate;
  }
);

export const deleteCampaignUpdate = createAsyncThunk(
  "campaignAdmin.deleteUpdate",
  async (id: string) => {
    await admin_api.delete(`/campaign_updates/${id}`);
    return id;
  }
);

/* ---------- donasi ---------- */

export const getAdminDonations = createAsyncThunk(
  "campaignAdmin.donations",
  async (filter: DonationFilter) => {
    const res = await admin_api.get("/donations", { params: filter });
    return res.data as {
      donations: AdminDonationView[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const confirmDonation = createAsyncThunk(
  "campaignAdmin.confirmDonation",
  async (params: { id: string; data: ConfirmDonation }) => {
    const res = await admin_api.put(
      `/donations/${params.id}/confirm`,
      params.data
    );
    return res.data.donation as Donation;
  }
);

export const rejectDonation = createAsyncThunk(
  "campaignAdmin.rejectDonation",
  async (params: { id: string; reason: string }) => {
    const res = await admin_api.put(`/donations/${params.id}/reject`, {
      reason: params.reason,
    });
    return res.data.donation as Donation;
  }
);

export const refundDonation = createAsyncThunk(
  "campaignAdmin.refundDonation",
  async (params: { id: string; reason: string }) => {
    const res = await admin_api.put(`/donations/${params.id}/refund`, {
      reason: params.reason,
    });
    return res.data.donation as Donation;
  }
);

export const moderateDonationMessage = createAsyncThunk(
  "campaignAdmin.moderateMessage",
  async (params: { id: string; decision: "approve" | "hide"; reason?: string }) => {
    const res = await admin_api.put(`/donations/${params.id}/message`, {
      decision: params.decision,
      reason: params.reason ?? "",
    });
    return res.data.donation as Donation;
  }
);

/* ---------- audit ---------- */

export const getAuditLogs = createAsyncThunk(
  "campaignAdmin.auditLogs",
  async (params: { entity_type?: string; entity_id?: string; page?: number }) => {
    const res = await admin_api.get("/audit_logs", { params });
    return res.data as {
      audit_logs: AuditLog[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

// replaceDonation menukar satu baris antrean dengan versi terbarunya, supaya
// tabel tidak perlu dimuat ulang setelah keputusan pengurus.
const replaceDonation = (
  donations: AdminDonationView[],
  updated: Donation
): AdminDonationView[] =>
  donations.map((row) =>
    row.id === updated.id ? { ...row, ...updated } : row
  );

export const campaignAdminSlice = createSlice({
  name: "campaignAdmin",
  initialState,
  reducers: {
    setAdminCampaign: (state, action) => {
      state.campaign = action.payload;
    },
    // Baris yang sudah diputuskan dikeluarkan dari antrean tanpa memuat ulang.
    removeDonationFromQueue: (state, action) => {
      state.donations = state.donations.filter(
        (donation) => donation.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminCampaigns.fulfilled, (state, action) => {
      state.campaigns = action.payload;
      state.loading = false;
    });
    builder.addCase(createCampaign.fulfilled, (state, action) => {
      state.campaigns = [
        ...(state.campaigns ?? []),
        { ...action.payload, raised_amount: 0, donor_count: 0, progress_percent: 0, is_open: false },
      ];
      state.loading = false;
    });
    builder.addCase(updateCampaign.fulfilled, (state, action) => {
      state.campaigns = (state.campaigns ?? []).map((campaign) =>
        campaign.id === action.payload.id
          ? { ...campaign, ...action.payload }
          : campaign
      );
      state.loading = false;
    });
    builder.addCase(setCampaignStatus.fulfilled, (state, action) => {
      state.campaigns = (state.campaigns ?? []).map((campaign) =>
        campaign.id === action.payload.id
          ? { ...campaign, ...action.payload }
          : campaign
      );
      if (state.campaign?.id === action.payload.id) {
        state.campaign = { ...state.campaign, ...action.payload };
      }
      state.loading = false;
    });
    builder.addCase(deleteCampaign.fulfilled, (state, action) => {
      state.campaigns = (state.campaigns ?? []).filter(
        (campaign) => campaign.id !== action.payload
      );
      state.loading = false;
    });
    builder.addCase(getCampaignReport.fulfilled, (state, action) => {
      state.report = action.payload;
      state.loading = false;
    });
    builder.addCase(createCampaignUpdate.fulfilled, (state, action) => {
      state.report = state.report
        ? { ...state.report, updates: [action.payload, ...(state.report.updates ?? [])] }
        : state.report;
      state.loading = false;
    });
    builder.addCase(updateCampaignUpdate.fulfilled, (state, action) => {
      state.report = state.report
        ? {
            ...state.report,
            updates: (state.report.updates ?? []).map((update) =>
              update.id === action.payload.id ? action.payload : update
            ),
          }
        : state.report;
      state.loading = false;
    });
    builder.addCase(deleteCampaignUpdate.fulfilled, (state, action) => {
      state.report = state.report
        ? {
            ...state.report,
            updates: (state.report.updates ?? []).filter(
              (update) => update.id !== action.payload
            ),
          }
        : state.report;
      state.loading = false;
    });
    builder.addCase(getAdminDonations.fulfilled, (state, action) => {
      state.donations =
        action.payload.page <= 1
          ? action.payload.donations
          : [...state.donations, ...action.payload.donations];
      state.donationsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(confirmDonation.fulfilled, (state, action) => {
      state.donations = replaceDonation(state.donations, action.payload);
      state.loading = false;
    });
    builder.addCase(rejectDonation.fulfilled, (state, action) => {
      state.donations = replaceDonation(state.donations, action.payload);
      state.loading = false;
    });
    builder.addCase(refundDonation.fulfilled, (state, action) => {
      state.donations = replaceDonation(state.donations, action.payload);
      state.loading = false;
    });
    builder.addCase(moderateDonationMessage.fulfilled, (state, action) => {
      state.donations = replaceDonation(state.donations, action.payload);
      state.loading = false;
    });
    builder.addCase(getAuditLogs.fulfilled, (state, action) => {
      state.auditLogs =
        action.payload.page <= 1
          ? action.payload.audit_logs
          : [...state.auditLogs, ...action.payload.audit_logs];
      state.auditHasMore = action.payload.has_more;
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAdminCampaigns.pending,
        createCampaign.pending,
        updateCampaign.pending,
        setCampaignStatus.pending,
        deleteCampaign.pending,
        getCampaignReport.pending,
        createCampaignUpdate.pending,
        updateCampaignUpdate.pending,
        deleteCampaignUpdate.pending,
        getAdminDonations.pending,
        confirmDonation.pending,
        rejectDonation.pending,
        refundDonation.pending,
        moderateDonationMessage.pending,
        getAuditLogs.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAdminCampaigns.rejected,
        createCampaign.rejected,
        updateCampaign.rejected,
        setCampaignStatus.rejected,
        deleteCampaign.rejected,
        getCampaignReport.rejected,
        createCampaignUpdate.rejected,
        updateCampaignUpdate.rejected,
        deleteCampaignUpdate.rejected,
        getAdminDonations.rejected,
        confirmDonation.rejected,
        rejectDonation.rejected,
        refundDonation.rejected,
        moderateDonationMessage.rejected,
        getAuditLogs.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { setAdminCampaign, removeDonationFromQueue } =
  campaignAdminSlice.actions;
export default campaignAdminSlice.reducer;
