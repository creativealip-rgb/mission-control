import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function GET() {
    if (!oc.isConfigured()) {
        return NextResponse.json({ jobs: [], configured: false });
    }

    try {
        const jobs = await oc.cronList();
        return NextResponse.json({ jobs, configured: true });
    } catch (err: any) {
        return NextResponse.json({ jobs: [], error: err.message });
    }
}
