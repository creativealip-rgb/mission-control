import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';

export async function POST(request: Request) {
    const validation = validateConfig();
    if (!validation.valid) {
        return NextResponse.json({ 
            success: false, 
            message: 'Gateway not configured' 
        }, { status: 503 });
    }

    try {
        const { agentName, task, model = 'qwen3.5-plus' } = await request.json();

        if (!agentName || !task) {
            return NextResponse.json({ 
                success: false, 
                message: 'agentName and task are required' 
            }, { status: 400 });
        }

        const result = await openclawBridge.spawnAgent({
            agentName,
            task,
            model,
        });

        if (!result.success) {
            return NextResponse.json({ 
                success: false, 
                error: result.error 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            sessionId: result.data?.sessionId,
            agentName: result.data?.agentName,
            status: result.data?.status,
        });
    } catch (err: any) {
        return NextResponse.json({ 
            success: false, 
            error: err.message 
        }, { status: 500 });
    }
}
