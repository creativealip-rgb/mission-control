'use client';

import { useState, useEffect } from 'react';

export default function TeamPage() {
  const [mission, setMission] = useState('');
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents || []);
        setMission(data.mission || '');
      });
  }, []);

  const getSubordinates = (parentId: number) => {
    return agents.filter(a => a.parent_id === parentId);
  };

  const rootAgent = agents.find(a => a.parent_id === null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tim & Misi</h1>
        <p className="text-[#9CA3AF] text-sm">Organization structure & mission</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-4 mb-8">
        <h3 className="text-[#9CA3AF] text-sm mb-2">Mission Statement</h3>
        <textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          className="w-full bg-transparent text-xl text-white font-medium resize-none focus:outline-none"
          rows={2}
          placeholder="Enter your mission statement..."
        />
      </div>

      <div className="flex flex-col items-center mb-8">
        {rootAgent && (
          <>
            <div className="bg-[#5E6AD2] p-4 rounded-xl text-center min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                {rootAgent.name[0]}
              </div>
              <p className="text-white font-medium">{rootAgent.name}</p>
              <p className="text-white/70 text-sm">{rootAgent.role}</p>
            </div>
            <div className="w-0.5 h-8 bg-[#2A2A2A]"></div>
            <div className="flex gap-4">
              {getSubordinates(rootAgent.id).map((sub: any) => (
                <div key={sub.id} className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-[#2A2A2A] mb-2"></div>
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-xl text-center min-w-[150px]">
                    <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white text-lg font-bold mx-auto mb-2">
                      {sub.name[0]}
                    </div>
                    <p className="text-white font-medium text-sm">{sub.name}</p>
                    <p className="text-[#9CA3AF] text-xs">{sub.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
