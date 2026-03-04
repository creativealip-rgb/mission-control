'use client';

import { useState, useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects || []));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-[#9CA3AF] text-sm">Strategic focus & progress tracking</p>
        </div>
        <button className="px-4 py-2 bg-[#5E6AD2] text-white rounded-lg text-sm font-medium hover:bg-[#4B52B8] transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((project: any) => (
          <div 
            key={project.id} 
            className="bg-[#1A1A1A] p-4 rounded-lg border border-[#2A2A2A] hover:border-[#5E6AD2]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-medium">{project.name}</h3>
                <p className="text-[#9CA3AF] text-sm mt-1">{project.description}</p>
              </div>
              <span className="text-[#5E6AD2] text-sm font-medium">{project.progress}%</span>
            </div>
            
            <div className="w-full bg-[#2A2A2A] rounded-full h-2">
              <div 
                className="bg-[#5E6AD2] h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-[#9CA3AF]">
                Created {new Date(project.created_at).toLocaleDateString()}
              </span>
              <button className="text-xs text-[#5E6AD2] hover:underline">
                View Tasks →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
        <h3 className="text-white font-medium mb-2">💡 Reverse Prompt</h3>
        <p className="text-[#9CA3AF] text-sm">
          AI suggests what tasks to do next to advance this project based on current priorities.
        </p>
        <button className="mt-3 px-4 py-2 bg-[#10B981]/20 text-[#10B981] rounded-lg text-sm font-medium hover:bg-[#10B981]/30 transition-colors">
          Ask AI for Next Task
        </button>
      </div>
    </div>
  );
}
