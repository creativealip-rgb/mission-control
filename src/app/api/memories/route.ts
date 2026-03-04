import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as sshBridge from '@/lib/ssh-bridge';

export async function GET() {
  // Try to read from VPS workspace memory directory
  if (sshBridge.isSSHConfigured()) {
    try {
      // Try reading from a 'memory' subdirectory in workspace
      const files = await sshBridge.listWorkspaceFiles('memory');
      const memories = await Promise.all(
        files
          .filter((f) => !f.isDirectory && (f.name.endsWith('.md') || f.name.endsWith('.txt')))
          .slice(0, 30)
          .map(async (f) => {
            let content = '';
            try {
              content = await sshBridge.readFile(f.path);
            } catch { }

            // Auto-categorize based on content
            let category = 'Reflection';
            const lower = content.toLowerCase();
            if (lower.includes('idea') || lower.includes('concept')) category = 'Idea';
            else if (lower.includes('meeting') || lower.includes('sync') || lower.includes('call')) category = 'Meeting';

            return {
              id: f.path,
              content,
              category,
              tags: f.name.replace(/\.(md|txt)$/, ''),
              created_at: f.modifiedAt.toISOString(),
            };
          })
      );

      return NextResponse.json({ memories, source: 'vps' });
    } catch {
      // Fall through to local
    }
  }

  // Fallback: local SQLite
  const memories = db.prepare('SELECT * FROM memories ORDER BY created_at DESC').all();
  return NextResponse.json({ memories, source: 'local' });
}
