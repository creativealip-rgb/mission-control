import { NextResponse } from 'next/server';
import { openclawBridge, validateConfig } from '@/lib/openclaw';

export async function GET() {
  const validation = validateConfig();
  
  if (!validation.valid) {
    return NextResponse.json({
      connected: false,
      offline: true,
      message: 'SSH configuration missing',
      error: validation.error,
      instructions: [
        'Set EC2_HOST and EC2_USER in .env.local',
        'Example: EC2_HOST=52.64.169.254',
      ],
    }, { status: 503 });
  }

  try {
    // Try SSH bridge
    const result = await openclawBridge.healthCheck();
    
    if (!result.success) {
      return NextResponse.json({
        connected: false,
        offline: true,
        error: result.error,
        message: 'Cannot connect to OpenClaw Gateway',
        instructions: [
          'Make sure SSH tunnel is running:',
          '  ssh -L 18789:127.0.0.1:18789 ubuntu@52.64.169.254 -N',
          'Or check your network connection to the VPS',
        ],
      }, { status: 503 });
    }

    // Get full status
    const statusResult = await openclawBridge.getGatewayStatus();
    
    return NextResponse.json({
      connected: true,
      offline: false,
      health: result.data,
      status: statusResult.success ? statusResult.data : null,
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      offline: true,
      error: err.message,
      message: 'Failed to connect to OpenClaw Gateway',
    }, { status: 500 });
  }
}
