import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function GET() {
    if (!oc.isConfigured()) {
        return NextResponse.json({ agents: [], configured: false });
    }

    try {
        const agents = await oc.agentsList();
        return NextResponse.json({ agents, configured: true });
    } catch (err: any) {
        return NextResponse.json({ agents: [], error: err.message });
    }
}
