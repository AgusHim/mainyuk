"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useRef, useState, useCallback } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import {
    fetchActivePoll,
    fetchResults,
    submitResponse,
} from "@/redux/slices/pollSlice";
import { OptionResult } from "@/types/poll";

export default function PollParticipantView({
    params,
}: {
    params: { slug: string };
}) {
    const dispatch = useAppDispatch();
    const event = useAppSelector((state) => state.event.event);
    const activePoll = useAppSelector((state) => state.poll.activePoll);
    const results = useAppSelector((state) => state.poll.results);
    const isLoading = useAppSelector((state) => state.event.loading);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [textInput, setTextInput] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [userId] = useState(
        () =>
            typeof window !== "undefined"
                ? localStorage.getItem("poll_user_id") ||
                (() => {
                    const id = crypto.randomUUID();
                    localStorage.setItem("poll_user_id", id);
                    return id;
                })()
                : "anon"
    );
    const [username, setUsername] = useState(
        () =>
            typeof window !== "undefined"
                ? localStorage.getItem("poll_username") || ""
                : ""
    );
    const [showNameInput, setShowNameInput] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Fetch event
    useEffect(() => {
        dispatch(getEventDetail(params.slug));
    }, [params.slug]);

    // Poll for active poll
    useEffect(() => {
        if (event?.id) {
            const pollFn = () => {
                dispatch(fetchActivePoll(event.id!)).then((action) => {
                    if (action.meta.requestStatus === "fulfilled") {
                        dispatch(fetchResults((action.payload as { id: string }).id));
                    }
                });
            };
            pollFn();
            intervalRef.current = setInterval(pollFn, 3000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [event?.id]);

    // Reset when poll changes
    useEffect(() => {
        setSubmitted(false);
        setSelectedOption(null);
        setTextInput("");
    }, [activePoll?.id]);

    // Check if user has name
    useEffect(() => {
        if (!username) setShowNameInput(true);
    }, []);

    const handleSaveName = useCallback(() => {
        if (username.trim()) {
            localStorage.setItem("poll_username", username.trim());
            setShowNameInput(false);
        }
    }, [username]);

    const handleSubmitWordCloud = async () => {
        if (!textInput.trim() || !activePoll) return;
        await dispatch(
            submitResponse({
                pollId: activePoll.id,
                data: {
                    user_id: userId,
                    username: username || "Anonim",
                    text_response: textInput.trim(),
                },
            })
        );
        setTextInput("");
        if (!activePoll.allow_multiple_answers) {
            setSubmitted(true);
        }
    };

    const handleSubmitOption = async (optionId: string) => {
        if (!activePoll) return;
        setSelectedOption(optionId);
        await dispatch(
            submitResponse({
                pollId: activePoll.id,
                data: {
                    user_id: userId,
                    username: username || "Anonim",
                    poll_option_id: optionId,
                },
            })
        );
        setSubmitted(true);
    };

    const maxCount = results?.options
        ? Math.max(...results.options.map((o) => o.count), 1)
        : 1;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500 text-lg">Memuat...</p>
            </div>
        );
    }

    // Name input
    if (showNameInput) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <p className="text-5xl mb-3">👋</p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Selamat datang!
                        </h1>
                        <p className="text-gray-500 mt-1">Masukkan nama kamu dulu ya</p>
                    </div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nama kamu..."
                        className="w-full rounded-xl border border-gray-200 py-4 px-5 text-lg text-center text-gray-900 outline-none focus:border-primary mb-4"
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                        autoFocus
                    />
                    <button
                        onClick={handleSaveName}
                        disabled={!username.trim()}
                        className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg disabled:opacity-50 transition-all hover:bg-primary/90"
                    >
                        Lanjut
                    </button>
                </div>
            </div>
        );
    }

    // Waiting for poll
    if (!activePoll) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-6xl mb-4 animate-bounce">📊</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Menunggu Poll...
                    </h2>
                    <p className="text-gray-500">
                        Poll akan muncul saat admin mengaktifkannya
                    </p>
                    <p className="text-sm text-gray-400 mt-4">
                        Event: {event?.title}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
            <div className="max-w-lg mx-auto p-6 pt-10">
                {/* Poll title */}
                <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-3">
                        ● Live
                    </span>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {activePoll.title}
                    </h1>
                </div>

                {/* Word Cloud Input */}
                {activePoll.type === "word_cloud" && !submitted && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Ketik jawaban kamu..."
                            className="w-full rounded-xl border-2 border-gray-200 py-4 px-5 text-lg text-gray-900 outline-none focus:border-primary transition-colors"
                            onKeyDown={(e) => e.key === "Enter" && handleSubmitWordCloud()}
                            autoFocus
                        />
                        <button
                            onClick={handleSubmitWordCloud}
                            disabled={!textInput.trim()}
                            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg disabled:opacity-50 transition-all hover:bg-primary/90"
                        >
                            Kirim
                        </button>
                    </div>
                )}

                {/* Word Cloud Submitted */}
                {activePoll.type === "word_cloud" && submitted && (
                    <div className="text-center py-8">
                        <p className="text-5xl mb-3">✅</p>
                        <p className="text-lg font-medium text-gray-900">Terkirim!</p>
                        <p className="text-gray-500 text-sm mt-1">
                            Jawaban kamu sudah diterima
                        </p>
                    </div>
                )}

                {/* Quiz / Ranking Options */}
                {(activePoll.type === "quiz" || activePoll.type === "ranking") &&
                    !submitted && (
                        <div className="space-y-3">
                            {activePoll.options.map((opt, i) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSubmitOption(opt.id)}
                                    className={`w-full text-left py-4 px-5 rounded-xl border-2 transition-all text-lg font-medium ${selectedOption === opt.id
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-gray-200 text-gray-900 hover:border-primary/50 hover:bg-primary/5"
                                        }`}
                                >
                                    <span className="inline-block w-8 h-8 rounded-lg bg-gray-100 text-center leading-8 text-sm font-bold mr-3 text-gray-600">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    )}

                {/* Submitted voting */}
                {(activePoll.type === "quiz" || activePoll.type === "ranking") &&
                    submitted && (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <p className="text-5xl mb-2">✅</p>
                                <p className="text-lg font-medium text-gray-900">
                                    Vote kamu tercatat!
                                </p>
                            </div>

                            {/* Show results if allowed */}
                            {activePoll.show_results && results?.options && (
                                <div className="space-y-3 mt-6">
                                    <p className="text-sm text-gray-500 text-center">
                                        {results.total_votes} respons
                                    </p>
                                    {results.options.map((opt: OptionResult) => {
                                        const pct =
                                            results.total_votes > 0
                                                ? (opt.count / results.total_votes) * 100
                                                : 0;
                                        return (
                                            <div key={opt.option_id}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span
                                                        className={`font-medium ${selectedOption === opt.option_id
                                                                ? "text-primary"
                                                                : "text-gray-700"
                                                            }`}
                                                    >
                                                        {opt.text}
                                                        {activePoll.type === "quiz" && opt.is_correct && (
                                                            <span className="ml-1 text-green-500">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {pct.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${activePoll.type === "quiz" && opt.is_correct
                                                                ? "bg-green-500"
                                                                : selectedOption === opt.option_id
                                                                    ? "bg-primary"
                                                                    : "bg-gray-300"
                                                            }`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                {/* User identity */}
                <p className="text-center text-gray-400 text-xs mt-8">
                    Voting sebagai <span className="font-medium">{username || "Anonim"}</span>
                </p>
            </div>
        </div>
    );
}
