import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { api, user_api } from "../api";
import {
  CampaignUpdate,
  CampaignView,
  CreateDonation,
  DonationResult,
  DonationView,
  PublicDonation,
} from "@/types/fundraising";

interface FundraisingState {
  campaigns: CampaignView[] | null;
  campaign: CampaignView | null;
  donors: PublicDonation[];
  donorsHasMore: boolean;
  messages: PublicDonation[];
  messagesHasMore: boolean;
  updates: CampaignUpdate[];
  myDonations: DonationView[];
  myDonationsHasMore: boolean;
  donationResult: DonationResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: FundraisingState = {
  campaigns: null,
  campaign: null,
  donors: [],
  donorsHasMore: false,
  messages: [],
  messagesHasMore: false,
  updates: [],
  myDonations: [],
  myDonationsHasMore: false,
  donationResult: null,
  loading: false,
  error: null,
};

/* ---------- publik ---------- */

export const getCampaigns = createAsyncThunk("fundraising.campaigns", async () => {
  const res = await api.get("/campaigns");
  return res.data.campaigns as CampaignView[];
});

export const getCampaignDetail = createAsyncThunk(
  "fundraising.campaignDetail",
  async (slug: string) => {
    const res = await api.get(`/campaigns/${slug}`);
    return res.data.campaign as CampaignView;
  }
);

export const getCampaignDonors = createAsyncThunk(
  "fundraising.campaignDonors",
  async (params: { slug: string; page?: number }) => {
    const res = await api.get(`/campaigns/${params.slug}/donors`, {
      params: { page: params.page ?? 1 },
    });
    return res.data as {
      donations: PublicDonation[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getCampaignMessages = createAsyncThunk(
  "fundraising.campaignMessages",
  async (params: { slug: string; page?: number }) => {
    const res = await api.get(`/campaigns/${params.slug}/messages`, {
      params: { page: params.page ?? 1 },
    });
    return res.data as {
      messages: PublicDonation[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getCampaignUpdates = createAsyncThunk(
  "fundraising.campaignUpdates",
  async (slug: string) => {
    const res = await api.get(`/campaigns/${slug}/updates`);
    return (res.data.updates ?? []) as CampaignUpdate[];
  }
);

/* ---------- anggota ---------- */

export const createDonation = createAsyncThunk(
  "fundraising.createDonation",
  async (data: CreateDonation) => {
    const res = await user_api.post("/donations", data);
    return res.data as DonationResult;
  }
);

export const getMyDonations = createAsyncThunk(
  "fundraising.myDonations",
  async (page: number = 1) => {
    const res = await user_api.get("/donations", { params: { page } });
    return res.data as {
      donations: DonationView[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getMyDonation = createAsyncThunk(
  "fundraising.myDonation",
  async (publicId: string) => {
    const res = await user_api.get(`/donations/${publicId}`);
    return res.data as DonationResult;
  }
);

export const fundraisingSlice = createSlice({
  name: "fundraising",
  initialState,
  reducers: {
    // Instruksi pembayaran dibuang setelah halaman status ditinggalkan, supaya
    // nomor rekening donasi lama tidak tertinggal di layar.
    clearDonationResult: (state) => {
      state.donationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCampaigns.fulfilled, (state, action) => {
      state.campaigns = action.payload;
      state.loading = false;
    });
    builder.addCase(getCampaignDetail.fulfilled, (state, action) => {
      state.campaign = action.payload;
      state.loading = false;
    });
    builder.addCase(getCampaignDonors.fulfilled, (state, action) => {
      state.donors =
        action.payload.page <= 1
          ? action.payload.donations
          : [...state.donors, ...action.payload.donations];
      state.donorsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getCampaignMessages.fulfilled, (state, action) => {
      state.messages =
        action.payload.page <= 1
          ? action.payload.messages
          : [...state.messages, ...action.payload.messages];
      state.messagesHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getCampaignUpdates.fulfilled, (state, action) => {
      state.updates = action.payload;
      state.loading = false;
    });
    builder.addCase(createDonation.fulfilled, (state, action) => {
      state.donationResult = action.payload;
      state.loading = false;
    });
    builder.addCase(getMyDonations.fulfilled, (state, action) => {
      state.myDonations =
        action.payload.page <= 1
          ? action.payload.donations
          : [...state.myDonations, ...action.payload.donations];
      state.myDonationsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getMyDonation.fulfilled, (state, action) => {
      state.donationResult = action.payload;
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getCampaigns.pending,
        getCampaignDetail.pending,
        getCampaignDonors.pending,
        getCampaignMessages.pending,
        getCampaignUpdates.pending,
        createDonation.pending,
        getMyDonations.pending,
        getMyDonation.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getCampaigns.rejected,
        getCampaignDetail.rejected,
        getCampaignDonors.rejected,
        getCampaignMessages.rejected,
        getCampaignUpdates.rejected,
        createDonation.rejected,
        getMyDonations.rejected,
        getMyDonation.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { clearDonationResult } = fundraisingSlice.actions;
export default fundraisingSlice.reducer;
