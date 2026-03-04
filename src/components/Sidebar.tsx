'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar, FolderKanban, BrainCircuit, FileText,
  Users, Building2
} from 'lucide-react';

const menuGroups = [
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Tasks', href: '/', icon: LayoutDashboard },
    ]
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Projects', href: '/projects', icon: FolderKanban },
      { name: 'Memory', href: '/memories', icon: BrainCircuit },
      { name: 'Docs', href: '/docs', icon: FileText },
    ]
  },
  {
    title: 'ORGANIZATION',
    items: [
      { name: 'Office', href: '/office', icon: Building2 },
      { name: 'Team', href: '/team', icon: Users },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-60 bg-[#050505] border-r border-[#1a1a1a] h-full flex flex-col relative z-20">

      {/* Menu Groups */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-2">
        {menuGroups.map((group, index) => (
          <div key={group.title} className="mb-4">
            {/* Group items */}
            <ul className="space-y-[2px]">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 md:px-5 py-2 mx-2 rounded-md transition-colors ${isActive
                        ? 'bg-[#1a1a1a] text-white'
                        : 'text-[#888888] hover:bg-[#111111] hover:text-[#cccccc]'
                        }`}
                    >
                      <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                      <span className="text-[13px] font-medium hidden md:block tracking-wide">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Divider between groups, except the last one */}
            {index < menuGroups.length - 1 && (
              <div className="mt-4 mb-2 mx-5 border-t border-[#1a1a1a]" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 group cursor-pointer w-full">
          <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
            H
          </div>
          <div className="hidden md:flex flex-col flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">Henry</p>
            <p className="text-[11px] text-[#888888] truncate">Lead User</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
