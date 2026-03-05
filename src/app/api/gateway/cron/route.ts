import { NextResponse } from 'next/server';
import { validateConfig } from '@/lib/openclaw';

export async function GET() {
    const validation = validateConfig();
    if (!validation.valid) {
        return NextResponse.json({ 
            jobs: [], 
            configured: false,
            error: validation.error 
        });
    }

    // Note: cron list might not be available in all OpenClaw versions
    // For now, return empty array - implement if CLI supports it
    return NextResponse.json({ 
        jobs: [], 
        configured: true,
        note: 'Cron jobs not available via SSH bridge' 
    });
}
