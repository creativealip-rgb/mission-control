import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function POST(request: Request) {
    if (!oc.isConfigured()) {
        return NextResponse.json({ success: false, message: 'Gateway not configured' }, { status: 503 });
    }

    try {
        const { sessionKey, message } = await request.json();

        if (!sessionKey || !message) {
            return NextResponse.json({ success: false, message: 'sessionKey and message are required' }, { status: 400 });
        }

        const resp = await oc.sessionsSend(sessionKey, message, 10);
        return NextResponse.json({ success: true, response: resp });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
