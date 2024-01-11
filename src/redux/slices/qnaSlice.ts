import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { Comment, CreateComment } from "@/types/comment";

interface QnaState {
  data: Comment[] | null;
  loading: boolean;
  error: string | null;
  sortBy:string;
}
const initialState: QnaState = {
  data: null,
  loading: false,
  error: null,
  sortBy:'Terbaru',
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
    addComment: (state, action) => {
      state.data?.push(action.payload as Comment);
    },
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
    sortComment: (state, action) => {
      state.sortBy = action.payload;
      if(state.data!.length > 2){
        const sortBy = state.sortBy;
        
        if(sortBy == "Terbaru"){
          const sortedList = [...state.data!].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
          state.data = sortedList;
        }
        if(sortBy == "Pertama"){
          const sortedList = [...state.data!].sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
          state.data = sortedList;
        }
        if(sortBy == "Populer"){
          const sortedList = [...state.data!].sort((a, b) => a.like - b.like);
          state.data = sortedList;
        }
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

export const { addComment, increaseLike, decreaseLike, sortComment } = qnaSlice.actions;
export default qnaSlice.reducer;
