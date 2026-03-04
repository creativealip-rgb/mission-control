import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const schedules = db.prepare('SELECT * FROM schedules').all();
  return NextResponse.json({ schedules });
}
