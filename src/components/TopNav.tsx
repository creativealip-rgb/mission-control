'use client';

import { useState, useEffect, useCallback } from 'react';
import { PanelLeft, Eye, RefreshCw, Search, Pause, Play } from 'lucide-react';

export default function TopNav() {
    const [isPaused, setIsPaused] = useState(false);
    const [pinging, setPinging] = useState(false);
    const [gwStatus, setGwStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [sessionCount, setSessionCount] = useState(0);

    const checkStatus = useCallback(async () => {
        try {
            const [statusRes, sessRes] = await Promise.all([
                fetch('/api/gateway/status'),
                fetch('/api/gateway/sessions'),
            ]);
            const statusData = await statusRes.json();
            const sessData = await sessRes.json();
            setGwStatus(statusData.connected ? 'online' : 'offline');
            setSessionCount((sessData.sessions ?? []).length);
        } catch {
            setGwStatus('offline');
        }
    }, []);

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30_000);
        return () => clearInterval(interval);
    }, [checkStatus]);

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
                    {/* Gateway Status */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0a0a0a] border border-[#1a1a1a]">
                        <span className={`w-1.5 h-1.5 rounded-full ${gwStatus === 'online'
                            ? 'bg-emerald-400 animate-pulse'
                            : gwStatus === 'offline'
                                ? 'bg-red-500'
                                : 'bg-amber-400 animate-pulse'
                            }`} />
                        <span className={`text-[10px] font-medium ${gwStatus === 'online'
                            ? 'text-emerald-400'
                            : gwStatus === 'offline'
                                ? 'text-red-400'
                                : 'text-amber-400'
                            }`}>
                            {gwStatus === 'online'
                                ? `OpenClaw · ${sessionCount} active`
                                : gwStatus === 'offline'
                                    ? 'OpenClaw · Offline'
                                    : 'Checking...'}
                        </span>
                    </div>

                    <button
                        onClick={handlePing}
                        className={`text-xs font-medium transition-colors ${pinging ? 'text-emerald-400' : 'text-[#888888] hover:text-white'}`}
                    >
                        {pinging ? '● Pinging...' : 'Ping Henry'}
                    </button>
                    <button className="text-[#666666] hover:text-white transition-colors flex items-center justify-center">
                        <Eye size={14} />
                    </button>
                    <button
                        onClick={checkStatus}
                        className="text-[#666666] hover:text-white transition-colors flex items-center justify-center"
                        title="Refresh gateway status"
                    >
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
