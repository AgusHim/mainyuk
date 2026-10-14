import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api, api } from "../api";
import {
  CreateInstagramPost,
  InstagramPost,
  InstagramSyncResult,
  UpdateInstagramPost,
} from "@/types/instagram";

// Satu berkas memuat dua sisi: dinding publik untuk landing page, dan daftar
// lengkap untuk /dashboard/instagram. Pola yang sama dipakai missionSlice.
interface InstagramState {
  data: InstagramPost[] | null;
  adminPosts: InstagramPost[] | null;
  // Postingan yang sedang disunting di dialog. null berarti mode "tambah".
  adminPost: InstagramPost | null;
  loading: boolean;
  error: string | null;
}

const initialState: InstagramState = {
  data: null,
  adminPosts: null,
  adminPost: null,
  loading: false,
  error: null,
};

/* ---------- sisi publik ---------- */

export const getInstagramPosts = createAsyncThunk("instagram.list", async () => {
  const res = await api.get("/instagram/posts");
  return res.data.posts as InstagramPost[];
});

/* ---------- sisi pengurus ---------- */

export const getAdminInstagramPosts = createAsyncThunk(
  "instagram.adminList",
  async () => {
    const res = await admin_api.get("/instagram/posts");
    return res.data.posts as InstagramPost[];
  }
);

export const createInstagramPost = createAsyncThunk(
  "instagram.create",
  async (data: CreateInstagramPost) => {
    const res = await admin_api.post("/instagram/posts", data);
    return res.data.post as InstagramPost;
  }
);

export const updateInstagramPost = createAsyncThunk(
  "instagram.update",
  async (params: { id: string; data: UpdateInstagramPost }) => {
    const res = await admin_api.put(`/instagram/posts/${params.id}`, params.data);
    return res.data.post as InstagramPost;
  }
);

export const deleteInstagramPost = createAsyncThunk(
  "instagram.delete",
  async (id: string) => {
    await admin_api.delete(`/instagram/posts/${id}`);
    return id;
  }
);

// Tanpa INSTAGRAM_ACCESS_TOKEN server menjawab 400 dengan pesan yang bisa
// dibaca pengurus; thunk-nya sengaja tidak menelannya supaya toast menampilkan
// pesan aslinya.
export const syncInstagramPosts = createAsyncThunk(
  "instagram.sync",
  async () => {
    const res = await admin_api.post("/instagram/sync");
    return res.data.sync as InstagramSyncResult;
  }
);

export const instagramSlice = createSlice({
  name: "instagram",
  initialState,
  reducers: {
    setAdminPost: (state, action) => {
      state.adminPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInstagramPosts.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAdminInstagramPosts.fulfilled, (state, action) => {
      state.adminPosts = action.payload;
      state.loading = false;
    });
    builder.addCase(createInstagramPost.fulfilled, (state, action) => {
      state.adminPosts = [...(state.adminPosts ?? []), action.payload];
      state.loading = false;
    });
    builder.addCase(updateInstagramPost.fulfilled, (state, action) => {
      state.adminPosts = (state.adminPosts ?? []).map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
      state.loading = false;
    });
    builder.addCase(deleteInstagramPost.fulfilled, (state, action) => {
      state.adminPosts = (state.adminPosts ?? []).filter(
        (post) => post.id !== action.payload
      );
      state.loading = false;
    });

    // addCase di atas wajib mendahului addMatcher: RTK menolak matcher yang
    // ditambahkan sebelum case.
    builder.addMatcher(
      isAnyOf(
        getInstagramPosts.pending,
        getAdminInstagramPosts.pending,
        createInstagramPost.pending,
        updateInstagramPost.pending,
        deleteInstagramPost.pending,
        syncInstagramPosts.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getInstagramPosts.rejected,
        getAdminInstagramPosts.rejected,
        createInstagramPost.rejected,
        updateInstagramPost.rejected,
        deleteInstagramPost.rejected,
        syncInstagramPosts.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { setAdminPost } = instagramSlice.actions;
export default instagramSlice.reducer;
