'use client';

import { FolderKanban } from 'lucide-react';

const projects = [
  {
    id: 1, name: 'Agent Org Infrastructure', status: 'Active', statusColor: 'bg-emerald-500',
    desc: 'Core infrastructure for the autonomous agent organization. Health monitoring, message bus, shared...',
    progress: 100, tasksDone: 10, tasksTotal: 10,
    agent: 'C', agentName: 'Charlie', agentColor: 'bg-emerald-500',
    priority: 'high', priorityColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    time: '8 days ago by Henry',
  },
  {
    id: 2, name: 'Mission Control', status: 'Active', statusColor: 'bg-emerald-500',
    desc: 'Central dashboard for the agent organization. Tasks, projects, approvals, agent activity, docs, and real-tim...',
    progress: 70, tasksDone: 0, tasksTotal: 0,
    agent: 'H', agentName: 'Henry', agentColor: 'bg-indigo-500',
    priority: 'high', priorityColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    time: '8 days ago by Henry',
  },
  {
    id: 3, name: 'Skool AI Extension', status: '', statusColor: '',
    desc: '"Ask Alex" Chrome extension for Vibe Coding Academy. RAG pipeline over course conte...',
    progress: 0, tasksDone: 0, tasksTotal: 0,
    agent: 'H', agentName: 'Henry', agentColor: 'bg-indigo-500',
    priority: '', priorityColor: '',
    time: '8 days ago by Henry',
  },
  {
    id: 4, name: 'Micro-SaaS Factory', status: 'Planning', statusColor: 'bg-blue-500',
    desc: "Violet's opportunity engine — research market gaps, validate ideas, and build small SaaS products...",
    progress: 0, tasksDone: 0, tasksTotal: 0,
    agent: 'V', agentName: 'Violet', agentColor: 'bg-purple-500',
    priority: 'medium', priorityColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    time: '8 days ago by Violet',
  },
  {
    id: 5, name: 'Even G2 Integration', status: 'Planning', statusColor: 'bg-blue-500',
    desc: 'Smart glasses bridge — connecting Even Realities G2 glasses to Henry via BLE AI assistant in your glasses ...',
    progress: 0, tasksDone: 0, tasksTotal: 0,
    agent: 'U', agentName: 'Unassigned', agentColor: 'bg-gray-500',
    priority: 'medium', priorityColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    time: '8 days ago',
  },
];

export default function ProjectsPage() {
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const planningCount = projects.filter(p => p.status === 'Planning').length;

  return (
    <div className="h-full bg-[#000000] overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Projects</h1>
          <p className="text-xs text-[#666]">{projects.length} total • {activeCount} active • {planningCount} planning</p>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] transition-colors cursor-pointer group">
            {/* Title + Status */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-white pr-2">{project.name}</h3>
              {project.status && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md ${project.statusColor} text-white shrink-0`}>
                  {project.status}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[11px] text-[#777] leading-relaxed mb-4">{project.desc}</p>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] text-[#666] w-8">{project.progress}%</span>
              <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-[#666]">{project.tasksDone}/{project.tasksTotal}</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${project.agentColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {project.agent}
                </div>
                <span className="text-[11px] text-[#888]">{project.agentName}</span>
              </div>
              {project.priority && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md border ${project.priorityColor}`}>
                  {project.priority}
                </span>
              )}
            </div>

            <p className="text-[10px] text-[#444] mt-3">{project.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
