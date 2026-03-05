'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronDown, Zap, X, Loader2, RefreshCw } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  agent_id?: string;
  project_id?: number;
  created_at: string;
  updated_at: string;
}

interface OcAgent {
  agentId: string;
  name: string;
  desc?: string;
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
  default: 'bg-indigo-500',
  henry: 'bg-indigo-500',
  scout: 'bg-emerald-500',
  quill: 'bg-amber-500',
  charlie: 'bg-orange-500',
  codex: 'bg-blue-500',
  violet: 'bg-purple-500',
  echo: 'bg-teal-500',
  pixel: 'bg-pink-500',
  ralph: 'bg-gray-400',
  alex: 'bg-red-500',
};

function agentColor(id: string): string {
  const lower = id.toLowerCase();
  for (const [key, val] of Object.entries(AGENT_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return AGENT_COLORS.default;
}

function agentInitial(id: string): string {
  const parts = id.split(':');
  const name = parts[parts.length - 1] || id;
  return name.charAt(0).toUpperCase();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', dot: '#6b7280' },
  { id: 'in_progress', title: 'In Progress', dot: '#3b82f6' },
  { id: 'review', title: 'Review', dot: '#f59e0b' },
  { id: 'done', title: 'Done', dot: '#10b981' },
];

// ─── Sub-components ───────────────────────────────────────────────

function AgentBadge({ id, size = 'sm' }: { id: string; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'w-7 h-7 text-[11px]' : 'w-5 h-5 text-[9px]';
  return (
    <div className={`${sz} rounded-full ${agentColor(id)} flex items-center justify-center text-white font-bold shrink-0`}>
      {agentInitial(id)}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[9px] text-emerald-400 font-semibold">LIVE</span>
    </span>
  );
}

function TaskCard({ task, activeSessions }: { task: Task; activeSessions: OcSession[] }) {
  const isLive = task.agent_id
    ? activeSessions.some(s => s.sessionKey === task.agent_id || s.agentId === task.agent_id)
    : false;

  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl p-4 hover:border-[#444] transition-colors cursor-pointer group">
      <div className="flex items-start gap-2 mb-1">
        <span className="text-red-400 text-xs mt-0.5">●</span>
        <h3 className="text-[13px] font-medium text-white leading-snug flex-1">{task.title}</h3>
      </div>
      {task.description && (
        <p className="text-[11px] text-[#777] leading-relaxed mt-2 ml-4 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 ml-4">
        <div className="flex items-center gap-2">
          {task.agent_id && <AgentBadge id={task.agent_id} />}
          {isLive && <LiveBadge />}
        </div>
        <span className="text-[10px] text-[#555]">{timeAgo(task.updated_at)}</span>
      </div>
    </div>
  );
}

function SessionItem({ session }: { session: OcSession }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[#1a1a1a] last:border-b-0">
      <AgentBadge id={session.agentId} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white mb-0.5 truncate">{session.agentId}</p>
        <p className="text-[11px] text-[#777] truncate">{session.kind}</p>
        {session.lastActivity && (
          <p className="text-[10px] text-[#555] mt-0.5">{timeAgo(session.lastActivity)}</p>
        )}
      </div>
      <div className="flex items-center">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
  );
}

// ─── New Task Modal ───────────────────────────────────────────────

function NewTaskModal({
  ocAgents,
  onClose,
  onCreated,
}: {
  ocAgents: OcAgent[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [spawnAgent, setSpawnAgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');

    try {
      // 1. Create task in DB
      const taskRes = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status: 'todo' }),
      });
      const taskData = await taskRes.json();
      const taskId = taskData.id;

      // 2. Optionally spawn an agent
      if (spawnAgent && selectedAgentId && taskId) {
        const prompt = `Task assigned: "${title}"${description ? `\n\n${description}` : ''}`;
        await fetch('/api/gateway/spawn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: selectedAgentId, prompt, taskId }),
        });
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[480px] bg-[#111] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">New Task</h2>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] text-[#888] mb-1.5 block">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-[11px] text-[#888] mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Additional context..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Spawn agent toggle */}
          <div className="border border-[#2a2a2a] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400" />
                <span className="text-[13px] font-medium text-white">Spawn Agent</span>
              </div>
              <button
                type="button"
                onClick={() => setSpawnAgent(v => !v)}
                className={`w-9 h-5 rounded-full transition-colors relative ${spawnAgent ? 'bg-indigo-600' : 'bg-[#333]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${spawnAgent ? 'left-4' : 'left-0.5'}`} />
              </button>
            </div>
            {spawnAgent && (
              <div>
                <label className="text-[11px] text-[#888] mb-1.5 block">Choose Agent</label>
                {ocAgents.length === 0 ? (
                  <p className="text-[11px] text-[#555]">No agents configured in OpenClaw, or gateway offline.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {ocAgents.map(a => (
                      <button
                        key={a.agentId}
                        type="button"
                        onClick={() => setSelectedAgentId(a.agentId)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors ${selectedAgentId === a.agentId
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#aaa] hover:text-white hover:border-[#444]'
                          }`}
                      >
                        <AgentBadge id={a.agentId} />
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium truncate">{a.name || a.agentId}</p>
                          {a.desc && <p className="text-[10px] text-[#666] truncate">{a.desc}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-[12px] text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-[#888] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Creating...' : spawnAgent && selectedAgentId ? 'Create & Spawn' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<OcSession[]>([]);
  const [ocAgents, setOcAgents] = useState<OcAgent[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : (data.tasks ?? []));
    } catch { }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway/sessions');
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway/agents');
      const data = await res.json();
      setOcAgents(data.agents ?? []);
    } catch { }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchSessions();
    fetchAgents();
  }, [fetchTasks, fetchSessions, fetchAgents]);

  // Auto-refresh sessions every 10s
  useEffect(() => {
    const interval = setInterval(fetchSessions, 10_000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([fetchTasks(), fetchSessions()]);
    setRefreshing(false);
  }

  // Derive agent filter list from ocAgents + tasks
  const agentNames = Array.from(
    new Set(ocAgents.map(a => a.name || a.agentId).filter(Boolean))
  ).slice(0, 5);

  const filteredTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter(t => t.agent_id?.toLowerCase().includes(activeFilter.toLowerCase()));

  const stats = {
    thisWeek: tasks.filter(t => {
      const d = new Date(t.created_at);
      const now = new Date();
      return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    total: tasks.length,
    completion: tasks.length
      ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
      : 0,
  };

  return (
    <div className="h-full flex bg-[#000000] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Stats Bar */}
        <div className="flex items-center gap-6 px-8 pt-6 pb-4 shrink-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-400">{stats.thisWeek}</span>
            <span className="text-xs text-[#666]">This week</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-blue-400">{stats.inProgress}</span>
            <span className="text-xs text-[#666]">In progress</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white">{stats.total}</span>
            <span className="text-xs text-[#666]">Total</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-400">{stats.completion}%</span>
            <span className="text-xs text-[#666]">Completion</span>
          </div>
          <button
            onClick={handleRefresh}
            className="ml-auto text-[#555] hover:text-white transition-colors p-1.5"
            title="Refresh"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 px-8 pb-5 shrink-0 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 transition-colors"
          >
            <Plus size={14} />
            New task
          </button>
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === 'All'
              ? 'bg-[#222] text-white border border-[#444]'
              : 'bg-[#111] text-[#888] border border-[#222] hover:text-white'
              }`}
          >
            All
          </button>
          {agentNames.map(name => (
            <button
              key={name}
              onClick={() => setActiveFilter(name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === name
                ? 'bg-[#222] text-white border border-[#444]'
                : 'bg-[#111] text-[#888] border border-[#222] hover:text-white'
                }`}
            >
              {name}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-[#222] text-[#888] rounded-lg text-xs font-medium hover:text-white transition-colors ml-auto">
            All projects
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto px-8 pb-6">
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="w-[280px] flex flex-col shrink-0">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]" style={{ color: col.dot }}>●</span>
                      <h2 className="text-[13px] font-semibold text-white">{col.title}</h2>
                      <span className="text-[11px] text-[#555]">{colTasks.length}</span>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-[#555] hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2.5">
                    {colTasks.length === 0 && (
                      <div className="text-[11px] text-[#444] text-center py-8">No tasks</div>
                    )}
                    {colTasks.map(task => (
                      <TaskCard key={task.id} task={task} activeSessions={sessions} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Activity Sidebar */}
      <div className="w-[280px] border-l border-[#1a1a1a] bg-[#050505] flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Live Activity</h2>
          <div className="flex items-center gap-1.5">
            {sessions.length > 0 && (
              <span className="text-[10px] text-emerald-400 font-semibold">{sessions.length} active</span>
            )}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[11px] text-[#555]">No active sessions</p>
              <p className="text-[10px] text-[#444] mt-1">Spawn an agent to begin</p>
            </div>
          ) : (
            sessions.map((s, i) => <SessionItem key={i} session={s} />)
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <NewTaskModal
          ocAgents={ocAgents}
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}
    </div>
  );
}
