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
import { Clock, CheckCircle, AlertCircle, Circle } from 'lucide-react';

const columns = [
  { id: 'todo', title: 'To Do', color: '#9CA3AF', icon: Circle },
  { id: 'in_progress', title: 'In Progress', color: '#3B82F6', icon: Clock },
  { id: 'review', title: 'Review', color: '#F59E0B', icon: AlertCircle },
  { id: 'done', title: 'Done', color: '#10B981', icon: CheckCircle },
];

function TaskCard({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-[#1A1A1A] p-3 rounded-lg border border-[#2A2A2A] cursor-grab active:cursor-grabbing hover:border-[#5E6AD2]/50 transition-colors"
    >
      <p className="text-white text-sm font-medium mb-2">{task.title}</p>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#5E6AD2] flex items-center justify-center text-white text-xs font-bold">
          {task.agent_id}
        </div>
        <span className="text-[#9CA3AF] text-xs">Agent {task.agent_id}</span>
      </div>
    </div>
  );
}

function Column({ id, title, color, icon: Icon, tasks }: { id: string; title: string; color: string; icon: any; tasks: any[] }) {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div className="flex-1 min-w-[250px]">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color }} />
        <h3 className="font-medium text-white">{title}</h3>
        <span className="text-xs text-[#9CA3AF] bg-[#2A2A2A] px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className="space-y-2 min-h-[400px] bg-[#0D0D0D] rounded-lg p-2 border border-[#2A2A2A]"
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="w-72 border-l border-[#2A2A2A] pl-4 ml-4">
      <h3 className="font-medium text-white mb-3">Activity Feed</h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {activities.map((activity: any) => (
          <div key={activity.id} className="text-xs">
            <span className="text-[#9CA3AF]">
              {new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </span>
            <span className="text-white"> - AI Agent ({activity.agent_id}) </span>
            <span className="text-[#9CA3AF]">{activity.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
      
      // Add activity
      const newActivity = {
        agent_id: task.agent_id,
        action: `moved '${task.title}' to ${newStatus}`,
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
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 flex-1 overflow-x-auto">
          {columns.map(col => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              icon={col.icon}
              tasks={tasks.filter((t: any) => t.status === col.id)}
            />
          ))}
        </div>
      </DndContext>
      
      <ActivityFeed activities={activityList} />
    </div>
  );
}
