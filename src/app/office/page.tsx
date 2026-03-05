'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap, MessageSquare, Users, MonitorPlay, Coffee } from 'lucide-react';

interface OcSession {
  sessionKey: string;
  agentId: string;
  kind: string;
  activeMinutes?: number;
  lastActivity?: string;
}

// Fixed positions on canvas mapped by keywords in agent ID
const OFFICE_DESKS = [
  { match: 'henry', emoji: '🦉', color: 'bg-indigo-500', x: 55, y: 22 },
  { match: 'alex', emoji: '🔴', color: 'bg-red-500', x: 28, y: 32 },
  { match: 'quill', emoji: '🪶', color: 'bg-amber-500', x: 20, y: 48 },
  { match: 'echo', emoji: '🐸', color: 'bg-teal-500', x: 32, y: 48 },
  { match: 'violet', emoji: '🔮', color: 'bg-purple-500', x: 42, y: 48 },
  { match: 'scout', emoji: '🟢', color: 'bg-emerald-500', x: 46, y: 48 },
  { match: 'codex', emoji: '📦', color: 'bg-blue-500', x: 56, y: 46 },
  { match: 'charlie', emoji: '🐱', color: 'bg-orange-500', x: 38, y: 58 },
  { match: 'pixel', emoji: '🎨', color: 'bg-pink-500', x: 65, y: 66 },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function OfficePage() {
  const [sessions, setSessions] = useState<OcSession[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway/sessions');
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { }
  }, []);

  useEffect(() => {
    fetchSessions();
    const int = setInterval(fetchSessions, 10_000);
    return () => clearInterval(int);
  }, [fetchSessions]);

  // Merge static desks with live session data
  const officeAgents = OFFICE_DESKS.map(desk => {
    const liveSession = sessions.find(s => s.agentId.toLowerCase().includes(desk.match.toLowerCase()));
    return {
      ...desk,
      id: desk.match,
      name: desk.match.charAt(0).toUpperCase() + desk.match.slice(1),
      active: !!liveSession,
      session: liveSession,
    };
  });

  // Agents that don't map to a static desk but are active
  const unmappedSessions = sessions.filter(s =>
    !OFFICE_DESKS.some(d => s.agentId.toLowerCase().includes(d.match.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col bg-[#000000] overflow-hidden">
      {/* Controls Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1a1a1a] bg-[#050505] shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm">🏢</span>
          <span className="text-sm font-semibold text-white">Virtual Office</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)`,
              backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px', backgroundColor: '#0a0a0a',
            }}
          />

          {/* Table */}
          <div className="absolute" style={{ left: '35%', top: '52%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-32 h-20 bg-[#2a2a2a] rounded-[50%] border-2 border-[#333] opacity-60" />
          </div>

          {/* Monitors */}
          {[{ x: 25, y: 25 }, { x: 40, y: 25 }, { x: 55, y: 16 }, { x: 20, y: 35 }, { x: 35, y: 35 }, { x: 50, y: 35 }].map((d, i) => (
            <div key={i} className="absolute" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
              <div className="w-12 h-8 bg-[#333] border border-[#444] rounded-sm flex items-center justify-center">
                <div className="w-6 h-4 bg-blue-500/40 rounded-sm" />
              </div>
              <div className="w-1 h-4 bg-[#444] mx-auto" />
            </div>
          ))}

          {/* Agents */}
          {officeAgents.map(agent => (
            <div
              key={agent.id}
              className="absolute cursor-pointer transition-transform hover:scale-110 z-20"
              style={{ left: `${agent.x}%`, top: `${agent.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <div className="relative flex flex-col items-center gap-1">
                {agent.active && (
                  <span className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping opacity-75 z-0" />
                )}
                <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center text-lg z-10 ${!agent.active ? 'opacity-40 grayscale' : 'shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}>
                  {agent.emoji}
                </div>
                <div className="flex items-center gap-1 bg-[#111] px-1.5 py-0.5 rounded border border-[#222] z-10">
                  <span className={`text-[9px] font-bold ${agent.active ? 'text-emerald-400' : 'text-[#666]'}`}>{agent.name}</span>
                </div>
              </div>

              {/* Tooltip */}
              {hoveredAgent === agent.id && agent.active && agent.session && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#333] rounded-lg p-2 whitespace-nowrap z-30 shadow-xl">
                  <p className="text-[10px] text-emerald-400 font-bold mb-1">● ACTIVE SESSION</p>
                  <p className="text-[11px] text-white">ID: {agent.session.sessionKey}</p>
                  <p className="text-[10px] text-[#888]">{agent.session.lastActivity ? timeAgo(agent.session.lastActivity) : 'working'}</p>
                </div>
              )}
            </div>
          ))}

          {/* Unmapped floating sessions */}
          {unmappedSessions.map((s, i) => (
            <div
              key={s.sessionKey}
              className="absolute transition-transform hover:scale-110 z-20"
              style={{ left: `${10 + (i * 10)}%`, top: `85%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative flex flex-col items-center gap-1">
                <span className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping opacity-75 z-0" />
                <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center text-lg z-10 font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  {(s.agentId.split(':').pop() || '?')[0].toUpperCase()}
                </div>
                <div className="flex items-center bg-[#111] px-1.5 py-0.5 rounded border border-[#222] z-10">
                  <span className="text-[9px] font-bold text-emerald-400 truncate max-w-[60px]">{s.agentId.split(':').pop()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Sidebar */}
        <div className="w-[240px] border-l border-[#1a1a1a] bg-[#050505] flex flex-col shrink-0">
          <div className="px-4 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔥</span>
              <h2 className="text-sm font-semibold text-white">Live Activity</h2>
            </div>
            {sessions.length > 0 && <span className="text-[10px] text-emerald-400">{sessions.length} online</span>}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-2 space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center pt-8">
                <p className="text-[11px] text-[#555]">No agents in office.</p>
              </div>
            ) : (
              sessions.map(s => (
                <div key={s.sessionKey} className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-xs font-semibold text-white truncate">{s.agentId}</p>
                  <p className="text-[10px] text-[#777] my-0.5">{s.kind}</p>
                  {s.lastActivity && <p className="text-[9px] text-[#555]">{timeAgo(s.lastActivity)}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
