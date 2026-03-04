import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';

export async function GET() {
    if (!oc.isConfigured()) {
        return NextResponse.json({
            connected: false,
            message: 'Gateway token not configured. Set OPENCLAW_TOKEN in .env.local',
        });
    }

    try {
        const status = await oc.gatewayStatus();
        const health = await oc.gatewayHealth();
        return NextResponse.json({ connected: true, status, health });
    } catch (err: any) {
        return NextResponse.json({
            connected: false,
            error: err.message,
        });
    }
}
