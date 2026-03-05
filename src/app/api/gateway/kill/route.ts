import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function POST(request: Request) {
    if (!oc.isConfigured()) {
        return NextResponse.json({ success: false, message: 'Gateway not configured' }, { status: 503 });
    }

    try {
        const { sessionKey } = await request.json();

        if (!sessionKey) {
            return NextResponse.json({ success: false, message: 'sessionKey is required' }, { status: 400 });
        }

        const resp = await oc.processKill(sessionKey);
        return NextResponse.json({ success: true, response: resp });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
