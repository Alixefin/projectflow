
'use client';

import { useState, useEffect } from 'react';
import type { Task, Project } from '@/lib/types';
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
import { db } from '@/lib/firebase.config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type TaskStatusFilter = Task['status'] | 'All';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // Keep for linking project names
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('All');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        toast({ title: "Error", description: "Database not initialized. Cannot fetch data.", variant: "destructive" });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fetch Projects for linking names
        const projectsCollection = collection(db, 'projects');
        const projectsSnapshot = await getDocs(query(projectsCollection, orderBy('createdAt', 'desc')));
        const projectsList = projectsSnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Project[];
        setProjects(projectsList);

        // Fetch Tasks
        const tasksCollection = collection(db, 'tasks');
        const qTasks = query(tasksCollection, orderBy('createdAt', 'desc'));
        const tasksSnapshot = await getDocs(qTasks);
        const tasksList = tasksSnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Task[];
        setTasks(tasksList);

      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({ title: "Error", description: "Could not fetch tasks or projects.", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchData();
  }, [toast]);

  const handleAddTask = async (data: Omit<Task, 'id' | 'createdAt' | 'projectName'>) => {
    if (!db) {
      toast({ title: "Error", description: "Database not initialized. Cannot add task.", variant: "destructive" });
      return;
    }
    setLoading(true); // Or a form-specific loading state
    try {
      const linkedProject = projects.find(p => p.id === data.projectId);
      const newTaskData = {
        ...data,
        createdAt: new Date().toISOString(),
        projectName: linkedProject?.projectTopic,
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTaskData);
      setTasks(prev => [{ ...newTaskData, id: docRef.id }, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsFormOpen(false);
      toast({ title: "Success", description: "Task added successfully." });
    } catch (error) {
      console.error("Error adding task: ", error);
      toast({ title: "Error", description: "Could not add task.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEditTask = async (data: Omit<Task, 'id' | 'createdAt' | 'projectName'>) => {
    if (!editingTask || !db) {
      toast({ title: "Error", description: !db ? "Database not initialized." : "No task selected for editing.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const taskRef = doc(db, 'tasks', editingTask.id);
      const linkedProject = projects.find(p => p.id === data.projectId);
      const { id, createdAt, ...updateData } = { ...editingTask, ...data, projectName: linkedProject?.projectTopic };
      
      await updateDoc(taskRef, updateData);
      setTasks(prev =>
        prev.map(t => (t.id === editingTask.id ? { id: editingTask.id, createdAt: editingTask.createdAt, ...updateData } : t))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
      setEditingTask(null);
      setIsFormOpen(false);
      toast({ title: "Success", description: "Task updated successfully." });
    } catch (error) {
      console.error("Error updating task: ", error);
      toast({ title: "Error", description: "Could not update task.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!db) {
      toast({ title: "Error", description: "Database not initialized. Cannot delete task.", variant: "destructive" });
      return;
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
       try {
        await deleteDoc(doc(db, 'tasks', taskId));
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast({ title: "Success", description: "Task deleted successfully." });
      } catch (error) {
        console.error("Error deleting task: ", error);
        toast({ title: "Error", description: "Could not delete task.", variant: "destructive" });
      }
      setLoading(false);
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

  if (loading && tasks.length === 0 && projects.length === 0) {
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
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingTask(null);}}>
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
              projects={projects} // Pass fetched projects for dropdown
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              onCancel={() => { setIsFormOpen(false); setEditingTask(null); }}
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

      {filteredTasks.length === 0 && !loading ? (
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
