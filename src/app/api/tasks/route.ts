import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY updated_at DESC').all();
  const activities = db.prepare('SELECT * FROM activities ORDER BY timestamp DESC LIMIT 20').all();
  return NextResponse.json({ tasks, activities });
}

export async function POST(request: Request) {
  const { title, status, agent_id } = await request.json();
  
  if (status === 'done') {
    // Add activity for completion
    db.prepare('INSERT INTO activities (agent_id, action) VALUES (?, ?)').run(agent_id, `completed '${title}'`);
  } else {
    db.prepare('INSERT INTO activities (agent_id, action) VALUES (?, ?)').run(agent_id, `moved '${title}' to ${status}`);
  }
  
  db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE title = ?').run(status, title);
  
  return NextResponse.json({ success: true });
}
