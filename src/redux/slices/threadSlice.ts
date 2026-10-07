import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { api, user_api } from "../api";
import {
  CreateReport,
  CreateThread,
  CreateThreadComment,
  SharePrefs,
  Thread,
  ThreadComment,
  ThreadSort,
  UpdateSharePrefs,
} from "@/types/thread";

interface ThreadState {
  threads: Thread[] | null;
  threadsHasMore: boolean;
  thread: Thread | null;
  comments: ThreadComment[];
  commentsHasMore: boolean;
  sharePrefs: SharePrefs | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  threads: null,
  threadsHasMore: false,
  thread: null,
  comments: [],
  commentsHasMore: false,
  sharePrefs: null,
  loading: false,
  error: null,
};

/* ---------- jalur publik ---------- */

export const getThreads = createAsyncThunk(
  "thread.list",
  async (params: { sort?: ThreadSort; page?: number }) => {
    const res = await api.get("/threads", { params });
    return res.data as {
      threads: Thread[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getThreadDetail = createAsyncThunk(
  "thread.detail",
  async (publicId: string) => {
    const res = await api.get(`/threads/${publicId}`);
    return res.data.thread as Thread;
  }
);

export const getThreadComments = createAsyncThunk(
  "thread.comments",
  async (params: { publicId: string; page?: number }) => {
    const res = await api.get(`/threads/${params.publicId}/comments`, {
      params: { page: params.page },
    });
    return res.data as {
      comments: ThreadComment[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

/* ---------- aksi anggota ---------- */

export const createThread = createAsyncThunk(
  "thread.create",
  async (data: CreateThread) => {
    const res = await user_api.post("/threads", data);
    return res.data.thread as Thread;
  }
);

export const deleteThread = createAsyncThunk(
  "thread.delete",
  async (publicId: string) => {
    await user_api.delete(`/threads/${publicId}`);
    return publicId;
  }
);

export const createThreadComment = createAsyncThunk(
  "thread.createComment",
  async (params: { publicId: string; data: CreateThreadComment }) => {
    const res = await user_api.post(
      `/threads/${params.publicId}/comments`,
      params.data
    );
    return res.data.comment as ThreadComment;
  }
);

export const deleteThreadComment = createAsyncThunk(
  "thread.deleteComment",
  async (params: { publicId: string; commentPublicId: string }) => {
    await user_api.delete(
      `/threads/${params.publicId}/comments/${params.commentPublicId}`
    );
    return params.commentPublicId;
  }
);

export const reactToThread = createAsyncThunk(
  "thread.react",
  async (publicId: string) => {
    await user_api.put(`/threads/${publicId}/reaction`);
    return publicId;
  }
);

export const unreactToThread = createAsyncThunk(
  "thread.unreact",
  async (publicId: string) => {
    await user_api.delete(`/threads/${publicId}/reaction`);
    return publicId;
  }
);

export const createReport = createAsyncThunk(
  "thread.report",
  async (data: CreateReport) => {
    await user_api.post("/threads/reports", data);
    return data;
  }
);

/* ---------- preferensi berbagi aktivitas ---------- */

export const getMySharePrefs = createAsyncThunk(
  "thread.sharePrefs",
  async () => {
    const res = await user_api.get("/community/share_prefs");
    return res.data.share_prefs as SharePrefs;
  }
);

export const updateMySharePrefs = createAsyncThunk(
  "thread.updateSharePrefs",
  async (data: UpdateSharePrefs) => {
    const res = await user_api.put("/community/share_prefs", data);
    return res.data.share_prefs as SharePrefs;
  }
);

// Menyesuaikan reaksi pada daftar dan detail sekaligus, supaya keduanya tidak
// pernah menampilkan angka yang berbeda setelah satu tombol ditekan.
const setReaction = (
  state: ThreadState,
  publicId: string,
  reacted: boolean
) => {
  const adjust = (thread: Thread): Thread =>
    thread.public_id === publicId
      ? {
          ...thread,
          reacted,
          reaction_count: Math.max(
            thread.reaction_count + (reacted ? 1 : -1),
            0
          ),
        }
      : thread;

  if (state.threads) {
    state.threads = state.threads.map(adjust);
  }
  if (state.thread) {
    state.thread = adjust(state.thread);
  }
};

export const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    // Dipakai setelah reaksi berhasil, supaya angka di layar tidak menunggu
    // pemuatan ulang. Tidak ada rollback: interceptor axios sudah menampilkan
    // galatnya, dan pemuatan ulang berikutnya mengembalikan angka sebenarnya.
    applyReaction: (state, action) => {
      setReaction(state, action.payload as string, true);
    },
    applyUnreact: (state, action) => {
      setReaction(state, action.payload as string, false);
    },
    // Thread yang dihapus dikeluarkan dari daftar tanpa memuat ulang halaman.
    removeThreadFromList: (state, action) => {
      state.threads = (state.threads ?? []).filter(
        (thread) => thread.public_id !== action.payload
      );
    },
    removeCommentFromList: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.public_id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getThreads.fulfilled, (state, action) => {
      state.threads =
        action.payload.page <= 1
          ? action.payload.threads
          : [...(state.threads ?? []), ...action.payload.threads];
      state.threadsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getThreadDetail.fulfilled, (state, action) => {
      state.thread = action.payload;
      state.loading = false;
    });
    builder.addCase(getThreadComments.fulfilled, (state, action) => {
      state.comments =
        action.payload.page <= 1
          ? action.payload.comments
          : [...state.comments, ...action.payload.comments];
      state.commentsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(createThread.fulfilled, (state, action) => {
      state.threads = [action.payload, ...(state.threads ?? [])];
      state.loading = false;
    });
    builder.addCase(deleteThread.fulfilled, (state, action) => {
      state.threads = (state.threads ?? []).filter(
        (thread) => thread.public_id !== action.payload
      );
      if (state.thread?.public_id === action.payload) {
        state.thread = null;
      }
      state.loading = false;
    });
    builder.addCase(createThreadComment.fulfilled, (state, action) => {
      state.comments = [...state.comments, action.payload];
      if (state.thread) {
        state.thread = {
          ...state.thread,
          comment_count: state.thread.comment_count + 1,
        };
      }
      state.loading = false;
    });
    builder.addCase(deleteThreadComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.public_id !== action.payload
      );
      if (state.thread) {
        state.thread = {
          ...state.thread,
          comment_count: Math.max(state.thread.comment_count - 1, 0),
        };
      }
      state.loading = false;
    });
    builder.addCase(getMySharePrefs.fulfilled, (state, action) => {
      state.sharePrefs = action.payload;
      state.loading = false;
    });
    builder.addCase(updateMySharePrefs.fulfilled, (state, action) => {
      state.sharePrefs = action.payload;
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getThreads.pending,
        getThreadDetail.pending,
        getThreadComments.pending,
        createThread.pending,
        deleteThread.pending,
        createThreadComment.pending,
        deleteThreadComment.pending,
        reactToThread.pending,
        unreactToThread.pending,
        createReport.pending,
        getMySharePrefs.pending,
        updateMySharePrefs.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getThreads.rejected,
        getThreadDetail.rejected,
        getThreadComments.rejected,
        createThread.rejected,
        deleteThread.rejected,
        createThreadComment.rejected,
        deleteThreadComment.rejected,
        reactToThread.rejected,
        unreactToThread.rejected,
        createReport.rejected,
        getMySharePrefs.rejected,
        updateMySharePrefs.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const {
  applyReaction,
  applyUnreact,
  removeThreadFromList,
  removeCommentFromList,
} = threadSlice.actions;
export default threadSlice.reducer;
