import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';

export async function GET() {
    const validation = validateConfig();
    if (!validation.valid) {
        return NextResponse.json({ 
            agents: [], 
            configured: false,
            error: validation.error 
        });
    }

    try {
        const result = await openclawBridge.listAgents();
        
        if (!result.success) {
            return NextResponse.json({ 
                agents: [], 
                configured: true,
                error: result.error 
            });
        }

        return NextResponse.json({ 
            agents: result.data || [], 
            configured: true 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            agents: [], 
            configured: true,
            error: err.message 
        });
    }
}
