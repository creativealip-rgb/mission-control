'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Code, Image, File } from 'lucide-react';

const categories = ['All', 'Newsletter', 'Code', 'Planning', 'Images'];
const categoryColors: Record<string, string> = { 'Newsletter': '#EF4444', 'Code': '#3B82F6', 'Planning': '#8B5CF6', 'Images': '#F59E0B', 'All': '#9CA3AF' };
const categoryIcons: Record<string, any> = { 'Newsletter': FileText, 'Code': Code, 'Planning': FileText, 'Images': Image, 'All': File };

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [documents, setDocuments] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => setDocuments(data.documents || []));
  }, []);

  const filteredDocs = documents.filter((doc: any) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.content?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Docs</h1>
        <p className="text-[#9CA3AF] text-sm">Central document library</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={20} />
        <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#5E6AD2]" />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-[#5E6AD2] text-white' : 'bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#2A2A2A]'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc: any) => {
          const Icon = categoryIcons[doc.category] || File;
          return (
            <div key={doc.id} className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-4 hover:border-[#5E6AD2]/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: (categoryColors[doc.category] || '#9CA3AF') + '20' }}>
                  <Icon size={20} style={{ color: categoryColors[doc.category] || '#9CA3AF' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{doc.title}</h3>
                  <p className="text-xs text-[#9CA3AF]">{doc.file_type} • {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-[#9CA3AF] text-sm line-clamp-2 mb-3">{doc.content}</p>
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: (categoryColors[doc.category] || '#9CA3AF') + '20', color: categoryColors[doc.category] || '#9CA3AF' }}>{doc.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
