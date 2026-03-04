import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { action } = await request.json();

    // Set local SQLite flag
    try {
        db.prepare(`
      CREATE TABLE IF NOT EXISTS system_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

        const isPaused = action === 'pause';
        db.prepare(`
      INSERT OR REPLACE INTO system_state (key, value, updated_at)
      VALUES ('paused', ?, CURRENT_TIMESTAMP)
    `).run(isPaused ? 'true' : 'false');
    } catch { }

    // Also try to steer via OpenClaw if configured
    if (oc.isConfigured() && action === 'pause') {
        try {
            await oc.subagentsSteer('agent:main:subagent:*', 'PAUSE');
        } catch { }
    }

    return NextResponse.json({
        success: true,
        paused: action === 'pause',
    });
}

export async function GET() {
    try {
        db.prepare(`
      CREATE TABLE IF NOT EXISTS system_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

        const result = db.prepare("SELECT value FROM system_state WHERE key = 'paused'").get() as { value: string } | undefined;
        return NextResponse.json({ paused: result?.value === 'true' });
    } catch {
        return NextResponse.json({ paused: false });
    }
}
