import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';
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

    // Also try to pause via OpenClaw if configured
    const validation = validateConfig();
    if (validation.valid && action === 'pause') {
        try {
            await openclawBridge.pauseAgent('agent:main:subagent:*');
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
