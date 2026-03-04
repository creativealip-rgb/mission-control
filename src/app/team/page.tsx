'use client';

const teamMembers = {
  leader: {
    name: 'Henry', role: 'Chief of Staff', emoji: '🦉', color: 'bg-indigo-500', borderColor: 'border-indigo-500/30',
    desc: 'Coordinates, delegates, keeps the ship tight. The first point of contact between boss and machine.',
    tags: [
      { label: 'Orchestration', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
      { label: 'Clarity', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      { label: 'Delegation', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    ],
  },
  operations: [
    {
      name: 'Charlie', role: 'Infrastructure Engineer', emoji: '🐱', color: 'bg-orange-500', borderColor: 'border-orange-500/30',
      desc: 'Infrastructure and automation specialist.',
      tags: [
        { label: 'coding', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
        { label: 'infrastructure', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
        { label: 'automation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      ],
    },
    {
      name: 'Ralph', role: 'Foreman / QA Manager', emoji: '🔧', color: 'bg-gray-400', borderColor: 'border-gray-500/30',
      desc: 'Checks the work, signs off or sends it back. No-nonsense quality control.',
      tags: [
        { label: 'Quality Assurance', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        { label: 'Monitoring', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
        { label: 'Demo Recording', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
      ],
    },
  ],
  signalLayer: [
    {
      name: 'Scout', role: 'Trend Analyst', emoji: '🟢', color: 'bg-emerald-500', borderColor: 'border-emerald-500/30',
      desc: 'Finds leads, tracks signals, scouts...',
      tags: [
        { label: 'Speed', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
        { label: 'Radar', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
        { label: 'Intuition', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      ],
    },
    {
      name: 'Quill', role: 'Content Writer', emoji: '🪶', color: 'bg-amber-500', borderColor: 'border-amber-500/30',
      desc: 'Writes copy, designs content,...',
      tags: [
        { label: 'Voice', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        { label: 'Quality', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        { label: 'Design', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      ],
    },
    {
      name: 'Pixel', role: 'Thumbnail Designer', emoji: '🎨', color: 'bg-pink-500', borderColor: 'border-pink-500/30',
      desc: 'Designs thumbnails, crafts visuals...',
      tags: [
        { label: 'Visual', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
        { label: 'Attention', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
        { label: 'Style', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      ],
    },
    {
      name: 'Echo', role: 'Social Media Manager', emoji: '🐸', color: 'bg-teal-500', borderColor: 'border-teal-500/30',
      desc: 'Posts, engages, grows the audienc...',
      tags: [
        { label: 'Viral', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
        { label: 'Speed', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
        { label: 'Reach', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      ],
    },
  ],
  metaLayer: [
    {
      name: 'Codex', role: 'Lead Engineer', nickname: 'The Engineer', emoji: '📦', color: 'bg-blue-500', borderColor: 'border-blue-500/30',
      desc: 'Builds, fixes, automates. The quiet one who makes everything actually work.',
      tags: [
        { label: 'Code', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        { label: 'Systems', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        { label: 'Reliability', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      ],
    },
    {
      name: 'Violet', role: 'Research Analyst', emoji: '🔮', color: 'bg-purple-500', borderColor: 'border-purple-500/30',
      desc: 'Deep research and analysis specialist.',
      tags: [
        { label: 'research', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
        { label: 'analysis', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        { label: 'trends', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      ],
    },
  ],
};

function AgentCard({ agent, wide = false }: { agent: any; wide?: boolean }) {
  return (
    <div className={`bg-[#111] border border-[#222] rounded-xl p-5 hover:border-[#444] transition-colors ${wide ? 'col-span-1' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center text-xl`}>
          {agent.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-white">{agent.name}</h3>
            {agent.nickname && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-500 text-white">{agent.nickname}</span>
            )}
          </div>
          <p className="text-xs text-[#888]">{agent.role}</p>
        </div>
      </div>
      <p className="text-[11px] text-[#666] leading-relaxed mb-3">{agent.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {agent.tags.map((tag: any) => (
          <span key={tag.label} className={`text-[10px] px-2 py-0.5 rounded-md border ${tag.color}`}>
            {tag.label}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-[#555] cursor-pointer hover:text-white transition-colors">ROLE CARD →</p>
    </div>
  );
}

function SectionDivider({ left, right, center }: { left?: string; right?: string; center: string }) {
  return (
    <div className="flex items-center gap-4 my-8 px-8">
      {left && <span className="text-[10px] text-[#555]">✦ {left}</span>}
      <div className="flex-1 border-t border-[#222]" />
      <span className="text-[11px] text-[#666] font-medium">🖥 {center}</span>
      <div className="flex-1 border-t border-[#222]" />
      {right && <span className="text-[10px] text-[#555]">{right} ✦</span>}
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="h-full bg-[#000000] overflow-y-auto">
      {/* Hero Section */}
      <div className="text-center py-10 px-8">
        <div className="inline-block bg-[#1a1a1a] border border-[#333] rounded-xl px-6 py-3 mb-6">
          <p className="text-sm text-[#ccc] italic">
            &quot;An autonomous organization of AI agents that does work for me and produces value 24/7&quot;
          </p>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Meet the Team</h1>
        <p className="text-sm text-[#888]">9 AI agents across 3 machines, each with a real role and a real personality.</p>
        <p className="text-xs text-[#555] mt-3 max-w-2xl mx-auto leading-relaxed">
          We wanted to see what happens when AI doesn&apos;t just answer questions — but actually runs a company.
          Research markets. Write content. Post on social media. Ship products. All without being told what to do.
        </p>
      </div>

      {/* Henry - Leader */}
      <div className="max-w-2xl mx-auto px-8">
        <AgentCard agent={teamMembers.leader} />
      </div>

      {/* Vertical connector */}
      <div className="flex justify-center">
        <div className="w-px h-10 bg-[#333]" />
      </div>

      {/* Operations Section */}
      <SectionDivider center="OPERATIONS (Mac Studio 2)" />
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto px-8">
        {teamMembers.operations.map(agent => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>

      {/* Signal Layer */}
      <SectionDivider left="INPUT SIGNAL" right="OUTPUT ACTION ✦" center="" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-8">
        {teamMembers.signalLayer.map(agent => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>

      {/* Meta Layer */}
      <div className="flex items-center gap-4 my-8 px-8 max-w-3xl mx-auto">
        <div className="flex-1 border-t border-[#222]" />
        <span className="text-[11px] text-[#666] font-medium">● META LAYER</span>
        <div className="flex-1 border-t border-[#222]" />
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto px-8 pb-12">
        {teamMembers.metaLayer.map(agent => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
}
