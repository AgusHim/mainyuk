import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, admin_api } from "../api";
import {
    Poll,
    PollResults,
    PollState,
    CreatePoll,
    UpdatePoll,
    SubmitPollResponse,
} from "@/types/poll";

// ============ ASYNC THUNKS ============

export const createPoll = createAsyncThunk(
    "poll/create",
    async (data: CreatePoll) => {
        const res = await admin_api.post("/polls", data);
        return res.data as Poll;
    }
);

export const fetchPollsByEvent = createAsyncThunk(
    "poll/fetchByEvent",
    async (eventId: string) => {
        const res = await admin_api.get(`/polls/event/${eventId}`);
        return res.data as Poll[];
    }
);

export const fetchPoll = createAsyncThunk(
    "poll/fetch",
    async (id: string) => {
        const res = await api.get(`/polls/${id}`);
        return res.data as Poll;
    }
);

export const updatePoll = createAsyncThunk(
    "poll/update",
    async ({ id, data }: { id: string; data: UpdatePoll }) => {
        const res = await admin_api.put(`/polls/${id}`, data);
        return res.data as Poll;
    }
);

export const deletePoll = createAsyncThunk(
    "poll/delete",
    async (id: string) => {
        await admin_api.delete(`/polls/${id}`);
        return id;
    }
);

export const updatePollStatus = createAsyncThunk(
    "poll/updateStatus",
    async ({ id, status }: { id: string; status: string }) => {
        await admin_api.put(`/polls/${id}/status`, { status });
        return { id, status };
    }
);

export const submitResponse = createAsyncThunk(
    "poll/submitResponse",
    async ({ pollId, data }: { pollId: string; data: SubmitPollResponse }) => {
        const res = await api.post(`/polls/${pollId}/respond`, data);
        return res.data;
    }
);

export const fetchResults = createAsyncThunk(
    "poll/fetchResults",
    async (pollId: string) => {
        const res = await api.get(`/polls/${pollId}/results`);
        return res.data as PollResults;
    }
);

export const fetchActivePoll = createAsyncThunk(
    "poll/fetchActive",
    async (eventId: string) => {
        const res = await api.get(`/polls/event/${eventId}/active`);
        return res.data as Poll;
    }
);

// ============ SLICE ============

const initialState: PollState = {
    polls: [],
    activePoll: null,
    results: null,
    loading: false,
    error: null,
};

export const pollSlice = createSlice({
    name: "poll",
    initialState,
    reducers: {
        clearActivePoll: (state) => {
            state.activePoll = null;
            state.results = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // createPoll
        builder.addCase(createPoll.fulfilled, (state, action) => {
            state.polls.push(action.payload);
            state.loading = false;
        });

        // fetchPollsByEvent
        builder.addCase(fetchPollsByEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPollsByEvent.fulfilled, (state, action) => {
            state.polls = action.payload ?? [];
            state.loading = false;
        });
        builder.addCase(fetchPollsByEvent.rejected, (state) => {
            state.loading = false;
        });

        // fetchPoll
        builder.addCase(fetchPoll.fulfilled, (state, action) => {
            state.activePoll = action.payload;
        });

        // updatePoll
        builder.addCase(updatePoll.fulfilled, (state, action) => {
            const idx = state.polls.findIndex((p) => p.id === action.payload.id);
            if (idx >= 0) state.polls[idx] = action.payload;
            state.loading = false;
        });

        // deletePoll
        builder.addCase(deletePoll.fulfilled, (state, action) => {
            state.polls = state.polls.filter((p) => p.id !== action.payload);
        });

        // updatePollStatus
        builder.addCase(updatePollStatus.fulfilled, (state, action) => {
            const { id, status } = action.payload;
            const poll = state.polls.find((p) => p.id === id);
            if (poll) {
                poll.status = status as Poll["status"];
            }
            // If activating, set activePoll
            if (status === "active" && poll) {
                state.activePoll = poll;
            }
            // If closing, clear if it was the active one
            if (status === "closed" && state.activePoll?.id === id) {
                state.activePoll = null;
            }
        });

        // fetchResults
        builder.addCase(fetchResults.fulfilled, (state, action) => {
            state.results = action.payload;
        });

        // fetchActivePoll
        builder.addCase(fetchActivePoll.fulfilled, (state, action) => {
            state.activePoll = action.payload;
        });
        builder.addCase(fetchActivePoll.rejected, (state) => {
            state.activePoll = null;
        });
    },
});

export const { clearActivePoll, clearError } = pollSlice.actions;
export default pollSlice.reducer;
