'use client';

import { RefreshCw } from 'lucide-react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date().getDay(); // 0=Sun

const alwaysRunning = [
  { name: 'Reaction Poller', freq: 'Every 5 min', color: 'bg-[#222] text-[#aaa] border-[#333]' },
  { name: 'Trend Radar', freq: '5x daily', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { name: 'Opportunity Scanner', freq: '6x daily', color: 'bg-[#222] text-[#aaa] border-[#333]' },
];

const scheduleItems = [
  { title: 'Trend Radar', time: '12:00 PM', color: 'bg-red-600/80 border-red-700/50', textColor: 'text-white' },
  { title: 'Morning Kickoff', time: '6:55 AM', color: 'bg-indigo-600/80 border-indigo-700/50', textColor: 'text-white' },
  { title: 'YouTube OpenClaw R...', time: '7:00 AM', color: 'bg-blue-600/80 border-blue-700/50', textColor: 'text-white' },
  { title: 'Scout Morning Resear...', time: '8:00 AM', color: 'bg-emerald-600/80 border-emerald-700/50', textColor: 'text-white' },
  { title: 'Morning Brief', time: '8:00 AM', color: 'bg-amber-600/80 border-amber-700/50', textColor: 'text-white' },
  { title: 'Trend Radar Daily Dig...', time: '8:00 AM', color: 'bg-gray-600/80 border-gray-700/50', textColor: 'text-white' },
  { title: 'Quill Script Writer', time: '8:30 AM', color: 'bg-purple-600/80 border-purple-700/50', textColor: 'text-white' },
  { title: 'Daily Digest', time: '9:00 PM', color: 'bg-teal-600/80 border-teal-700/50', textColor: 'text-white' },
  { title: 'Evening Wrap Up', time: '9:00 PM', color: 'bg-orange-600/80 border-orange-700/50', textColor: 'text-white' },
];

// Extra items that only appear on certain days
const specialItems: Record<number, { title: string; time: string; color: string; textColor: string }[]> = {
  1: [
    { title: 'Stock Scarcity Resear...', time: '7:00 AM', color: 'bg-cyan-600/80 border-cyan-700/50', textColor: 'text-white' },
    { title: 'Evening Wrap Up', time: '9:00 PM', color: 'bg-orange-600/80 border-orange-700/50', textColor: 'text-white' },
  ],
  3: [
    { title: 'Weekly Newsletter Dr...', time: '12:00 PM', color: 'bg-pink-600/80 border-pink-700/50', textColor: 'text-white' },
  ],
};

export default function CalendarPage() {
  return (
    <div className="h-full bg-[#000000] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">Scheduled Tasks</h1>
          <p className="text-xs text-[#666] mt-0.5">Henry&apos;s automated routines</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-white text-xs rounded-lg font-medium">Week</button>
          <button className="px-3 py-1.5 text-[#666] hover:text-white text-xs rounded-lg font-medium transition-colors">Today</button>
          <button className="text-[#555] hover:text-white transition-colors p-1.5">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Always Running */}
      <div className="mx-8 mb-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm">✨</span>
          <span className="text-sm font-semibold text-white">Always Running</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {alwaysRunning.map((item, i) => (
            <span key={i} className={`text-[11px] px-3 py-1.5 rounded-full border ${item.color}`}>
              {item.name} • {item.freq}
            </span>
          ))}
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="flex-1 overflow-hidden mx-8 mb-6">
        <div className="grid grid-cols-7 h-full gap-[1px] bg-[#111] rounded-xl overflow-hidden border border-[#1a1a1a]">
          {days.map((day, dayIndex) => (
            <div key={day} className="bg-[#050505] flex flex-col overflow-hidden">
              {/* Day Header */}
              <div className={`px-3 py-2.5 border-b border-[#1a1a1a] text-center ${dayIndex === today ? 'text-amber-400' : 'text-[#888]'
                }`}>
                <span className="text-[13px] font-semibold">{day}</span>
              </div>

              {/* Schedule Items */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-1.5 space-y-1">
                {scheduleItems.map((item, i) => (
                  <div key={i} className={`px-2.5 py-2 rounded-lg border ${item.color} cursor-pointer hover:opacity-80 transition-opacity`}>
                    <p className={`text-[11px] font-medium ${item.textColor} truncate`}>{item.title}</p>
                    <p className="text-[9px] text-white/50 mt-0.5">{item.time}</p>
                  </div>
                ))}
                {specialItems[dayIndex]?.map((item, i) => (
                  <div key={`s-${i}`} className={`px-2.5 py-2 rounded-lg border ${item.color} cursor-pointer hover:opacity-80 transition-opacity`}>
                    <p className={`text-[11px] font-medium ${item.textColor} truncate`}>{item.title}</p>
                    <p className="text-[9px] text-white/50 mt-0.5">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
