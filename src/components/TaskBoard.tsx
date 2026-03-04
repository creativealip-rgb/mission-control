'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Clock, CheckCircle, AlertCircle, Circle, Activity, GripVertical } from 'lucide-react';

const columns = [
  { id: 'todo', title: 'To Do', color: '#a1a1aa', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Circle },
  { id: 'in_progress', title: 'In Progress', color: '#6366f1', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: Clock },
  { id: 'review', title: 'Review', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle },
  { id: 'done', title: 'Done', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
];

function TaskCard({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative group bg-[#0a0a0a] border border-white/5 p-4 rounded-xl shadow-lg transition-all duration-300
        ${isDragging ? 'opacity-80 scale-105 shadow-2xl z-50 border-indigo-500/50' : 'hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)]'}
      `}
    >
      <div
        {...listeners}
        className="absolute right-2 top-2 p-1 text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={16} />
      </div>

      <p className="text-white text-sm font-medium mb-4 pr-6 leading-relaxed">
        {task.title}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {task.agent_id}
          </div>
          <span className="text-gray-400 text-xs font-medium">Agent {task.agent_id}</span>
        </div>
      </div>
    </div>
  );
}

function Column({ id, title, color, bg, border, icon: Icon, tasks }: { id: string; title: string; color: string; bg: string; border: string; icon: any; tasks: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px] flex-shrink-0 h-full">
      <div className={`flex items-center justify-between mb-4 px-4 py-3 rounded-2xl border ${border} ${bg} backdrop-blur-md`}>
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color }} />
          <h3 className="font-semibold text-white tracking-wide">{title}</h3>
        </div>
        <span className="text-xs font-bold text-white/80 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 shadow-inner">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 min-h-[500px] rounded-3xl p-3 border transition-colors duration-300 overflow-y-auto scrollbar-hide
          ${isOver ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-black/20 border-white/5 backdrop-blur-sm'}
        `}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20 text-sm font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="w-80 flex flex-col h-full bg-black/20 border border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden ml-6">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-indigo-400" />
          <h3 className="font-semibold text-white tracking-wide">Activity Feed</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {activities.length === 0 ? (
          <div className="text-center text-white/40 text-sm py-10">No recent activity</div>
        ) : (
          activities.map((activity: any, index: number) => (
            <div key={activity.id || index} className="relative pl-4">
              {/* Timeline line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-[-20px] w-[2px] bg-gradient-to-b from-white/10 to-transparent" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-zinc-900 border-2 border-indigo-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between text-white/50">
                  <span className="font-mono text-[10px]">
                    {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-white/80 leading-relaxed">
                  <span className="font-medium text-indigo-300">Agent {activity.agent_id}</span> {activity.action}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || []);
        setActivityList(data.activities || []);
        setLoading(false);
      });
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    if (newStatus !== active.id) {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Optimistic update
      setTasks((items) => {
        const taskIndex = items.findIndex((t: any) => t.id === taskId);
        const newItems = [...items];
        newItems[taskIndex] = { ...newItems[taskIndex], status: newStatus };
        return newItems;
      });

      const statusTitle = columns.find(c => c.id === newStatus)?.title || newStatus;

      // Add activity
      const newActivity = {
        agent_id: task.agent_id,
        action: `moved '${task.title}' to ${statusTitle}`,
        timestamp: new Date().toISOString()
      };
      setActivityList((prev: any) => [newActivity, ...prev]);

      // Update on server
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, status: newStatus, agent_id: task.agent_id })
      });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-indigo-300 animate-pulse font-medium tracking-wide">Initializing Systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full pb-4">
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full px-2">
            {columns.map(col => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                color={col.color}
                bg={col.bg}
                border={col.border}
                icon={col.icon}
                tasks={tasks.filter((t: any) => t.status === col.id)}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <div className="hidden xl:block h-full">
        <ActivityFeed activities={activityList} />
      </div>
    </div>
  );
}
