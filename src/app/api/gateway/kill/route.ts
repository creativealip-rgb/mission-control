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
        const { sessionKey } = await request.json();

        if (!sessionKey) {
            return NextResponse.json({ 
                success: false, 
                message: 'sessionKey is required' 
            }, { status: 400 });
        }

        const result = await openclawBridge.killSession(sessionKey);
        
        if (!result.success) {
            return NextResponse.json({ 
                success: false, 
                error: result.error 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Session killed' 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            success: false, 
            error: err.message 
        }, { status: 500 });
    }
}
