'use client';

import { useState, useEffect } from 'react';

const categoryColors: Record<string, string> = {
  'Idea': '#10B981',
  'Meeting': '#3B82F6',
  'Reflection': '#F59E0B',
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/memories')
      .then(res => res.json())
      .then(data => setMemories(data.memories || []));
  }, []);

  const groupedMemories = memories.reduce((acc: any, mem: any) => {
    const date = new Date(mem.created_at).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(mem);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Memories</h1>
          <p className="text-[#9CA3AF] text-sm">Digital journal</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {Object.entries({'Idea': '💡', 'Meeting': '📅', 'Reflection': '💭'}).map(([cat, icon]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat] }}></div>
            <span className="text-sm text-[#9CA3AF]">{icon} {cat}</span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {Object.entries(groupedMemories).map(([date, mems]: [string, any]) => (
          <div key={date} className="flex gap-4">
            <div className="w-48 flex-shrink-0">
              <p className="text-[#9CA3AF] text-sm">{date}</p>
            </div>
            <div className="flex-1 space-y-3">
              {mems.map((mem: any) => (
                <div key={mem.id} className="bg-[#1A1A1A] rounded-lg p-4 border-l-4" style={{ borderLeftColor: categoryColors[mem.category] || '#5E6AD2' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: categoryColors[mem.category] + '20', color: categoryColors[mem.category] }}>{mem.category}</span>
                  </div>
                  <p className="text-white text-sm">{mem.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
