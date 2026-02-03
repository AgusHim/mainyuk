"use client";

import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/layout/MainLayout";
import { useEffect, useState } from "react";
import {
    AgoraRTCProvider,
    useJoin,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteAudioTracks,
    useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { getSessionUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Event } from "@/types/event";
import { formatStrToDateTime } from "@/utils/convert";

const AGORA_APP_ID = process.env.NEXT_AGORA_APP_ID || "";

const VoiceCallContent = ({
    eventId,
    isGuide,
    event,
}: {
    eventId: string;
    isGuide: boolean;
    event: Event | null;
}) => {
    // Get user info again inside component to pass as UID
    const user = useAppSelector((state) => state.auth.user);
    // Use username or name or "Guest" as UID. 
    // Ensure it's a string.
    const uid = user?.username || "Guest";

    // State for joining/leaving the channel
    const [active, setActive] = useState(false);

    // Join the channel only when active is true
    const { isLoading: isLoadingJoin, isConnected } = useJoin(
        { appid: AGORA_APP_ID, channel: eventId, token: null, uid: uid },
        active
    );

    // Local Microphone (only for Guide)
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isGuide && active);

    // Publish (only for Guide)
    usePublish([localMicrophoneTrack]);

    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);

    // Play remote audio tracks
    useEffect(() => {
        if (!active) return;
        audioTracks.forEach((track) => {
            track.play();
        });
        return () => {
            audioTracks.forEach((track) => {
                track.stop();
            });
        };
    }, [active, audioTracks]);

    const [micMuted, setMicMuted] = useState(false);

    const toggleMute = () => {
        if (localMicrophoneTrack) {
            localMicrophoneTrack.setMuted(!micMuted);
            setMicMuted(!micMuted);
        }
    };

    // Filter users by role
    // Guides: remote users with audio + yourself if you are a guide
    // Listeners: remote users without audio + yourself if you are a listener

    // Remote Guides
    const remoteGuides = remoteUsers.filter(u => u.hasAudio);
    // Remote Listeners
    const remoteListeners = remoteUsers.filter(u => !u.hasAudio);

    return (
        <div className="flex flex-col justify-start gap-8 min-h-[50vh] p-4 w-full max-w-7xl">
            {/* Event Detail Card */}
            <div className="w-full h-fit bg-yellow-300 border-2 border-black rounded-xl shadow-custom p-4">
                {event ? (
                    <div className="flex flex-row gap-4">
                        <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-black">
                            <img
                                src={event.image_url || "/images/logo/yn_logo.png"}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-black text-lg leading-tight mb-2">{event.title}</h4>
                            {event.speaker && (
                                <p className="text-sm text-black mb-1">
                                    <span className="font-semibold">Speaker:</span> {event.speaker}
                                </p>
                            )}
                            {event.start_at && (
                                <p className="text-sm text-black mb-1">
                                    <span className="font-semibold">Date:</span> {formatStrToDateTime(event.start_at, "EEEE, dd MMM yyyy")}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-black">Loading event info...</div>
                )}
            </div>

            {/* Main Controls Card */}
            <div className="flex-1 flex flex-col items-center bg-yellow-300 border-2 border-black rounded-xl shadow-custom p-8">
                <h2 className="text-2xl font-bold mb-4 text-black">
                    {isConnected ? "Connected" : "Ready to Join ?"}
                </h2>

                {!active ? (
                    <button
                        onClick={() => setActive(true)}
                        className="px-8 py-3 rounded-xl font-bold border-2 border-black shadow-custom transition-all active:translate-x-1 active:translate-y-1 active:shadow-none bg-green-500 hover:bg-green-400 text-white"
                    >
                        {isGuide ? "Start Voice" : "Join Voice"}
                    </button>
                ) : (
                    <>
                        {isGuide ? (
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="p-6 bg-gray-50 rounded-lg text-center border-2 border-black w-full max-w-md">
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={toggleMute}
                                            className={`px-6 py-3 rounded-xl font-bold border-2 border-black shadow-custom transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${micMuted ? "bg-gray-500 hover:bg-gray-400 text-white" : "bg-blue-500 hover:bg-blue-400 text-white"
                                                }`}
                                        >
                                            {micMuted ? "Unmute" : "Mute"}
                                        </button>
                                        <button
                                            onClick={() => setActive(false)}
                                            className="px-6 py-3 rounded-xl font-bold border-2 border-black shadow-custom transition-all active:translate-x-1 active:translate-y-1 active:shadow-none bg-red-500 hover:bg-red-400 text-white"
                                        >
                                            End Voice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="p-6 bg-gray-50 rounded-lg border-2 border-black w-full max-w-md text-center">
                                    <div className="text-sm text-gray-600 font-medium mb-4">
                                        {remoteGuides.length > 0 ? "Guide is speaking..." : "Waiting for guide..."}
                                    </div>
                                    <button
                                        onClick={() => setActive(false)}
                                        className="px-6 py-3 rounded-xl font-bold border-2 border-black shadow-custom transition-all active:translate-x-1 active:translate-y-1 active:shadow-none bg-red-500 hover:bg-red-400 text-white"
                                    >
                                        Leave Voice
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Participant List Card */}
            <div className="w-full h-fit bg-yellow-300 border-2 border-black rounded-xl shadow-custom p-4">
                <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2 text-black">Participants</h3>

                <div className="mb-6">
                    <h4 className="text-sm font-bold text-black uppercase mb-2">Guides ({remoteGuides.length + (isGuide ? 1 : 0)})</h4>
                    <ul className="space-y-2">
                        {isGuide && (
                            <li className="flex items-center gap-2 p-2 bg-yellow-200 border-2 border-black rounded-lg">
                                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse border border-black"></span>
                                <span className="text-black font-medium">{uid} (You)</span>
                            </li>
                        )}
                        {remoteGuides.map(user => (
                            <li key={user.uid} className="flex items-center gap-2 p-2 bg-yellow-200 border-2 border-black rounded-lg">
                                <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span>
                                <span className="text-black font-medium">{user.uid}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-black uppercase mb-2">Listeners ({remoteListeners.length + (!isGuide ? 1 : 0)})</h4>
                    <ul className="space-y-2">
                        {!isGuide && (
                            <li className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg">
                                <span className="w-3 h-3 rounded-full bg-gray-400 border border-black"></span>
                                <span className="text-black">{uid} (You)</span>
                            </li>
                        )}
                        {remoteListeners.map(user => (
                            <li key={user.uid} className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg">
                                <span className="w-3 h-3 rounded-full bg-gray-400 border border-black"></span>
                                <span className="text-black">{user.uid}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default function VoiceCallPage({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const event = useAppSelector((state) => state.event.event);
    const user = useAppSelector((state) => state.auth.user);
    const loading = useAppSelector((state) => state.event.loading) || useAppSelector((state) => state.auth.loading);

    const [client, setClient] = useState<IAgoraRTCClient | null>(null);

    useEffect(() => {
        // Initialize Agora Client
        const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setClient(agoraClient);
    }, []);

    useEffect(() => {
        if (params.id) {
            dispatch(getEventDetail(params.id)).then((res: any) => {
                if (res.error || !res.payload) {
                    router.push("/events");
                }
            });
            dispatch(getSessionUser());
        }
    }, [dispatch, params.id, router]);

    if (!client) return null;

    // Note: MainLayout should always be rendered if possible, but if we need auth/loading we might wait.
    // However, for consistency with other pages, we can render layout with loading state inside.

    // Determine role. 
    const isGuide = user?.role === "admin" || user?.role === "guide";

    return (
        <MainLayout>
            <CommonHeader title={event?.title || "City Tour Voice Call"} />
            <div className="flex flex-col items-center justify-start p-4">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <AgoraRTCProvider client={client as any}>
                        <VoiceCallContent eventId={params.id} isGuide={isGuide} event={event} />
                    </AgoraRTCProvider>
                )}
            </div>
        </MainLayout>
    );
}
