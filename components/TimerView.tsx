
import React from 'react';
import { Task } from '../types';

interface TimerViewProps {
  tasks: Task[];
  currentTaskIndex: number;
  timeLeft: number;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
}

const TimerView: React.FC<TimerViewProps> = ({ 
  tasks, 
  currentTaskIndex, 
  timeLeft, 
  isRunning, 
  onToggleRunning,
  onReset 
}) => {
  const currentTask = tasks[currentTaskIndex] || { title: 'No Task', durationSeconds: 0 };
  const totalSeconds = currentTask.durationSeconds || 1;
  const progress = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
  
  // SVG Circle Logic
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-white text-center">
      {/* Progress Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1s linear'
            }}
          />
        </svg>
      </div>

      {/* Task Info */}
      <div className="z-10 flex flex-col items-center justify-center space-y-2 mt-4">
        <span className="text-xs font-light tracking-widest uppercase opacity-70">
          Step {currentTaskIndex + 1} of {tasks.length}
        </span>
        <h2 className="text-xl font-semibold max-w-[180px] truncate">
          {currentTask.title}
        </h2>
        <div className="text-5xl font-extralight tracking-tighter my-4">
          {formatTime(timeLeft)}
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            title="Reset"
          >
            <i className="fas fa-undo-alt opacity-60"></i>
          </button>
          
          <button 
            onClick={onToggleRunning}
            className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all transform active:scale-90"
            title={isRunning ? "Pause" : "Start"}
          >
            <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'} text-xl`}></i>
          </button>

          <div className="w-10 h-10 flex items-center justify-center">
            {currentTask.isCompleted ? (
              <i className="fas fa-check-circle text-green-400 animate-bounce"></i>
            ) : (
              <i className="fas fa-clock opacity-20"></i>
            )}
          </div>
        </div>
      </div>

      {/* Steps Indicators */}
      <div className="absolute bottom-10 flex space-x-1.5">
        {tasks.map((t, idx) => (
          <div 
            key={t.id}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentTaskIndex 
                ? 'bg-white scale-125' 
                : t.isCompleted 
                  ? 'bg-green-400 opacity-60' 
                  : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TimerView;
