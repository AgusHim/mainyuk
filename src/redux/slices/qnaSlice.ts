import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { Comment, CreateComment } from "@/types/comment";

interface QnaState {
  data: Comment[] | null;
  loading: boolean;
  error: string | null;
}
const initialState: QnaState = {
  data: null,
  loading: false,
  error: null,
};

export const getComments = createAsyncThunk("comments.index", async () => {
  const res = await axiosInstance.get("/comments");
  return res.data;
});

export const postComment = createAsyncThunk(
  "comments.post",
  async (comment: CreateComment) => {
    const res = await axiosInstance.post("/comments", comment);
    return res.data;
  }
);

export const qnaSlice = createSlice({
  name: "qna",
  initialState,
  reducers: {
    increaseLike: (state, action) => {
      const index = state.data?.findIndex((item) => item.id === action.payload);
      if (index !== undefined) {
        state.data![index].like = state.data![index].like + 1;
      }
    },
    decreaseLike: (state, action) => {
      const index = state.data?.findIndex((item) => item.id === action.payload);
      if (index !== undefined) {
        state.data![index].like = state.data![index].like - 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.data = action.payload as Comment[];
      state.loading = false;
    });
    builder.addCase(getComments.pending || postComment.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getComments.rejected || postComment.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    builder.addCase(postComment.fulfilled, (state, action) => {
      state.data?.push(action.payload as Comment);
      state.loading = false;
    });
  },
});

export const { increaseLike, decreaseLike } = qnaSlice.actions;
export default qnaSlice.reducer;
