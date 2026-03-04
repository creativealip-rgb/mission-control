'use client';

import { useState } from 'react';
import { PanelLeft, Eye, RefreshCw, Search, Pause, Play } from 'lucide-react';

export default function TopNav() {
    const [isPaused, setIsPaused] = useState(false);
    const [pinging, setPinging] = useState(false);

    async function handlePing() {
        setPinging(true);
        try {
            await fetch('/api/gateway/ping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionKey: 'agent:main:main', message: 'heartbeat: check status' }),
            });
        } catch { }
        setTimeout(() => setPinging(false), 2000);
    }

    async function handlePause() {
        const newState = !isPaused;
        setIsPaused(newState);
        try {
            await fetch('/api/gateway/pause', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: newState ? 'pause' : 'resume' }),
            });
        } catch { }
    }

    return (
        <header className="h-12 border-b border-[#111111] bg-[#000000] flex items-center justify-between px-4 shrink-0">
            {/* Left side */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <button className="text-[#888] hover:text-white transition-colors p-1 rounded-sm hover:bg-[#1a1a1a]">
                        <PanelLeft size={16} />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-[4px] bg-white text-black flex items-center justify-center font-bold text-[10px]">
                            ⌘
                        </div>
                        <span className="font-semibold text-[#eeeeee] text-[13px] tracking-tight">
                            Mission Control
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                    <button
                        onClick={handlePing}
                        className={`text-xs font-medium transition-colors ${pinging ? 'text-emerald-400' : 'text-[#888888] hover:text-white'}`}
                    >
                        {pinging ? '● Pinging...' : 'Ping Henry'}
                    </button>
                    <button className="text-[#666666] hover:text-white transition-colors flex items-center justify-center">
                        <Eye size={14} />
                    </button>
                    <button className="text-[#666666] hover:text-white transition-colors flex items-center justify-center">
                        <RefreshCw size={13} />
                    </button>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                    <Search size={14} className="absolute left-2.5 text-[#555]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[6px] py-[5px] pl-8 pr-10 text-xs text-white focus:outline-none focus:border-[#333] transition-colors w-56 placeholder:text-[#555]"
                    />
                    <div className="absolute right-1.5 flex items-center gap-0.5 text-[9px] text-[#666] font-mono bg-[#111] border border-[#222] rounded-[4px] px-1.5 py-0.5">
                        <span>⌘</span><span>K</span>
                    </div>
                </div>

                <button
                    onClick={handlePause}
                    className={`flex items-center gap-2 py-1.5 rounded-md transition-colors ${isPaused ? 'text-amber-400 hover:text-amber-300' : 'text-[#888] hover:text-white'
                        }`}
                >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    <span className="text-xs font-medium">{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
            </div>
        </header>
    );
}
