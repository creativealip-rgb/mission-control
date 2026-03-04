[05/03/2026 02:57] Kowhi: Oke Bos, saya jawab satu per satu berdasar OpenClaw system:

Format WebSocket RPC

Bukan pure JSON-RPC. OpenClaw pakai custom message envelope seperti ini:

{
  "id": "msg-id-123",
  "type": "tool_call", // atau "tool_result", "completion", etc
  "tool": {
    "name": "sessions_list",
    "parameters": {
      "kinds": ["subagent", "acp"],
      "limit": 10
    }
  },
  "auth": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Response-nya:

{
  "id": "msg-id-123", 
  "type": "tool_result",
  "status": "success",
  "data": {
    "sessions": [...]
  }
}

───

Autentikasi

Token: Ambil dari ~/.openclaw/config/keys.json atau HTTP header saat connect WS:

// Connect WS dengan auth
const ws = new WebSocket("wss://openclaw-gateway:8080", {
  headers: {
    "X-Gateway-Token": "eyJhbGciOiJIUzI1NiIs...",
    "X-Account": "default"
  }
});

Token di openclaw.json itu string panjang (eyJhbGci...) yang encode JWT.

───

Data untuk Dashboard

Agents (Henry, Charlie, Ralph, Violet)

Command: agents_list (untuk subagent agents) + sessions_list (untuk check status)

// Request
{
  "tool": "agents_list",
  "parameters": {}
}

// Response field yang penting:
{
  "agents": [
    {
      "agentId": "main",
      "name": "Henry",
      "desc": "AI coding assistant",
      "allowedModels": ["..."],
      "runtimeDefaults": { "model": "...", "sandbox": "..." }
    }
  ]
}

Status aktif: Dari sessions_list cek activeMinutes

// sessions_list parameters
{
  "kinds": ["subagent"],
  "activeMinutes": 5,
  "limit": 20
}

Task/Activity Log

Command: sessions_history untuk chat history

{
  "tool": "sessions_history",
  "parameters": {
    "sessionKey": "agent:main:subagent:xxx",
    "limit": 50,
    "includeTools": true
  }
}

Note: Task management di Mission Control itu lokal SQLite, bukan native OpenClaw. Jadi task Henry di Mission Control ≠ task OpenClaw session.

Documents/Memories

Filesystem langsung! OpenClaw ga ada API khusus untuk file workspace.

// Baca langsung pakai read tool
{
  "tool": "read",
  "file_path": "/home/ubuntu/.openclaw/workspace/memory/2026-03-04.md"
}

Atau kalau dari Mission Control external, pakai Node.js fs:

const fs = require('fs');
const doc = fs.readFileSync('/home/ubuntu/.openclaw/workspace/MEMORY.md');

Cron Schedules

Command: cron_list (kalau ada) atau cek file ~/.openclaw/config/crons.json

Format cron:

{
  "key": "daily-report",
  "schedule": "0 9 * * *",
  "agentId": "main", 
  "prompt": "Check emails..."
}

───

Workspace Path

Lokasi: /home/ubuntu/.openclaw/workspace/

Cara list files:

// Pakai exec tool
{
  "tool": "exec",
  "command": "find /home/ubuntu/.openclaw/workspace -type f | head -20"
}

Ga ada RPC command khusus untuk list files. Harus pakai exec atau read directory.

───

Ping Henry / Pause - Teknis

Ping Henry

Teknis: sessions_send ke agent tertentu

{
  "tool": "sessions_send",
  "parameters": {
    "sessionKey": "agent:main:main",
    "message": "heartbeat: check status",
    "timeoutSeconds": 5
  }
}

Atau pakai subagents heal check:

{
  "tool": "subagents",
  "action": "list",
  "recentMinutes": 1
}

Pause

Ini tricky. Bisa pakai beberapa cara:

Cara 1 - Kill process:

{
  "tool": "process",
  "action": "kill",
  "sessionId": "agent:main:subagent:xxx"
}

Cara 2 - Pause via subagents:

{
  "tool": "subagents",
  "action": "steer",
  "tar
[05/03/2026 02:57] Kowhi: get": "agent:main:subagent:xxx",
  "message": "PAUSE"
}

Cara 3 - Mission Control custom (kalau external tool):
Pause itu set flag di SQLite, agent cek flag sebelum execute task.

UPDATE agents SET status = 'paused', pause_reason = 'manual' WHERE id = 1;

───

Summary untuk AI Coding Agent

Kalau lu bikin Mission Control external (di AI coding tools lain):

1. WS Connect: wss://<host>:8080 dengan token di header
2. Status Agents: Polling sessions_list + agents_list tiap 5-10 detik
3. Kirim command: sessions_send ke session agent
4. Baca file: Langsung fs read (ga via WS)
5. Pause/Kill: process.kill atau subagents.steer
[05/03/2026 02:57] Kowhi: 6. Task Log: sessions_history tapi ini history chat, bukan task board

Mau contoh kode integrasi lengkapnya?
Usage: 55k in / 1.6k out · est $0.0000 · session agent:main:main