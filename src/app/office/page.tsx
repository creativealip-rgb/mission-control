'use client';

import { useState } from 'react';
import { Zap, MessageSquare, Users, MonitorPlay, Coffee } from 'lucide-react';

// Agent definitions with positions on the virtual office grid
const officeAgents = [
  { id: 'henry', name: 'Henry', emoji: '🦉', color: 'bg-indigo-500', x: 55, y: 22, task: 'Build Council — S...', active: true },
  { id: 'alex', name: 'Alex', emoji: '🔴', color: 'bg-red-500', x: 28, y: 32, task: '', active: true },
  { id: 'quill', name: 'Quill', emoji: '🪶', color: 'bg-amber-500', x: 20, y: 48, task: '', active: true },
  { id: 'echo', name: 'Echo', emoji: '🐸', color: 'bg-teal-500', x: 32, y: 48, task: '', active: true },
  { id: 'violet', name: 'Violet', emoji: '🔮', color: 'bg-purple-500', x: 42, y: 48, task: '', active: true },
  { id: 'scout', name: 'Scout', emoji: '🟢', color: 'bg-emerald-500', x: 46, y: 48, task: '', active: true },
  { id: 'codex', name: 'Codex', emoji: '📦', color: 'bg-blue-500', x: 56, y: 46, task: '', active: true },
  { id: 'charlie', name: 'Charlie', emoji: '🐱', color: 'bg-orange-500', x: 38, y: 58, task: '', active: false },
  { id: 'pixel', name: 'Pixel', emoji: '🎨', color: 'bg-pink-500', x: 65, y: 66, task: '', active: true },
];

const demoControls = [
  { label: 'All Working', icon: Zap, color: 'bg-emerald-600 hover:bg-emerald-500' },
  { label: 'Gather', icon: Users, color: 'bg-[#333] hover:bg-[#444]' },
  { label: 'Run Meeting', icon: MonitorPlay, color: 'bg-[#333] hover:bg-[#444]' },
  { label: 'Watercooler', icon: Coffee, color: 'bg-teal-600 hover:bg-teal-500' },
];

const bottomAgents = [
  { name: 'Alex', color: 'border-red-500', bg: 'bg-red-500/10' },
  { name: 'Henry', color: 'border-indigo-500', bg: 'bg-indigo-500/20' },
  { name: 'Scout', color: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Quill', color: 'border-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Pixel', color: 'border-pink-500', bg: 'bg-pink-500/10' },
  { name: 'Echo', color: 'border-teal-500', bg: 'bg-teal-500/10' },
  { name: 'Codex', color: 'border-blue-500', bg: 'bg-blue-500/10' },
];

export default function OfficePage() {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-[#000000] overflow-hidden">

      {/* Demo Controls Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1a1a1a] bg-[#050505] shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm">✨</span>
          <span className="text-sm font-semibold text-white">Demo Controls</span>
        </div>
        {demoControls.map(ctrl => {
          const Icon = ctrl.icon;
          return (
            <button key={ctrl.label} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white rounded-lg transition-colors ${ctrl.color}`}>
              <Icon size={14} />
              {ctrl.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Virtual Office Canvas */}
        <div className="flex-1 relative overflow-hidden">
          {/* Chat bar at top */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span className="text-xs text-[#888]">+</span>
              <span className="text-xs text-[#888]">Start Chat</span>
            </div>
          </div>

          {/* Checkered Floor */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #111 25%, transparent 25%),
                linear-gradient(-45deg, #111 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #111 75%),
                linear-gradient(-45deg, transparent 75%, #111 75%)
              `,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
              backgroundColor: '#0a0a0a',
            }}
          />

          {/* Meeting table (oval) */}
          <div className="absolute" style={{ left: '35%', top: '52%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-32 h-20 bg-[#2a2a2a] rounded-[50%] border-2 border-[#333] opacity-60" />
          </div>

          {/* Desks */}
          {[
            { x: 25, y: 25 }, { x: 40, y: 25 }, { x: 55, y: 16 },
            { x: 20, y: 35 }, { x: 35, y: 35 }, { x: 50, y: 35 },
          ].map((desk, i) => (
            <div key={i} className="absolute" style={{ left: `${desk.x}%`, top: `${desk.y}%` }}>
              <div className="w-12 h-8 bg-[#333] border border-[#444] rounded-sm flex items-center justify-center">
                <div className="w-6 h-4 bg-blue-500/40 rounded-sm" />
              </div>
              <div className="w-1 h-4 bg-[#444] mx-auto" />
            </div>
          ))}

          {/* Decorative elements (green circles = plants) */}
          {[
            { x: 15, y: 65 }, { x: 20, y: 70 }, { x: 72, y: 60 },
          ].map((plant, i) => (
            <div key={i} className="absolute" style={{ left: `${plant.x}%`, top: `${plant.y}%` }}>
              <div className="w-8 h-8 bg-emerald-500 rounded-full opacity-80" />
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
              {/* Task tooltip */}
              {hoveredAgent === agent.id && agent.task && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 whitespace-nowrap z-30">
                  <p className="text-[11px] text-white">{agent.task}</p>
                </div>
              )}
              {/* Agent sprite */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center text-lg ${!agent.active ? 'opacity-50' : ''}`}>
                  {agent.emoji}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-medium ${agent.active ? 'text-white' : 'text-[#666]'}`}>{agent.name}</span>
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
            <span className="text-[10px] text-[#555]">Last hour</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-[11px] text-[#555]">No recent activity.</p>
              <p className="text-[10px] text-[#444] mt-1">Events will appear here.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Agent Bar */}
      <div className="flex border-t border-[#1a1a1a] shrink-0">
        {bottomAgents.map(agent => (
          <button key={agent.name} className={`flex-1 py-2.5 text-center text-xs font-medium text-white border-t-2 ${agent.color} ${agent.bg} transition-colors hover:opacity-80`}>
            {agent.name}
          </button>
        ))}
      </div>
    </div>
  );
}
