import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as sshBridge from '@/lib/ssh-bridge';

export async function GET() {
  // Try to read from VPS workspace first
  if (sshBridge.isSSHConfigured()) {
    try {
      const files = await sshBridge.listWorkspaceFiles();
      const documents = await Promise.all(
        files
          .filter((f) => !f.isDirectory && !f.name.startsWith('.'))
          .slice(0, 30)
          .map(async (f) => {
            const ext = f.name.split('.').pop() || '';
            let content = '';
            let category = 'Other';

            // Determine category from filename/extension
            if (f.name.toLowerCase().includes('journal') || /^\d{4}-\d{2}-\d{2}\.md$/.test(f.name)) {
              category = 'Journal';
            } else if (['md', 'txt'].includes(ext)) {
              category = 'Docs';
            } else if (['ts', 'js', 'py'].includes(ext)) {
              category = 'Code';
            } else if (['png', 'jpg', 'gif', 'webp'].includes(ext)) {
              category = 'Images';
            }

            // Read content for text files
            if (['md', 'txt', 'json', 'ts', 'js', 'py', 'html', 'css'].includes(ext)) {
              try {
                content = await sshBridge.readFile(f.path);
                if (content.length > 5000) content = content.slice(0, 5000) + '\n\n... (truncated)';
              } catch { }
            }

            return {
              id: f.path,
              title: f.name,
              content,
              category,
              file_type: ext,
              size: f.size,
              created_at: f.modifiedAt.toISOString(),
            };
          })
      );

      return NextResponse.json({ documents, source: 'vps' });
    } catch (err: any) {
      // Fall through to local DB
      console.error('SSH bridge error:', err.message);
    }
  }

  // Fallback: local SQLite
  const documents = db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all();
  return NextResponse.json({ documents, source: 'local' });
}
