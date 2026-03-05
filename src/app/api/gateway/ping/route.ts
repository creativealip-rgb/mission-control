import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';

export async function POST(request: Request) {
    const validation = validateConfig();
    if (!validation.valid) {
        return NextResponse.json({ 
            success: false, 
            message: 'Gateway not configured',
            error: validation.error 
        });
    }

    try {
        const { sessionKey, message } = await request.json();
        const targetSession = sessionKey || 'agent:main:main';
        const pingMessage = message || 'heartbeat: check status';

        const result = await openclawBridge.sendToAgent(targetSession, pingMessage);
        
        if (!result.success) {
            return NextResponse.json({ 
                success: false, 
                error: result.error 
            });
        }

        return NextResponse.json({ 
            success: true, 
            response: result.data 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            success: false, 
            error: err.message 
        });
    }
}
