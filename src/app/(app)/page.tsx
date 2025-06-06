
'use client';

import { useState, useEffect } from 'react';
import type { Project, Task } from '@/lib/types';
import { DateTimeWidget } from '@/components/DateTimeWidget';
import { FinanceOverview } from '@/components/dashboard/FinanceOverview';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { ProjectsNeedingCorrection } from '@/components/dashboard/ProjectsNeedingCorrection';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        toast({ title: "Error", description: "Database not initialized. Cannot fetch dashboard data.", variant: "destructive" });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const projectsCollection = collection(db, 'projects');
        const qProjects = query(projectsCollection, orderBy('createdAt', 'desc'));
        const projectsSnapshot = await getDocs(qProjects);
        const projectsList = projectsSnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Project[];
        setProjects(projectsList);

        const tasksCollection = collection(db, 'tasks');
        // Fetching tasks relevant for the dashboard (e.g., pending, recently created)
        const qTasks = query(tasksCollection, orderBy('createdAt', 'desc'), limit(20)); // Example: limit to 20 recent tasks for dashboard
        const tasksSnapshot = await getDocs(qTasks);
        const tasksList = tasksSnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Task[];
        setTasks(tasksList);

      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
        toast({ title: "Error", description: "Could not fetch dashboard data.", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateTimeWidget />
      <FinanceOverview projects={projects} />
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingTasks tasks={tasks} />
        <ProjectsNeedingCorrection projects={projects} />
      </div>
    </div>
  );
}
