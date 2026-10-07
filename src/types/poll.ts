export type PollType = "word_cloud" | "ranking" | "quiz";
export type PollStatus = "draft" | "active" | "closed";

export type PollOption = {
    id: string;
    poll_id?: string;
    text: string;
    is_correct: boolean;
    order_index: number;
};

export type PollResponse = {
    id?: string;
    poll_id: string;
    poll_option_id?: string | null;
    // Kosong untuk jawaban tamu — identitas hanya diisi server.
    user_id?: string | null;
    username: string;
    // True hanya bila jawaban berasal dari akun terautentikasi.
    is_verified?: boolean;
    text_response?: string | null;
    rank?: number | null;
    created_at?: string;
};

export type Poll = {
    id: string;
    event_id: string;
    title: string;
    type: PollType;
    status: PollStatus;
    allow_multiple_answers: boolean;
    show_results: boolean;
    order_index: number;
    options: PollOption[];
    created_at?: string;
};

export type CreatePoll = {
    event_id: string;
    title: string;
    type: PollType;
    allow_multiple_answers?: boolean;
    show_results?: boolean;
    options?: { text: string; is_correct?: boolean }[];
};

export type UpdatePoll = {
    title?: string;
    type?: PollType;
    allow_multiple_answers?: boolean;
    show_results?: boolean;
    options?: { text: string; is_correct?: boolean }[];
};

// Payload jawaban poll. `user_id` sengaja tidak ada: server menentukan
// identitas dari sesi, sehingga client tidak bisa mengaku sebagai akun lain.
export type SubmitPollResponse = {
    poll_option_id?: string | null;
    username: string;
    text_response?: string | null;
    rank?: number | null;
};

export type OptionResult = {
    option_id: string;
    text: string;
    is_correct: boolean;
    count: number;
    total_rank: number;
};

export type PollResults = {
    poll_id: string;
    type: PollType;
    total_votes: number;
    options: OptionResult[];
    text_responses: PollResponse[];
};

export type PollState = {
    polls: Poll[];
    activePoll: Poll | null;
    results: PollResults | null;
    loading: boolean;
    error: string | null;
};
