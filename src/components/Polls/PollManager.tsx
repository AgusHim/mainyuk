"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import {
    createPoll,
    fetchPollsByEvent,
    updatePoll,
    deletePoll,
    updatePollStatus,
    fetchResults,
} from "@/redux/slices/pollSlice";
import { Poll, PollType, CreatePoll, OptionResult } from "@/types/poll";

const TYPE_LABELS: Record<PollType, { label: string; icon: string }> = {
    word_cloud: { label: "Word Cloud", icon: "🌥️" },
    ranking: { label: "Ranking", icon: "📊" },
    quiz: { label: "Quiz", icon: "❓" },
};

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-gray-200 text-gray-700",
    active: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
};

// ============ CREATE POLL MODAL ============
function CreatePollModal({
    eventId,
    onClose,
    editPoll,
}: {
    eventId: string;
    onClose: () => void;
    editPoll?: Poll | null;
}) {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState(editPoll?.title ?? "");
    const [type, setType] = useState<PollType>(editPoll?.type ?? "quiz");
    const [allowMultiple, setAllowMultiple] = useState(
        editPoll?.allow_multiple_answers ?? false
    );
    const [showResults, setShowResults] = useState(
        editPoll?.show_results ?? true
    );
    const [options, setOptions] = useState<{ text: string; is_correct: boolean }[]>(
        editPoll?.options?.map((o) => ({ text: o.text, is_correct: o.is_correct })) ?? [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
        ]
    );

    const needsOptions = type === "ranking" || type === "quiz";

    const handleSubmit = async () => {
        if (!title.trim()) return;
        if (needsOptions && options.filter((o) => o.text.trim()).length < 2) return;

        const payload = {
            event_id: eventId,
            title,
            type,
            allow_multiple_answers: allowMultiple,
            show_results: showResults,
            options: needsOptions ? options.filter((o) => o.text.trim()) : undefined,
        };

        if (editPoll) {
            await dispatch(
                updatePoll({
                    id: editPoll.id,
                    data: {
                        title: payload.title,
                        type: payload.type,
                        allow_multiple_answers: payload.allow_multiple_answers,
                        show_results: payload.show_results,
                        options: payload.options,
                    },
                })
            );
        } else {
            await dispatch(createPoll(payload as CreatePoll));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-boxdark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-black dark:text-white mb-6">
                        {editPoll ? "Edit Poll" : "Buat Poll Baru"}
                    </h2>

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">
                            Judul Poll
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Siapa silent hero bulan ini?"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black dark:text-white outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                        />
                    </div>

                    {/* Type selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black dark:text-white mb-2">
                            Tipe Poll
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(TYPE_LABELS) as PollType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`py-3 px-2 rounded-xl text-center text-sm font-medium transition-all border-2 ${type === t
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-stroke dark:border-strokedark text-black dark:text-white hover:border-primary/50"
                                        }`}
                                >
                                    <span className="text-xl block mb-1">
                                        {TYPE_LABELS[t].icon}
                                    </span>
                                    {TYPE_LABELS[t].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options (for ranking & quiz) */}
                    {needsOptions && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Opsi Jawaban
                            </label>
                            <div className="space-y-2">
                                {options.map((opt, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => {
                                                const updated = [...options];
                                                updated[i] = { ...updated[i], text: e.target.value };
                                                setOptions(updated);
                                            }}
                                            placeholder={`Opsi ${i + 1}`}
                                            className="flex-1 rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm text-black dark:text-white outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                        />
                                        {type === "quiz" && (
                                            <label className="flex items-center gap-1 text-xs text-black dark:text-white cursor-pointer whitespace-nowrap">
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={opt.is_correct}
                                                    onChange={() => {
                                                        setOptions(
                                                            options.map((o, j) => ({
                                                                ...o,
                                                                is_correct: j === i,
                                                            }))
                                                        );
                                                    }}
                                                    className="accent-primary"
                                                />
                                                Benar
                                            </label>
                                        )}
                                        {options.length > 2 && (
                                            <button
                                                onClick={() =>
                                                    setOptions(options.filter((_, j) => j !== i))
                                                }
                                                className="text-red-500 hover:text-red-400 text-sm px-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() =>
                                        setOptions([...options, { text: "", is_correct: false }])
                                    }
                                    className="text-primary hover:text-primary/80 text-sm font-medium"
                                >
                                    + Tambah Opsi
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    <div className="mb-6 space-y-3">
                        {type === "word_cloud" && (
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allowMultiple}
                                    onChange={(e) => setAllowMultiple(e.target.checked)}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-sm text-black dark:text-white">
                                    Izinkan banyak jawaban
                                </span>
                            </label>
                        )}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showResults}
                                onChange={(e) => setShowResults(e.target.checked)}
                                className="accent-primary w-4 h-4"
                            />
                            <span className="text-sm text-black dark:text-white">
                                Tampilkan hasil ke peserta
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-stroke dark:border-strokedark text-black dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                        >
                            {editPoll ? "Simpan" : "Buat Poll"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============ RESULTS MODAL ============
function ResultsModal({
    poll,
    onClose,
}: {
    poll: Poll;
    onClose: () => void;
}) {
    const dispatch = useAppDispatch();
    const results = useAppSelector((state) => state.poll.results);

    useEffect(() => {
        dispatch(fetchResults(poll.id));
    }, [poll.id]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-boxdark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-black dark:text-white">
                            {TYPE_LABELS[poll.type].icon} Hasil: {poll.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    {!results ? (
                        <p className="text-center text-gray-500 py-8">Memuat...</p>
                    ) : results.total_votes === 0 ? (
                        <p className="text-center text-gray-500 py-8">Belum ada respons</p>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-500 mb-4">
                                Total respons: {results.total_votes}
                            </p>

                            {/* Word Cloud results */}
                            {poll.type === "word_cloud" && results.text_responses && (
                                <div className="flex flex-wrap gap-2">
                                    {results.text_responses.map((r, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                        >
                                            {r.text_response}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Ranking/Quiz results */}
                            {(poll.type === "ranking" || poll.type === "quiz") &&
                                results.options && (
                                    <div className="space-y-3">
                                        {[...results.options]
                                            .sort((a, b) => b.count - a.count)
                                            .map((opt: OptionResult) => {
                                                const pct =
                                                    results.total_votes > 0
                                                        ? (opt.count / results.total_votes) * 100
                                                        : 0;
                                                return (
                                                    <div key={opt.option_id}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-black dark:text-white font-medium">
                                                                {opt.text}
                                                                {poll.type === "quiz" && opt.is_correct && (
                                                                    <span className="ml-2 text-green-500">
                                                                        ✓ Benar
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {opt.count} ({pct.toFixed(0)}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-6 bg-gray-200 dark:bg-meta-4 rounded-lg overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-lg transition-all duration-500 ${poll.type === "quiz" && opt.is_correct
                                                                        ? "bg-green-500"
                                                                        : "bg-primary"
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
                </div>
            </div>
        </div>
    );
}

// ============ MAIN POLL MANAGER ============
export default function PollManager({ eventId }: { eventId: string }) {
    const dispatch = useAppDispatch();
    const polls = useAppSelector((state) => state.poll.polls);
    const loading = useAppSelector((state) => state.poll.loading);
    const [showCreate, setShowCreate] = useState(false);
    const [editPoll, setEditPoll] = useState<Poll | null>(null);
    const [resultsPoll, setResultsPoll] = useState<Poll | null>(null);

    useEffect(() => {
        if (eventId) {
            dispatch(fetchPollsByEvent(eventId));
        }
    }, [eventId]);

    const handleStatusToggle = (poll: Poll) => {
        const newStatus = poll.status === "active" ? "closed" : "active";
        dispatch(updatePollStatus({ id: poll.id, status: newStatus }));
    };

    const handleDelete = (id: string) => {
        if (confirm("Hapus poll ini?")) {
            dispatch(deletePoll(id));
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
                <p className="text-3xl text-black dark:text-white font-semibold">
                    Polls
                </p>
                <button
                    onClick={() => {
                        setEditPoll(null);
                        setShowCreate(true);
                    }}
                    className="w-full ml-auto mb-3 sm:w-50 inline-flex items-center justify-center gap-2.5 rounded-lg bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 border-2 border-black"
                    style={{ boxShadow: "5px 5px 0px 0px #000000" }}
                >
                    + Tambah Poll
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 py-8">Memuat...</p>
            ) : polls.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-boxdark rounded-xl border border-stroke dark:border-strokedark">
                    <p className="text-5xl mb-4">📊</p>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Belum ada poll
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                        Buat poll untuk interaksi dengan peserta
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {polls.map((poll) => (
                        <div
                            key={poll.id}
                            className="bg-white dark:bg-boxdark rounded-xl border border-stroke dark:border-strokedark p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">
                                            {TYPE_LABELS[poll.type].icon}
                                        </span>
                                        <h3 className="font-bold text-black dark:text-white">
                                            {poll.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[poll.status]
                                                }`}
                                        >
                                            {poll.status === "draft"
                                                ? "Draft"
                                                : poll.status === "active"
                                                    ? "Aktif"
                                                    : "Selesai"}
                                        </span>
                                        <span className="text-gray-400">
                                            {TYPE_LABELS[poll.type].label}
                                        </span>
                                        {poll.options && poll.options.length > 0 && (
                                            <span className="text-gray-400">
                                                · {poll.options.length} opsi
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* Start/Stop */}
                                    <button
                                        onClick={() => handleStatusToggle(poll)}
                                        className={`p-2 rounded-lg text-sm transition-colors ${poll.status === "active"
                                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                : "bg-green-100 text-green-600 hover:bg-green-200"
                                            }`}
                                        title={
                                            poll.status === "active" ? "Stop Poll" : "Start Poll"
                                        }
                                    >
                                        {poll.status === "active" ? "⏹" : "▶️"}
                                    </button>
                                    {/* Results */}
                                    <button
                                        onClick={() => setResultsPoll(poll)}
                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm transition-colors"
                                        title="Lihat Hasil"
                                    >
                                        📊
                                    </button>
                                    {/* Edit */}
                                    <button
                                        onClick={() => {
                                            setEditPoll(poll);
                                            setShowCreate(true);
                                        }}
                                        className="p-2 rounded-lg bg-gray-100 dark:bg-meta-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition-colors"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(poll.id)}
                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-sm transition-colors"
                                        title="Hapus"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showCreate && (
                <CreatePollModal
                    eventId={eventId}
                    editPoll={editPoll}
                    onClose={() => {
                        setShowCreate(false);
                        setEditPoll(null);
                        dispatch(fetchPollsByEvent(eventId));
                    }}
                />
            )}

            {/* Results Modal */}
            {resultsPoll && (
                <ResultsModal
                    poll={resultsPoll}
                    onClose={() => setResultsPoll(null)}
                />
            )}
        </div>
    );
}
