'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Zap, MessageSquare, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────

interface OcAgent {
  agentId: string;
  name: string;
  desc?: string;
  allowedModels?: string[];
}

interface OcSession {
  sessionKey: string;
  agentId: string;
  kind: string;
  activeMinutes?: number;
  lastActivity?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────

const AGENT_COLORS: Record<string, string> = {
  henry: 'bg-indigo-500', scout: 'bg-emerald-500', quill: 'bg-amber-500',
  charlie: 'bg-orange-500', codex: 'bg-blue-500', violet: 'bg-purple-500',
  echo: 'bg-teal-500', pixel: 'bg-pink-500', ralph: 'bg-gray-400', alex: 'bg-red-500',
};

function agentColor(id: string) {
  const lower = id.toLowerCase();
  for (const [k, v] of Object.entries(AGENT_COLORS)) { if (lower.includes(k)) return v; }
  return 'bg-indigo-500';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

// ─── Steer Modal ─────────────────────────────────────────────────

function SteerModal({ session, onClose }: { session: OcSession; onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/gateway/steer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey: session.sessionKey, message }),
      });
      setSent(true);
      setTimeout(onClose, 1500);
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#111] border border-[#2a2a2a] rounded-t-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-white">Steer Agent</p>
            <p className="text-[11px] text-[#666] mt-0.5">{session.agentId}</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white"><X size={17} /></button>
        </div>
        {sent ? (
          <p className="text-sm text-emerald-400 text-center py-4">✓ Message sent!</p>
        ) : (
          <>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="Give this agent an instruction..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-3"
            />
            <button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Sending...' : 'Send Instruction'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Spawn Modal ─────────────────────────────────────────────────

function SpawnModal({ agent, onClose, onSpawned }: { agent: OcAgent; onClose: () => void; onSpawned: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSpawn() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gateway/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.agentId, prompt }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Spawn failed');
      onSpawned();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[440px] bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${agentColor(agent.agentId)} flex items-center justify-center text-white font-bold`}>
              {(agent.name || agent.agentId).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Spawn {agent.name || agent.agentId}</p>
              <p className="text-[11px] text-[#666]">{agent.desc || agent.agentId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white"><X size={17} /></button>
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="What should this agent do?"
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-4"
        />
        {error && <p className="text-[12px] text-red-400 mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-[#888] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-white transition-colors">Cancel</button>
          <button
            onClick={handleSpawn}
            disabled={loading || !prompt.trim()}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            <Zap size={13} />
            {loading ? 'Spawning...' : 'Spawn Agent'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hardcoded team (visual) — now with live session status overlay
const teamMembers = {
  leader: { name: 'Henry', role: 'Chief of Staff', emoji: '🦉', color: 'bg-indigo-500', borderColor: 'border-indigo-500/30', agentId: 'henry', desc: 'Coordinates, delegates, keeps the ship tight. The first point of contact between boss and machine.', tags: [{ label: 'Orchestration', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' }, { label: 'Clarity', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }, { label: 'Delegation', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' }] },
  operations: [
    { name: 'Charlie', role: 'Infrastructure Engineer', emoji: '🐱', color: 'bg-orange-500', borderColor: 'border-orange-500/30', agentId: 'charlie', desc: 'Infrastructure and automation specialist.', tags: [{ label: 'coding', color: 'bg-red-500/20 text-red-300 border-red-500/30' }, { label: 'infrastructure', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }, { label: 'automation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }] },
    { name: 'Ralph', role: 'Foreman / QA Manager', emoji: '🔧', color: 'bg-gray-400', borderColor: 'border-gray-500/30', agentId: 'ralph', desc: 'Checks the work, signs off or sends it back.', tags: [{ label: 'Quality Assurance', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }, { label: 'Monitoring', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' }, { label: 'Demo Recording', color: 'bg-red-500/20 text-red-300 border-red-500/30' }] },
  ],
  signalLayer: [
    { name: 'Scout', role: 'Trend Analyst', emoji: '🟢', color: 'bg-emerald-500', borderColor: 'border-emerald-500/30', agentId: 'scout', desc: 'Finds leads, tracks signals, scouts...', tags: [{ label: 'Speed', color: 'bg-red-500/20 text-red-300 border-red-500/30' }, { label: 'Radar', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }, { label: 'Intuition', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }] },
    { name: 'Quill', role: 'Content Writer', emoji: '🪶', color: 'bg-amber-500', borderColor: 'border-amber-500/30', agentId: 'quill', desc: 'Writes copy, designs content...', tags: [{ label: 'Voice', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }, { label: 'Quality', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }, { label: 'Design', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }] },
    { name: 'Pixel', role: 'Thumbnail Designer', emoji: '🎨', color: 'bg-pink-500', borderColor: 'border-pink-500/30', agentId: 'pixel', desc: 'Designs thumbnails, crafts visuals...', tags: [{ label: 'Visual', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' }, { label: 'Attention', color: 'bg-red-500/20 text-red-300 border-red-500/30' }, { label: 'Style', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }] },
    { name: 'Echo', role: 'Social Media Manager', emoji: '🐸', color: 'bg-teal-500', borderColor: 'border-teal-500/30', agentId: 'echo', desc: 'Posts, engages, grows the audience...', tags: [{ label: 'Viral', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' }, { label: 'Speed', color: 'bg-red-500/20 text-red-300 border-red-500/30' }, { label: 'Reach', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }] },
  ],
  metaLayer: [
    { name: 'Codex', role: 'Lead Engineer', emoji: '📦', color: 'bg-blue-500', borderColor: 'border-blue-500/30', agentId: 'codex', desc: 'Builds, fixes, automates.', tags: [{ label: 'Code', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }, { label: 'Systems', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }, { label: 'Reliability', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }] },
    { name: 'Violet', role: 'Research Analyst', emoji: '🔮', color: 'bg-purple-500', borderColor: 'border-purple-500/30', agentId: 'violet', desc: 'Deep research and analysis specialist.', tags: [{ label: 'research', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }, { label: 'analysis', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }, { label: 'trends', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }] },
  ],
};

// ─── AgentCard ────────────────────────────────────────────────────

function AgentCard({ agent, ocAgents, sessions, onSpawn, onSteer }: {
  agent: any;
  ocAgents: OcAgent[];
  sessions: OcSession[];
  onSpawn: (a: OcAgent) => void;
  onSteer: (s: OcSession) => void;
}) {
  const ocAgent = ocAgents.find(a => a.agentId.toLowerCase().includes(agent.agentId.toLowerCase()) || agent.agentId.toLowerCase().includes(a.agentId.toLowerCase()));
  const activeSessions = sessions.filter(s => s.agentId.toLowerCase().includes(agent.agentId.toLowerCase()));
  const isLive = activeSessions.length > 0;

  return (
    <div className={`bg-[#111] border ${isLive ? 'border-emerald-500/40' : 'border-[#222]'} rounded-xl p-5 hover:border-[#444] transition-colors`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center text-xl`}>
            {agent.emoji}
          </div>
          {isLive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-black" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-white">{agent.name}</h3>
            {isLive && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold">LIVE</span>}
          </div>
          <p className="text-xs text-[#888]">{agent.role}</p>
        </div>
      </div>
      <p className="text-[11px] text-[#666] leading-relaxed mb-3">{agent.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {agent.tags.map((tag: any) => (
          <span key={tag.label} className={`text-[10px] px-2 py-0.5 rounded-md border ${tag.color}`}>{tag.label}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {ocAgent && (
          <button
            onClick={() => onSpawn(ocAgent)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white bg-indigo-600/80 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            <Zap size={11} />
            Spawn
          </button>
        )}
        {activeSessions.map(s => (
          <button
            key={s.sessionKey}
            onClick={() => onSteer(s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg transition-colors"
          >
            <MessageSquare size={11} />
            Steer
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────

export default function TeamPage() {
  const [ocAgents, setOcAgents] = useState<OcAgent[]>([]);
  const [sessions, setSessions] = useState<OcSession[]>([]);
  const [spawnTarget, setSpawnTarget] = useState<OcAgent | null>(null);
  const [steerTarget, setSteerTarget] = useState<OcSession | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [aRes, sRes] = await Promise.all([
        fetch('/api/gateway/agents'),
        fetch('/api/gateway/sessions'),
      ]);
      const aData = await aRes.json();
      const sData = await sRes.json();
      setOcAgents(aData.agents ?? []);
      setSessions(sData.sessions ?? []);
    } catch { }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const i = setInterval(refresh, 15_000);
    return () => clearInterval(i);
  }, [refresh]);

  const allAgents = [teamMembers.leader, ...teamMembers.operations, ...teamMembers.signalLayer, ...teamMembers.metaLayer];

  return (
    <div className="h-full bg-[#000000] overflow-y-auto">
      {/* Hero */}
      <div className="text-center py-10 px-8">
        <div className="inline-block bg-[#1a1a1a] border border-[#333] rounded-xl px-6 py-3 mb-6">
          <p className="text-sm text-[#ccc] italic">
            &quot;An autonomous organization of AI agents that does work for me and produces value 24/7&quot;
          </p>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Meet the Team</h1>
        <p className="text-sm text-[#888]">9 AI agents across 3 machines, each with a real role and a real personality.</p>
      </div>

      {/* Live Sessions Banner */}
      {sessions.length > 0 && (
        <div className="mx-8 mb-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400">{sessions.length} Live Session{sessions.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sessions.map(s => (
              <button
                key={s.sessionKey}
                onClick={() => setSteerTarget(s)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-emerald-500/30 rounded-lg hover:border-emerald-400/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-white font-medium">{s.agentId}</span>
                {s.lastActivity && <span className="text-[10px] text-[#666]">{timeAgo(s.lastActivity)}</span>}
                <MessageSquare size={10} className="text-emerald-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Henry */}
      <div className="max-w-2xl mx-auto px-8">
        <AgentCard agent={teamMembers.leader} ocAgents={ocAgents} sessions={sessions} onSpawn={setSpawnTarget} onSteer={setSteerTarget} />
      </div>

      <div className="flex justify-center"><div className="w-px h-10 bg-[#333]" /></div>

      {/* Operations */}
      <div className="flex items-center gap-4 my-6 px-8"><div className="flex-1 border-t border-[#222]" /><span className="text-[11px] text-[#666] font-medium">🖥 OPERATIONS</span><div className="flex-1 border-t border-[#222]" /></div>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto px-8">
        {teamMembers.operations.map(a => <AgentCard key={a.name} agent={a} ocAgents={ocAgents} sessions={sessions} onSpawn={setSpawnTarget} onSteer={setSteerTarget} />)}
      </div>

      {/* Signal Layer */}
      <div className="flex items-center gap-4 my-6 px-8"><div className="flex-1 border-t border-[#222]" /><span className="text-[11px] text-[#666] font-medium">📡 SIGNAL LAYER</span><div className="flex-1 border-t border-[#222]" /></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-8">
        {teamMembers.signalLayer.map(a => <AgentCard key={a.name} agent={a} ocAgents={ocAgents} sessions={sessions} onSpawn={setSpawnTarget} onSteer={setSteerTarget} />)}
      </div>

      {/* Meta Layer */}
      <div className="flex items-center gap-4 my-6 px-8 max-w-3xl mx-auto"><div className="flex-1 border-t border-[#222]" /><span className="text-[11px] text-[#666] font-medium">● META LAYER</span><div className="flex-1 border-t border-[#222]" /></div>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto px-8 pb-12">
        {teamMembers.metaLayer.map(a => <AgentCard key={a.name} agent={a} ocAgents={ocAgents} sessions={sessions} onSpawn={setSpawnTarget} onSteer={setSteerTarget} />)}
      </div>

      {/* Modals */}
      {spawnTarget && <SpawnModal agent={spawnTarget} onClose={() => setSpawnTarget(null)} onSpawned={refresh} />}
      {steerTarget && <SteerModal session={steerTarget} onClose={() => setSteerTarget(null)} />}
    </div>
  );
}
