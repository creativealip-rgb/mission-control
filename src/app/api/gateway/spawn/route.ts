import { NextResponse } from 'next/server';
import * as oc from '@/lib/openclaw-client';
import db from '@/lib/db';

export async function POST(request: Request) {
    if (!oc.isConfigured()) {
        return NextResponse.json({ success: false, message: 'Gateway not configured' }, { status: 503 });
    }

    try {
        const { agentId, prompt, taskId } = await request.json();

        if (!agentId || !prompt) {
            return NextResponse.json({ success: false, message: 'agentId and prompt are required' }, { status: 400 });
        }

        const resp = await oc.rpc('sessions_spawn', {
            agentId,
            prompt,
            kind: 'subagent',
        });

        const sessionKey = (resp.data?.sessionKey as string) || (resp.data?.session_key as string);

        // If a taskId was provided, link the session to the task in SQLite
        if (taskId && sessionKey) {
            try {
                db.prepare('UPDATE tasks SET agent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                    .run(sessionKey, taskId);
            } catch { /* table may not have agent_id column */ }
        }

        return NextResponse.json({ success: true, sessionKey, data: resp.data });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
