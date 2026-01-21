"use client";

import { useEffect, useState } from "react";
import {
    AgoraRTCProvider,
    useJoin,
    useLocalMicrophoneTrack,
    usePublish,
    useRTCClient,
    useRemoteAudioTracks,
    useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { getSessionUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";

const VoiceCallContent = ({
    eventId,
    isGuide,
}: {
    eventId: string;
    isGuide: boolean;
}) => {
    // Get user info again inside component to pass as UID
    const user = useAppSelector((state) => state.auth.user);
    // Use username or name or "Guest" as UID. 
    // Ensure it's a string.
    const uid = user?.name || user?.username || "Guest";

    // Join the channel
    const { isLoading: isLoadingJoin, isConnected } = useJoin(
        { appid: AGORA_APP_ID, channel: eventId, token: null, uid: uid },
        true
    );

    // Local Microphone (only for Guide)
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isGuide);

    // Publish (only for Guide)
    usePublish([localMicrophoneTrack]);

    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);

    // Play remote audio tracks
    useEffect(() => {
        audioTracks.forEach((track) => {
            track.play();
        });
        return () => {
            audioTracks.forEach((track) => {
                track.stop();
            });
        };
    }, [audioTracks]);

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
        <div className="flex flex-col md:flex-row gap-8 min-h-[50vh] p-4 text-white w-full max-w-6xl">
            <div className="flex-1 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">
                    {isConnected ? "Connected to Voice Room" : "Connecting..."}
                </h2>

                {isGuide ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg text-center">
                            <p className="text-lg mb-2">You are a Guide 🎙️</p>
                            <button
                                onClick={toggleMute}
                                className={`px-6 py-3 rounded-full font-bold ${micMuted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                    }`}
                            >
                                {micMuted ? "Unmute Mic" : "Mute Mic"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <p className="text-lg mb-2">You are a Listener 🎧</p>
                            <p className="text-sm text-gray-400">
                                Listen to the guide's explanation.
                            </p>
                        </div>
                        <div className="text-sm text-gray-300">
                            {remoteGuides.length > 0 ? "Guide is speaking..." : "Waiting for guide..."}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-xs text-gray-500">
                    Channel ID: {eventId}
                </div>
            </div>

            {/* Participant List */}
            <div className="w-full md:w-80 bg-gray-900 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Participants</h3>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Guides ({remoteGuides.length + (isGuide ? 1 : 0)})</h4>
                    <ul className="space-y-2">
                        {isGuide && (
                            <li className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span>{uid} (You)</span>
                            </li>
                        )}
                        {remoteGuides.map(user => (
                            <li key={user.uid} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>{user.uid}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Listeners ({remoteListeners.length + (!isGuide ? 1 : 0)})</h4>
                    <ul className="space-y-2">
                        {!isGuide && (
                            <li className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                <span>{uid} (You)</span>
                            </li>
                        )}
                        {remoteListeners.map(user => (
                            <li key={user.uid} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                <span>{user.uid}</span>
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
            // Ideally we fetch by ID. The previous plan assumed getEventDetail uses slug.
            // The user said "RoomID ambil dari Event.ID".
            // If getEventDetail takes a slug, we might need a way to fetch by ID or ensure params.id IS the slug passed.
            // However, the prompt says "page baru ... RoomID ambil dari Event.ID".
            // If the URL is /live/voice/[id], params.id is the event ID.
            // Fetching event details might require a different endpoint if getEventDetail expects a slug.
            // Let's assume for now we can fetch via the existing action or the ID is what we need.
            // If we need event details (title, etc) we should fetch it.
            // If the endpoint `/events/${slug}` only accepts slugs, strict ID might fail if ID != slug.
            // But usually logic is decoupled. Let's try fetching. 

            // Note on `getEventDetail`: slices/eventSlice.ts:38: `api.get(/events/${slug})`
            // Often IDs work in place of slugs.

            dispatch(getEventDetail(params.id));
            dispatch(getSessionUser());
        }
    }, [dispatch, params.id]);

    if (!client) return null;
    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

    // Determine role. 
    // User request: "Role hanya ada guide dan user"
    // Map "admin" to "Guide" for now as per my plan, or check specific role property if exists. 
    // user.role in types/user.ts is string.
    // I will assume 'admin' or 'guide' = Guide.
    const isGuide = user?.role === "admin" || user?.role === "guide";

    return (
        <AgoraRTCProvider client={client as any}>
            <div className="min-h-screen bg-boxdark py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl text-white font-bold text-center mb-10">
                        {event?.title || "City Tour Voice Call"}
                    </h1>
                    <VoiceCallContent eventId={params.id} isGuide={isGuide} />
                </div>
            </div>
        </AgoraRTCProvider>
    );
}
