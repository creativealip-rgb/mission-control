'use client';

import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────

const columns = [
  { id: 'recurring', title: 'Recurring', count: 0 },
  { id: 'backlog', title: 'Backlog', count: 6 },
  { id: 'in_progress', title: 'In Progress', count: 3 },
  { id: 'review', title: 'Review', count: 0 },
  { id: 'done', title: 'Done', count: 2 },
];

const agents = {
  A: { name: 'Alex', color: 'bg-red-500' },
  H: { name: 'Henry', color: 'bg-indigo-500' },
  C: { name: 'ClawdBot', color: 'bg-emerald-500' },
  S: { name: 'Scout', color: 'bg-amber-500' },
  Q: { name: 'Quill', color: 'bg-purple-500' },
};

type AgentKey = keyof typeof agents;

const mockTasks = [
  {
    id: 1, title: 'Record Claude Code walkthrough', desc: 'Film the I deleted all my AI tools video', column: 'backlog',
    agent: 'A' as AgentKey, label: 'YouTube', labelColor: 'bg-red-600', time: 'less than a minute ago',
  },
  {
    id: 2, title: 'Flesh out $10K Mac setup', desc: 'Develop and prioritize the use cases for the Mac Studio M3 Ultra upgrade', column: 'backlog',
    agent: 'C' as AgentKey, label: 'ClawdBot', labelColor: 'bg-emerald-600', time: 'less than a minute ago',
  },
  {
    id: 3, title: 'Pre train a local model', desc: '', column: 'backlog',
    agent: 'A' as AgentKey, label: '', labelColor: '', time: 'less than a minute ago',
  },
  {
    id: 4, title: 'Build activity feed for Mission Control', desc: '', column: 'backlog',
    agent: 'A' as AgentKey, label: 'Agents', labelColor: 'bg-gray-600', time: 'less than a minute ago',
  },
  {
    id: 5, title: '[Reborn] Server: Play...', desc: 'SpacetimeDB module: Create Player table (identity, name, x, y, z, rotY,...', column: 'backlog',
    agent: 'C' as AgentKey, label: 'Reborn', labelColor: 'bg-gray-600', time: 'less than a minute ago',
  },
  {
    id: 6, title: 'Build Council - Society simulation', desc: 'Multi-model deliberation system. Phase 1: CLI backend. Phase 2: ...', column: 'in_progress',
    agent: 'H' as AgentKey, label: 'Council', labelColor: 'bg-indigo-600', time: 'less than a minute ago',
  },
  {
    id: 7, title: 'Research Exo Labs distributed inference', desc: 'Prep guide for running large models (Kimi K2.5, etc.) distributed across ...', column: 'in_progress',
    agent: 'H' as AgentKey, label: 'Mac Studio Launch', labelColor: 'bg-gray-600', time: 'less than a minute ago',
  },
  {
    id: 8, title: 'Build AI Employee Scorecard', desc: 'New tab in Mission Control tracking the ROI of the AI employee setup...', column: 'in_progress',
    agent: 'H' as AgentKey, label: 'Mission Control', labelColor: 'bg-gray-600', time: 'less than a minute ago',
  },
  {
    id: 9, title: 'Setup OpenClaw Gateway', desc: 'Initial gateway setup with WhatsApp and Telegram channels configured', column: 'done',
    agent: 'H' as AgentKey, label: 'Infrastructure', labelColor: 'bg-emerald-600', time: '2 days ago',
  },
  {
    id: 10, title: 'Design system token audit', desc: 'Review all color tokens and typography scale across components', column: 'done',
    agent: 'S' as AgentKey, label: 'Design', labelColor: 'bg-purple-600', time: '3 days ago',
  },
];

const liveActivities = [
  { agent: 'S' as AgentKey, text: '4 trends: Claude presentation, Code finance app, Udi roasting...', time: '' },
  { agent: 'Q' as AgentKey, text: 'Script: Claude Code Agent Template - Everything', time: '' },
  { agent: 'H' as AgentKey, text: 'Completed: System Status Dashboard', time: '' },
  { agent: 'S' as AgentKey, text: 'Morning research: Claude Code Teams, YC vs Accenture vira...', time: '' },
  { agent: 'H' as AgentKey, text: 'Evening wrap-up posted', time: '' },
  { agent: 'S' as AgentKey, text: 'ChatGPT psychic witch viral + ClawdBot UGC ads at scale', time: '' },
  { agent: 'S' as AgentKey, text: 'Readout session replays for Claude Code', time: 'about 23 hours' },
];

// ─── Components ──────────────────────────────────────────────────

function TaskCard({ task }: { task: typeof mockTasks[0] }) {
  const agent = agents[task.agent];
  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl p-4 hover:border-[#444] transition-colors cursor-pointer group">
      <div className="flex items-start gap-2 mb-1">
        <span className="text-red-400 text-xs mt-0.5">●</span>
        <h3 className="text-[13px] font-medium text-white leading-snug">{task.title}</h3>
      </div>
      {task.desc && (
        <p className="text-[11px] text-[#777] leading-relaxed mt-2 ml-4">{task.desc}</p>
      )}
      <div className="flex items-center justify-between mt-3 ml-4">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${agent.color} flex items-center justify-center text-white text-[9px] font-bold`}>
            {task.agent}
          </div>
          {task.label && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md ${task.labelColor} text-white/90`}>
              {task.label}
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#555]">{task.time}</span>
      </div>
    </div>
  );
}

function LiveActivityItem({ activity }: { activity: typeof liveActivities[0] }) {
  const agent = agents[activity.agent];
  return (
    <div className="flex gap-3 py-3 border-b border-[#1a1a1a] last:border-b-0">
      <div className={`w-6 h-6 rounded-full ${agent.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5`}>
        {activity.agent}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold mb-0.5`} style={{ color: agent.color.replace('bg-', '').includes('red') ? '#ef4444' : agent.color.includes('indigo') ? '#818cf8' : agent.color.includes('amber') ? '#f59e0b' : agent.color.includes('purple') ? '#a78bfa' : '#10b981' }}>
          {agent.name}
        </p>
        <p className="text-[11px] text-[#aaa] leading-snug">{activity.text}</p>
        {activity.time && (
          <p className="text-[10px] text-[#555] mt-1">{activity.time}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = {
    thisWeek: 19,
    inProgress: mockTasks.filter(t => t.column === 'in_progress').length,
    total: 42,
    completion: 45,
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
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 px-8 pb-5 shrink-0">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 transition-colors">
            <Plus size={14} />
            New task
          </button>
          {['Alex', 'Henry'].map(name => (
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-[#222] text-[#888] rounded-lg text-xs font-medium hover:text-white transition-colors">
            All projects
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto px-8 pb-6">
          <div className="flex gap-4 h-full min-w-max">
            {columns.map(col => {
              const tasks = mockTasks.filter(t => t.column === col.id);
              return (
                <div key={col.id} className="w-[280px] flex flex-col shrink-0">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400">●</span>
                      <h2 className="text-[13px] font-semibold text-white">{col.title}</h2>
                      <span className="text-[11px] text-[#555]">{tasks.length}</span>
                    </div>
                    <button className="text-[#555] hover:text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2.5">
                    {tasks.length === 0 && (
                      <div className="text-[11px] text-[#444] text-center py-8">No tasks</div>
                    )}
                    {tasks.map(task => (
                      <TaskCard key={task.id} task={task} />
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
        <div className="px-4 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white">Live Activity</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
          {liveActivities.map((activity, i) => (
            <LiveActivityItem key={i} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
