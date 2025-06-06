export type ProjectStatus = 'Pending' | 'In Progress' | 'Correction' | 'Completed';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Project {
  id: string;
  clientName: string;
  projectTopic: string;
  progress: number; // Percentage 0-100
  totalAmount: number; // NGN
  paidAmount: number; // NGN
  status: ProjectStatus;
  deadline?: string; // ISO date string e.g., "2024-12-31"
  createdAt: string; // ISO date string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string; // Link to Project.id
  projectName?: string; // Denormalized for easy display
  status: TaskStatus;
  isCorrection: boolean;
  dueDate?: string; // ISO date string e.g., "2024-12-31"
  createdAt: string; // ISO date string
}
