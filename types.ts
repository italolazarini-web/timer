
export interface Task {
  id: string;
  title: string;
  durationSeconds: number;
  isCompleted: boolean;
}

export type ViewState = 'timer' | 'settings';
