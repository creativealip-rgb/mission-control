'use client';

import { useState, useEffect } from 'react';

type AgentPosition = { id: number; name: string; role: string; x: number; y: number; atDesk: boolean };

const initialPositions: AgentPosition[] = [
  { id: 1, name: 'Henry', role: 'Leader', x: 200, y: 150, atDesk: true },
  { id: 2, name: 'Charlie', role: 'Engineer', x: 100, y: 250, atDesk: true },
  { id: 3, name: 'Ralph', role: 'Assistant', x: 300, y: 250, atDesk: false },
  { id: 4, name: 'Violet', role: 'Researcher', x: 450, y: 200, atDesk: true },
];

export default function VirtualOfficePage() {
  const [agents, setAgents] = useState(initialPositions);
  const [selectedAgent, setSelectedAgent] = useState<AgentPosition | null>(null);

  const agentColors = ['#5E6AD2', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Virtual Office</h1>
          <p className="text-[#9CA3AF] text-sm">Gamified AI workspace</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-4 overflow-hidden">
          <svg viewBox="0 0 600 450" className="w-full h-auto">
            <rect x="0" y="0" width="600" height="450" fill="#0D0D0D" />
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1A1A1A" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="600" height="450" fill="url(#grid)" />
            <rect x="20" y="20" width="560" height="410" fill="none" stroke="#2A2A2A" strokeWidth="2" rx="8"/>
            
            {/* Desks */}
            {[ {x:150,y:150,l:'Henry'}, {x:80,y:250,l:'Charlie'}, {x:280,y:250,l:'Ralph'}, {x:430,y:200,l:'Violet'}].map((d,i) => (
              <g key={i}>
                <rect x={d.x} y={d.y} width="60" height="40" fill="#2A2A2A" rx="4" stroke="#3A3A3A"/>
                <rect x={d.x+5} y={d.y+5} width="20" height="15" fill="#1A1A1A" rx="2"/>
                <text x={d.x+30} y={d.y+55} textAnchor="middle" fill="#9CA3AF" fontSize="10">{d.l}</text>
              </g>
            ))}

            {/* Water */}
            <g><rect x="190" y="340" width="20" height="30" fill="#3B82F6" rx="2"/><circle cx="200" cy="345" r="5" fill="#60A5FA"/><text x="200" y="385" textAnchor="middle" fill="#9CA3AF" fontSize="10">Water</text></g>
            
            {/* Plant */}
            <g><rect x="390" y="355" width="20" height="15" fill="#10B981" rx="2"/><rect x="395" y="345" width="10" height="15" fill="#059669" rx="2"/><text x="400" y="385" textAnchor="middle" fill="#9CA3AF" fontSize="10">Plant</text></g>
            
            {/* Agents */}
            {agents.map((agent, i) => (
              <g key={agent.id} onClick={() => setSelectedAgent(agent)} className="cursor-pointer hover:opacity-80" style={{ transform: `translate(${agent.x}px, ${agent.y}px)` }}>
                <circle cx="0" cy="0" r="18" fill={agentColors[i]}/>
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{agent.name[0]}</text>
                <circle cx="12" cy="-8" r="6" fill={agent.atDesk ? '#10B981' : '#9CA3AF'} stroke="#1A1A1A" strokeWidth="2"/>
                <text x="0" y="35" textAnchor="middle" fill="white" fontSize="10">{agent.name}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="w-72">
          <h3 className="text-white font-medium mb-4">Active Agents</h3>
          <div className="space-y-2">
            {agents.map((agent, i) => (
              <div key={agent.id} onClick={() => setSelectedAgent(agent)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedAgent?.id === agent.id ? 'bg-[#5E6AD2]/20 border-[#5E6AD2]' : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#5E6AD2]/50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: agentColors[i] }}>{agent.name[0]}</div>
                  <div className="flex-1"><p className="text-white text-sm font-medium">{agent.name}</p><p className="text-[#9CA3AF] text-xs">{agent.role}</p></div>
                  <div className={`w-2 h-2 rounded-full ${agent.atDesk ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
