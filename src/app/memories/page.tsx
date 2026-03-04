'use client';

import { useState } from 'react';
import { Search, Calendar, Brain, ChevronDown, ChevronRight } from 'lucide-react';

const journalEntries = [
  {
    id: 1, date: '2026-02-26', day: 'Thursday', label: 'Yesterday', size: '4.8 KB', words: '772 words',
    content: `# 2026-02-26 — Thursday

## ⏰ 9:00 AM — Qwen 3.5 Medium Series Research

**What we discussed:** Alex shared the Qwen 3.5 Medium announcement tweet. 4 new models: 35B-A3B, 27B dense, Flash (API).

**Key findings:**
- 35B-A3B (3B active params) beats old 235B flagship — incredible efficiency
- 122B-A10B matches/beats 397B on agent benchmarks with only 10B active
- 27B dense gets best SWE-bench of the medium trio (72.4)
- All have MLX community ports available (4-bit, 8-bit)
- 35B-A3B at 4-bit is ~20GB RAM — could run alongside Opus on Studio 1

**Recommendations given:**
1. Keep 397B on Studio 2 for Charlie (still strongest overall)
2. Add 35B-A3B on Studio 1 as fast parallel worker (~20GB, blazing inference)
3. 122B-A10B as potential Charlie upgrade (similar quality, much faster, ~70GB)
4. 35B-A3B could replace Violet's MiniMax M2.5 on Mac Mini

**Decision:** Pending — Alex hasn't decided yet

---

## Overnight — Reborn Factory Results

Scout ran the overnight factory check on Reborn server module.`,
  },
  {
    id: 2, date: '2026-03-02', day: 'Monday', label: 'Yesterday', size: '8.7 KB', words: '1,253 words',
    content: '# 2026-03-02 — Monday\n\n## Morning sync completed.\n\nAll agents reported nominal status.',
  },
  {
    id: 3, date: '2026-03-01', day: 'Sunday', label: 'This Week', size: '6.8 KB', words: '1,058 words',
    content: '# 2026-03-01 — Sunday\n\n## Weekend research session on distributed inference.',
  },
  {
    id: 4, date: '2026-02-28', day: 'Saturday', label: 'February 2026', size: '12.6 KB', words: '2,001 words',
    content: '# 2026-02-28 — Saturday\n\n## Full system review and agent audit.',
  },
  {
    id: 5, date: '2026-02-27', day: 'Friday', label: 'February 2026', size: '3.9 KB', words: '614 words',
    content: '# 2026-02-27 — Friday\n\n## Pipeline optimization completed.',
  },
  {
    id: 6, date: '2026-02-25', day: 'Wednesday', label: 'February 2026', size: '0.9 KB', words: '122 words',
    content: '# 2026-02-25 — Wednesday\n\n## Quick note day.',
  },
  {
    id: 7, date: '2026-02-24', day: 'Tuesday', label: 'February 2026', size: '7.3 KB', words: '1,063 words',
    content: '# 2026-02-24 — Tuesday\n\n## Deep work on council system.',
  },
];

const dateGroups = [
  { label: 'Yesterday', count: 1 },
  { label: 'This Week', count: 1 },
  { label: 'February 2026', count: 25 },
];

export default function MemoriesPage() {
  const [selectedId, setSelectedId] = useState(1);
  const selectedEntry = journalEntries.find(e => e.id === selectedId) || journalEntries[0];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  return (
    <div className="flex h-full w-full bg-[#000000] overflow-hidden">

      {/* Left Sidebar */}
      <div className="w-[300px] flex flex-col border-r border-[#1a1a1a] bg-[#050505] shrink-0">

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] w-4 h-4" />
            <input type="text" placeholder="Search memory..." className="w-full bg-[#111] border border-[#222] rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#444]" />
          </div>
        </div>

        {/* Long-Term Memory */}
        <div className="mx-4 mb-4 p-3 bg-[#111] border border-[#222] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">Long-Term Memory 🔥</p>
              <p className="text-[10px] text-[#666]">1,608 words • Updated about 22 hours ago</p>
            </div>
          </div>
        </div>

        {/* Daily Journal Header */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#555]" />
          <span className="text-[11px] font-semibold text-[#666] tracking-wider">DAILY JOURNAL</span>
          <span className="text-[10px] text-[#444] bg-[#111] border border-[#222] rounded px-1.5 py-0.5">47 entries</span>
        </div>

        {/* Date Groups */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
          {dateGroups.map(group => {
            const entries = journalEntries.filter(e => e.label === group.label);
            return (
              <div key={group.label} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ChevronDown className="w-3 h-3 text-[#555]" />
                  <span className="text-[11px] text-[#777] font-medium">{group.label}</span>
                  <span className="text-[10px] text-[#444]">({group.count})</span>
                </div>
                {entries.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedId(entry.id)}
                    className={`w-full text-left py-2.5 px-3 rounded-lg mb-1 transition-colors ${selectedId === entry.id ? 'bg-[#1a1a1a] border border-[#333]' : 'hover:bg-[#111] border border-transparent'
                      }`}
                  >
                    <p className={`text-[13px] ${selectedId === entry.id ? 'text-white font-medium' : 'text-[#ccc]'}`}>
                      {formatDate(entry.date)}
                    </p>
                    <p className="text-[10px] text-[#555] mt-0.5">{entry.size} • {entry.words}</p>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#050505] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#050505]/95 backdrop-blur-sm border-b border-[#1a1a1a] px-10 py-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#555]" />
              <div>
                <h1 className="text-lg font-semibold text-white">{selectedEntry.date} — {selectedEntry.day}</h1>
                <p className="text-[11px] text-[#555]">
                  {new Date(selectedEntry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {' • '}{selectedEntry.size} • {selectedEntry.words}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-[#444]">Modified 4 days ago</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-10 py-8 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {selectedEntry.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-white mb-6">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-base font-semibold text-amber-400 mt-8 mb-3">{line.slice(3)}</h2>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-semibold text-white mt-4 mb-2">{line.slice(2, -2)}</p>;
              if (line.startsWith('- ')) return <li key={i} className="text-sm text-[#bbb] ml-4 mb-1 list-disc">{line.slice(2)}</li>;
              if (line.match(/^\d\. /)) return <li key={i} className="text-sm text-[#bbb] ml-4 mb-1 list-decimal">{line.replace(/^\d\. /, '')}</li>;
              if (line.startsWith('---')) return <hr key={i} className="border-[#222] my-6" />;
              if (line.startsWith('**') && line.includes(':**')) {
                const [label, ...rest] = line.split(':**');
                return <p key={i} className="text-sm text-[#bbb] mt-3 mb-1"><strong className="text-white">{label.slice(2)}:</strong>{rest.join(':**')}</p>;
              }
              if (line.trim() === '') return <div key={i} className="h-2" />;
              return <p key={i} className="text-sm text-[#bbb] leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
