import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function GET() {
    if (!oc.isConfigured()) {
        return NextResponse.json({ sessions: [], configured: false });
    }

    try {
        const sessions = await oc.sessionsList({
            kinds: ['subagent', 'acp'],
            activeMinutes: 10,
            limit: 50,
        });
        return NextResponse.json({ sessions, configured: true });
    } catch (err: any) {
        return NextResponse.json({ sessions: [], error: err.message });
    }
}
