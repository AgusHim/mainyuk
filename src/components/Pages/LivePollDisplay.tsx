"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useRef } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { getSessionUser } from "@/redux/slices/authSlice";
import { fetchActivePoll, fetchResults } from "@/redux/slices/pollSlice";
import { usePathname, useRouter } from "next/navigation";
import QRCode from "qrcode.react";
import { OptionResult } from "@/types/poll";

export default function LivePollDisplay({
    params,
}: {
    params: { slug: string };
}) {
    const dispatch = useAppDispatch();
    const event = useAppSelector((state) => state.event.event);
    const activePoll = useAppSelector((state) => state.poll.activePoll);
    const results = useAppSelector((state) => state.poll.results);
    const isLoading = useAppSelector((state) => state.event.loading);
    const router = useRouter();
    const pathname = usePathname() ?? "/";
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Auth + fetch event
    useEffect(() => {
        dispatch(getSessionUser())
            .unwrap()
            .then((value) => {
                if (value == null || value.role != "admin") {
                    router.replace(`/signin?redirectTo=${pathname}`);
                }
                dispatch(getEventDetail(params.slug));
            })
            .catch(console.error);
    }, []);

    // Poll active poll & results
    useEffect(() => {
        if (event?.id) {
            const pollFn = () => {
                dispatch(fetchActivePoll(event.id!)).then((action) => {
                    if (action.meta.requestStatus === "fulfilled") {
                        const poll = action.payload as { id: string };
                        dispatch(fetchResults(poll.id));
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

    const hostUrl = process.env.BASE_URL;
    const qrValue = `https://${hostUrl}/events/${params.slug}/poll`;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    // Max count for bar scaling
    const maxCount = results?.options
        ? Math.max(...results.options.map((o) => o.count), 1)
        : 1;

    return (
        <div className="min-h-screen max-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Left: QR Code */}
            <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-6 border-r border-white/10">
                <QRCode
                    value={qrValue}
                    size={200}
                    className="p-4 bg-white rounded-xl mb-6 shadow-lg"
                />
                <h2 className="text-lg text-white text-center font-light">
                    Gabung di <span className="font-extrabold">{hostUrl}</span>
                </h2>
                <p className="text-xl text-white text-center font-bold mt-1">
                    Kode: {event?.code}
                </p>
            </div>

            {/* Right: Poll display */}
            <div className="w-full md:w-3/4 flex flex-col items-center justify-center p-8">
                {!activePoll ? (
                    <div className="text-center">
                        <p className="text-6xl mb-4">📊</p>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Waiting for Poll
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Aktifkan poll dari dashboard untuk memulai
                        </p>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl">
                        {/* Poll header */}
                        <div className="mb-8 text-center">
                            <span className="inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-3">
                                ● Live
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                                {activePoll.title}
                            </h1>
                        </div>

                        {/* Word Cloud */}
                        {activePoll.type === "word_cloud" && results && (
                            <div className="flex flex-wrap justify-center gap-3 p-6">
                                {results.text_responses && results.text_responses.length > 0 ? (
                                    results.text_responses.map((r, i) => {
                                        const sizes = [
                                            "text-xl",
                                            "text-2xl",
                                            "text-3xl",
                                            "text-4xl",
                                            "text-5xl",
                                        ];
                                        const colors = [
                                            "text-blue-400",
                                            "text-green-400",
                                            "text-yellow-400",
                                            "text-purple-400",
                                            "text-pink-400",
                                            "text-cyan-400",
                                            "text-orange-400",
                                        ];
                                        return (
                                            <span
                                                key={i}
                                                className={`font-bold ${sizes[Math.floor(Math.random() * sizes.length)]
                                                    } ${colors[i % colors.length]} transition-all duration-500 animate-pulse`}
                                                style={{
                                                    animationDelay: `${i * 0.1}s`,
                                                    animationDuration: "3s",
                                                }}
                                            >
                                                {r.text_response}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 text-xl">
                                        Menunggu jawaban peserta...
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Ranking */}
                        {activePoll.type === "ranking" && results?.options && (
                            <div className="space-y-4">
                                {[...results.options]
                                    .sort((a, b) => b.count - a.count)
                                    .map((opt: OptionResult, i: number) => (
                                        <div key={opt.option_id} className="flex items-center gap-4">
                                            <span className="text-2xl font-bold text-white w-8 text-right">
                                                {i + 1}.
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-white font-semibold text-lg">
                                                        {opt.text}
                                                    </span>
                                                    <span className="text-gray-300 font-mono">
                                                        {opt.count}
                                                    </span>
                                                </div>
                                                <div className="w-full h-10 bg-white/10 rounded-xl overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-xl transition-all duration-700"
                                                        style={{
                                                            width: `${(opt.count / maxCount) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Quiz */}
                        {activePoll.type === "quiz" && results?.options && (
                            <div className="space-y-4">
                                {results.options.map((opt: OptionResult) => (
                                    <div key={opt.option_id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-white font-semibold text-lg flex items-center gap-2">
                                                {opt.text}
                                                {opt.is_correct && (
                                                    <span className="text-green-400 text-xl">✓</span>
                                                )}
                                            </span>
                                            <span className="text-gray-300 font-mono">
                                                {opt.count}
                                            </span>
                                        </div>
                                        <div className="w-full h-10 bg-white/10 rounded-xl overflow-hidden">
                                            <div
                                                className={`h-full rounded-xl transition-all duration-700 ${opt.is_correct
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                                        : "bg-gradient-to-r from-red-500/70 to-red-400/70"
                                                    }`}
                                                style={{
                                                    width: `${(opt.count / maxCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Vote count */}
                        {results && (
                            <p className="text-center text-gray-400 mt-8 text-lg">
                                {results.total_votes} respons
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
