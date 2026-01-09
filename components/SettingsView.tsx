
import React, { useState } from 'react';
import { Task } from '../types';

interface SettingsViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ tasks, setTasks, onClose }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newMinutes, setNewMinutes] = useState('25');

  const addTask = () => {
    if (tasks.length >= 7 || !newTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      durationSeconds: parseInt(newMinutes) * 60 || 60,
      isCompleted: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTitle('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateDuration = (id: string, mins: string) => {
      const val = parseInt(mins) || 0;
      setTasks(tasks.map(t => t.id === id ? { ...t, durationSeconds: val * 60 } : t));
  };

  return (
    <div className="flex flex-col w-full h-full p-6 text-white">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Setup Sequence</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 max-h-[160px] px-2">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center space-x-2 bg-white/5 p-2 rounded-lg border border-white/10 group">
            <span className="text-[10px] opacity-40 w-4">{index + 1}</span>
            <input 
              className="bg-transparent border-none outline-none text-xs flex-1 truncate"
              value={task.title}
              onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, title: e.target.value } : t))}
              placeholder="Title"
            />
            <div className="flex items-center">
                <input 
                    className="bg-transparent border-none outline-none text-xs w-8 text-right pr-1"
                    value={Math.floor(task.durationSeconds / 60)}
                    onChange={(e) => updateDuration(task.id, e.target.value)}
                    type="number"
                />
                <span className="text-[10px] opacity-40">m</span>
            </div>
            <button 
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all px-1"
            >
              <i className="fas fa-trash-alt text-[10px]"></i>
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-4 text-xs opacity-40">No tasks defined</div>
        )}
      </div>

      {/* Add Task Input */}
      {tasks.length < 7 && (
        <div className="mt-4 px-2 space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-xs flex-1 outline-none placeholder:text-white/30"
              placeholder="Quick title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <input 
              className="bg-white/10 border border-white/20 rounded w-12 py-1.5 text-xs text-center outline-none"
              type="number"
              value={newMinutes}
              onChange={(e) => setNewMinutes(e.target.value)}
            />
            <button 
              onClick={addTask}
              className="bg-white/20 hover:bg-white/40 w-8 h-8 rounded flex items-center justify-center transition-all"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
          <p className="text-[9px] text-center opacity-40">Max 7 tasks. Auto-starts next.</p>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
