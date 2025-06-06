'use client';

import { useState, useEffect } from 'react';
import type { Task, Project } from '@/lib/types';
import { initialTasks, initialProjects } from '@/lib/data';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type TaskStatusFilter = Task['status'] | 'All';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('All');


  useEffect(() => {
    setTasks(initialTasks);
    setProjects(initialProjects);
    setLoading(false);
  }, []);

  const handleAddTask = (data: Omit<Task, 'id' | 'createdAt' | 'projectName'>) => {
    const linkedProject = projects.find(p => p.id === data.projectId);
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      projectName: linkedProject?.projectTopic,
    };
    setTasks(prev => [newTask, ...prev]);
    setIsFormOpen(false);
  };

  const handleEditTask = (data: Omit<Task, 'id' | 'createdAt' | 'projectName'>) => {
    if (!editingTask) return;
    const linkedProject = projects.find(p => p.id === data.projectId);
    setTasks(prev =>
      prev.map(t => (t.id === editingTask.id ? { ...editingTask, ...data, projectName: linkedProject?.projectTopic } : t))
    );
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
     if (window.confirm('Are you sure you want to delete this task?')) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
     }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.projectName && task.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(task => statusFilter === 'All' || task.status === statusFilter);


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Task Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddForm}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <TaskForm
              task={editingTask}
              projects={projects}
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          type="text"
          placeholder="Search tasks by title or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={statusFilter} onValueChange={(value: TaskStatusFilter) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {searchTerm || statusFilter !== 'All' ? 'No tasks match your criteria.' : 'No tasks yet. Click "Add New Task" to get started!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={openEditForm}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
