'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const categoryTags = [
  { label: 'Journal', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { label: '🔥 Nova', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { label: 'Other', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { label: 'Docs', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { label: 'Newsletters', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { label: 'YouTube Scripts', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { label: 'Notes', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { label: 'Content', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
];

const fileExtensions = ['.md', '.html', '.pdf', 'unknown', '.webm', '.json', '.mobi', '.epub'];

const mockDocs = [
  {
    id: 1, name: '2026-02-26.md', category: 'Journal', categoryColor: 'bg-purple-500',
    content: `# Newsletter Draft — Feb 25, 2026

## Subject Line Options:

1. Vibe coding just went mainstream. Here's how to cash in before everyone else.
2. The New York Times just wrote about vibe coding. Here's what that means for YOU.
3. Vibe coding is now a $100 million industry. Are you in or are you watching?
4. Everyone will be vibe coding in 6 months. Here's how to be ahead of ALL of them.
5. I've been vibe coding for 18 months. Here's what 99% of people still don't understand.

## Draft:

This week, The New York Times published an opinion piece about vibe coding.

Let that sink in.

A year ago, this was a niche thing that me and a handful of other people were obsessing over. Andrej Karpathy coined the term. A few thousand of us were in the trenches actually doing it. Most people had no idea what it meant.

Now it has a **Wikipedia page**. The NYT is writing about it. A company called Code Metal just raised **$100M** to build infrastructure around it. Software companies are formally restructuring their entire engineering teams around it.

**This is the tipping point.**`,
  },
  {
    id: 2, name: '2026-02-26.md', category: 'Other', categoryColor: 'bg-gray-500',
    content: '# Agent configuration notes...',
  },
  {
    id: 3, name: '2026-02-25.md', category: 'Journal', categoryColor: 'bg-purple-500',
    content: '# February 25 journal entry...',
  },
  {
    id: 4, name: '2026-02-25-vibe-coding-mainstream-newsletter.md', category: 'Other', categoryColor: 'bg-gray-500',
    content: '# Vibe Coding Mainstream Newsletter Draft...',
  },
  {
    id: 5, name: 'arena-prd.md', category: 'Docs', categoryColor: 'bg-blue-500',
    content: '# Arena PRD\n\nProduct requirements document...',
  },
  {
    id: 6, name: '.DS_Store', category: 'Other', categoryColor: 'bg-gray-500',
    content: '(binary file)',
  },
];

export default function DocsPage() {
  const [selectedId, setSelectedId] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedDoc = mockDocs.find(d => d.id === selectedId) || mockDocs[0];

  return (
    <div className="flex h-full w-full bg-[#000000] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[300px] flex flex-col border-r border-[#1a1a1a] bg-[#050505] shrink-0">
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#444]"
            />
          </div>
        </div>

        {/* Category Tags */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {categoryTags.map(tag => (
              <button key={tag.label} className={`text-[10px] px-2 py-1 rounded-md border ${tag.color} hover:opacity-80 transition-opacity`}>
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Extension Filters */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1 mb-1">
            <ChevronDown className="w-3 h-3 text-[#555]" />
          </div>
          <div className="flex flex-wrap gap-1">
            {fileExtensions.map(ext => (
              <button key={ext} className="text-[10px] px-2 py-1 bg-[#111] border border-[#222] text-[#888] rounded hover:text-white transition-colors">
                {ext}
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
          {mockDocs.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedId(doc.id)}
              className={`w-full text-left py-3 px-3 rounded-lg mb-1 transition-colors ${selectedId === doc.id ? 'bg-[#1a1a1a] border border-[#333]' : 'hover:bg-[#111] border border-transparent'
                }`}
            >
              <p className={`text-[13px] truncate ${selectedId === doc.id ? 'text-white font-medium' : 'text-[#ccc]'}`}>
                {doc.name}
              </p>
              <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded ${doc.categoryColor} text-white`}>
                {doc.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#050505] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#050505]/95 backdrop-blur-sm border-b border-[#1a1a1a] px-10 py-5 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">{selectedDoc.name}</h1>
            <span className={`text-[10px] px-2 py-0.5 rounded ${selectedDoc.categoryColor} text-white`}>
              {selectedDoc.category}
            </span>
          </div>
          <p className="text-[11px] text-[#555] mt-1">3.2 KB • 583 words</p>
        </div>

        {/* Document Content */}
        <div className="px-10 py-8 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {selectedDoc.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mb-4">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-8 mb-4">{line.slice(3)}</h2>;
              if (line.match(/^\d+\. /)) return <li key={i} className="text-sm text-[#bbb] ml-4 mb-1.5 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
              if (line.startsWith('- ')) return <li key={i} className="text-sm text-[#bbb] ml-4 mb-1 list-disc">{line.slice(2)}</li>;
              if (line.trim() === '') return <div key={i} className="h-3" />;
              // Handle bold text within paragraphs
              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="text-sm text-[#bbb] leading-relaxed mb-2">
                  {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
