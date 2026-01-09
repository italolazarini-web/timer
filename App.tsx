
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from './types';
import TimerView from './components/TimerView';
import SettingsView from './components/SettingsView';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Focus Session', durationSeconds: 1500, isCompleted: false },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TASKS[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  // Fixed: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> to avoid namespace error in browser environment
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle double click to rotate
  const handleDoubleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
  }, [isRunning]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();
    const currentTask = tasks[currentTaskIndex];
    if (currentTask) {
      setTimeLeft(currentTask.durationSeconds);
    }
    // Also reset completion status if desired, but here we just reset the current clock
  }, [tasks, currentTaskIndex, pauseTimer]);

  const completeTask = useCallback(() => {
    setTasks(prev => prev.map((t, idx) => 
      idx === currentTaskIndex ? { ...t, isCompleted: true } : t
    ));

    if (currentTaskIndex < tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      setTimeLeft(tasks[nextIndex].durationSeconds);
    } else {
      setIsRunning(false);
    }
  }, [currentTaskIndex, tasks]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      completeTask();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, completeTask]);

  // Sync timeLeft if settings change or current task changes
  useEffect(() => {
    if (!isRunning) {
      const currentTask = tasks[currentTaskIndex];
      if (currentTask) {
        setTimeLeft(currentTask.durationSeconds);
      }
    }
  }, [tasks, currentTaskIndex, isRunning]);

  return (
    <div 
      className="relative w-80 h-80 perspective-1000 cursor-default select-none"
      onDoubleClick={handleDoubleClick}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT: Timer View */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-full glass shadow-2xl overflow-hidden">
          <TimerView 
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            timeLeft={timeLeft}
            isRunning={isRunning}
            onToggleRunning={() => isRunning ? pauseTimer() : startTimer()}
            onReset={resetTimer}
          />
        </div>

        {/* BACK: Settings View */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-full glass shadow-2xl overflow-hidden">
          <SettingsView 
            tasks={tasks}
            setTasks={setTasks}
            onClose={() => setIsFlipped(false)}
          />
        </div>
      </div>
      
      {/* Subtle Hint */}
      <div className="absolute -bottom-10 left-0 right-0 text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white uppercase tracking-widest">Double click to setup</p>
      </div>
    </div>
  );
};

export default App;
