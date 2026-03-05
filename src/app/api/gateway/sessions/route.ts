import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';

export async function GET() {
    const configValidation = validateConfig();
    if (!configValidation.valid) {
        return NextResponse.json({ 
            sessions: [], 
            configured: false,
            error: configValidation.error 
        });
    }

    try {
        const result = await openclawBridge.listAgents();
        
        if (!result.success) {
            return NextResponse.json({ 
                sessions: [], 
                configured: true,
                error: result.error 
            });
        }

        return NextResponse.json({ 
            sessions: result.data || [], 
            configured: true 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            sessions: [], 
            configured: true,
            error: err.message 
        });
    }
}
