import TaskBoard from '@/components/TaskBoard';

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Board</h1>
          <p className="text-[#9CA3AF] text-sm">AI autonomous workflow</p>
        </div>
        <button className="px-4 py-2 bg-[#5E6AD2] text-white rounded-lg text-sm font-medium hover:bg-[#4B52B8] transition-colors">
          + New Task
        </button>
      </div>
      
      <TaskBoard />
    </div>
  );
}
