import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { Like } from "@/types/like";

interface LikeState {
  data: Like[] | null;
  loading: boolean;
  error: string | null;
}
const initialState: LikeState = {
  data: null,
  loading: false,
  error: null,
};

export const getLikes = createAsyncThunk("like.index", async (query: any) => {
  const res = await axiosInstance.get("/comments/like", { params: query });
  return res.data;
});

export const postLike = createAsyncThunk("like.post", async (like: Like) => {
  const res = await axiosInstance.post("/comments/like", like);
  return res.data as Like;
});

export const deleteLike = createAsyncThunk(
  "like.delete",
  async (id: string) => {
    const res = await axiosInstance.delete(`/comments/like/${id}`);
    return res.data;
  }
);

export const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    addLike: (state, action) => {
      state.data?.push(action.payload as Like);
    },
    removeLike: (state, action) => {
      const index = state.data?.findIndex(
        (e) => e.comment_id == action.payload.comment_id
      );
      if (index !== undefined) {
        state.data?.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getLikes.fulfilled, (state, action) => {
      state.data = action.payload as Like[];
      state.loading = false;
    });
    builder.addCase(getLikes.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getLikes.rejected || postLike.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch data";
    });
    builder.addCase(postLike.fulfilled, (state, action) => {
      const index = state.data?.findIndex((e)=>e.comment_id == action.payload.comment_id);
      if(index !== undefined){
        state.data![index].id = action.payload.id;
      }
    });
  },
});

export const { addLike, removeLike } = likeSlice.actions;
export default likeSlice.reducer;
