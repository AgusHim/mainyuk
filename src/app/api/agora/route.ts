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
    // Note: uid can be string or number. RtcTokenBuilder supports both buildTokenWithUid (for int) and buildTokenWithAccount (for string)
    // Since our uid is likely a string (username), we use buildTokenWithAccount (or buildTokenWithUid in older versions which accepted string, 
    // but in v4+ typically 'Account' is for string UIDs). 
    // Let's check if uid is numeric or string.

    let token;
    try {
        // If uid is a pure number, treat as int uid, else string user account
        if (/^\d+$/.test(uid)) {
            token = RtcTokenBuilder.buildTokenWithUid(
                appID,
                appCertificate,
                channelName,
                parseInt(uid),
                role,
                expirationTimeInSeconds,
                privilegeExpiredTs
            );
        } else {
            token = RtcTokenBuilder.buildTokenWithUserAccount(
                appID,
                appCertificate,
                channelName,
                uid,
                role,
                expirationTimeInSeconds,
                privilegeExpiredTs
            );
        }
    } catch (err) {
        console.error("Error generating token:", err);
        return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }

    return NextResponse.json({ token });
}
