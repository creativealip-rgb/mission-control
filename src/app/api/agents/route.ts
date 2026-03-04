import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as oc from '@/lib/openclaw-client';

export async function GET() {
  // Always get local SQLite agents + mission
  const localAgents = db.prepare('SELECT * FROM agents').all();
  const missionResult = db.prepare("SELECT value FROM settings WHERE key = 'mission'").get() as { value: string } | undefined;

  // Try to enrich with live OpenClaw data
  let liveAgents: any[] = [];
  let liveSessions: any[] = [];
  let gatewayConnected = false;

  if (oc.isConfigured()) {
    try {
      liveAgents = await oc.agentsList();
      liveSessions = await oc.sessionsList({ activeMinutes: 10 });
      gatewayConnected = true;
    } catch { }
  }

  // Merge: use local agents but enrich with live status
  const agents = (localAgents as any[]).map((agent) => {
    const liveAgent = liveAgents.find(
      (la) => la.name?.toLowerCase() === agent.name?.toLowerCase()
    );
    const activeSession = liveSessions.find(
      (s) => s.agentId === liveAgent?.agentId
    );

    return {
      ...agent,
      openclawId: liveAgent?.agentId || null,
      liveModel: liveAgent?.runtimeDefaults?.model || null,
      isActive: !!activeSession,
      lastActivity: activeSession?.lastActivity || null,
    };
  });

  return NextResponse.json({
    agents,
    mission: missionResult?.value || '',
    gatewayConnected,
    liveAgentCount: liveAgents.length,
    activeSessionCount: liveSessions.length,
  });
}
