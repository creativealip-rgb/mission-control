import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const memories = db.prepare('SELECT * FROM memories ORDER BY created_at DESC').all();
  return NextResponse.json({ memories });
}
