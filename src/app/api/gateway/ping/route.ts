import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function POST(request: Request) {
    if (!oc.isConfigured()) {
        return NextResponse.json({ success: false, message: 'Gateway not configured' });
    }

    try {
        const { sessionKey, message } = await request.json();
        const targetSession = sessionKey || 'agent:main:main';
        const pingMessage = message || 'heartbeat: check status';

        const resp = await oc.sessionsSend(targetSession, pingMessage, 5);
        return NextResponse.json({ success: true, response: resp });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
