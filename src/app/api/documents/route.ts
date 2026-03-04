import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const documents = db.prepare('SELECT * FROM documents').all();
  return NextResponse.json({ documents });
}
