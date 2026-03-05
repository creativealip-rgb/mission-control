import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';

export async function POST(request: Request) {
    const validation = validateConfig();
    if (!validation.valid) {
        return NextResponse.json({ 
            success: false, 
            message: 'Gateway not configured',
            error: validation.error 
        }, { status: 503 });
    }

    try {
        const { sessionKey, message } = await request.json();

        if (!sessionKey || !message) {
            return NextResponse.json({ 
                success: false, 
                message: 'sessionKey and message are required' 
            }, { status: 400 });
        }

        const result = await openclawBridge.sendToAgent(sessionKey, message);
        
        if (!result.success) {
            return NextResponse.json({ 
                success: false, 
                error: result.error 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            response: result.data 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            success: false, 
            error: err.message 
        }, { status: 500 });
    }
}
