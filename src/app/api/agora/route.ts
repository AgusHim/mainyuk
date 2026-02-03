import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const channelName = searchParams.get("channelName");
    const uid = searchParams.get("uid");

    if (!channelName || !uid) {
        return NextResponse.json({ error: "Missing channelName or uid" }, { status: 400 });
    }

    const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
        return NextResponse.json({ error: "Agora credentials missing in server environment" }, { status: 500 });
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build the token
    // We always use buildTokenWithUserAccount to ensure consistency with the client
    // which treats the UID as a string (username).

    let token;
    try {
        token = RtcTokenBuilder.buildTokenWithUserAccount(
            appID,
            appCertificate,
            channelName,
            uid,
            role,
            expirationTimeInSeconds,
            privilegeExpiredTs
        );
    } catch (err) {
        console.error("Error generating token:", err);
        return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }

    return NextResponse.json({ token });
}
