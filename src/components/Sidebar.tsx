'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderKanban, 
  Users, 
  BookOpen, 
  FileText,
  Building2
} from 'lucide-react';

const modules = [
  { name: 'Task Board', href: '/', icon: LayoutDashboard },
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tim & Misi', href: '/team', icon: Users },
  { name: 'Memories', href: '/memories', icon: BookOpen },
  { name: 'Docs', href: '/docs', icon: FileText },
  { name: 'Virtual Office', href: '/office', icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-64 bg-[#0D0D0D] border-r border-[#2A2A2A] min-h-screen flex flex-col">
      <div className="p-4 border-b border-[#2A2A2A]">
        <h1 className="text-lg font-bold text-white hidden md:block">Mission Control</h1>
        <span className="text-xs text-[#5E6AD2] hidden md:block">AI-Powered</span>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = pathname === module.href;
          
          return (
            <Link
              key={module.href}
              href={module.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#5E6AD2]/20 text-[#5E6AD2]' 
                  : 'text-[#9CA3AF] hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="hidden md:block text-sm">{module.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#5E6AD2] flex items-center justify-center text-white text-sm font-bold">
            H
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-white">Henry</p>
            <p className="text-xs text-[#9CA3AF]">Leader</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
