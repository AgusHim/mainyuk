import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { api } from "../api";
import { CreateFeedback, Feedback } from "@/types/feedback";

interface FeedbackState {
  data: Feedback[]|null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState= {
  data:null,
  loading:false,
  error:null
};

export const getFeedback = createAsyncThunk("feedback", async (_, thunk) => {
  const res = await api.get('/feedback');
  return res.data;
});

export const postFeedback = createAsyncThunk(
    "feedback.post",
    async (feedback: CreateFeedback) => {
      const res = await api.post("/feedback", feedback);
      return res.data;
    }
);

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getFeedback.fulfilled, (state, action) => {
      state.data = action.payload as Feedback[];
      state.loading = false;
    });
    builder.addCase(postFeedback.fulfilled, (state, action) => {
      state.data = [action.payload as Feedback, ...(state.data ?? [])];
      state.loading = false;
    });
    // `a.pending || b.pending` hanya mendaftarkan action pertama (keduanya
    // objek truthy), sehingga action kedua tidak pernah ditangani.
    builder.addMatcher(
      isAnyOf(getFeedback.pending, postFeedback.pending),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      isAnyOf(getFeedback.rejected, postFeedback.rejected),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
    
  },
});

export default feedbackSlice.reducer;
