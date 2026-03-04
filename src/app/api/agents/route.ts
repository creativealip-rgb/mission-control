import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const agents = db.prepare('SELECT * FROM agents').all();
  const missionResult = db.prepare("SELECT value FROM settings WHERE key = 'mission'").get() as { value: string } | undefined;
  return NextResponse.json({ agents, mission: missionResult?.value || '' });
}
