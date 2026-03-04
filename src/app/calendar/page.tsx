'use client';

import { useState, useEffect } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 12 }, (_, i) => i + 8);

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/schedules')
      .then(res => res.json())
      .then(data => setSchedules(data.schedules || []));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kalender</h1>
          <p className="text-[#9CA3AF] text-sm">Schedule & Cron Jobs</p>
        </div>
        <button className="px-4 py-2 bg-[#5E6AD2] text-white rounded-lg text-sm font-medium hover:bg-[#4B52B8] transition-colors">
          + New Schedule
        </button>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden">
        <div className="grid grid-cols-8 border-b border-[#2A2A2A]">
          <div className="p-3 text-[#9CA3AF] text-sm"></div>
          {days.map(day => (
            <div key={day} className="p-3 text-center text-white text-sm font-medium border-l border-[#2A2A2A]">
              {day}
            </div>
          ))}
        </div>
        
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-[#2A2A2A]">
            <div className="p-3 text-[#9CA3AF] text-xs">
              {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
            </div>
            {days.map((day, i) => (
              <div key={`${day}-${hour}`} className="p-1 border-l border-[#2A2A2A] min-h-[40px]">
                {schedules.filter((s: any) => {
                  const cronParts = s.cron_expression?.split(' ') || [];
                  return cronParts[1] === hour.toString() || cronParts[4]?.includes((i + 1).toString());
                }).map((s: any) => (
                  <div 
                    key={s.id}
                    className="text-xs p-1 rounded mb-1"
                    style={{ backgroundColor: s.color + '30', color: s.color }}
                  >
                    {s.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-white mb-3">Active Schedules</h3>
        <div className="space-y-2">
          {schedules.map((s: any) => (
            <div key={s.id} className="flex items-center gap-3 bg-[#1A1A1A] p-3 rounded-lg border border-[#2A2A2A]">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
              <span className="text-white text-sm flex-1">{s.title}</span>
              <code className="text-xs text-[#9CA3AF] bg-[#2A2A2A] px-2 py-1 rounded">
                {s.cron_expression}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
