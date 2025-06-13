
'use client';

import { useState, useEffect } from 'react';
import type { Project, Task } from '@/lib/types';
import { DateTimeWidget } from '@/components/DateTimeWidget';
import { FinanceOverview } from '@/components/dashboard/FinanceOverview';
import { ProjectStatsSummary } from '@/components/dashboard/ProjectStatsSummary';
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
        const qTasks = query(tasksCollection, orderBy('createdAt', 'desc'), limit(20));
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
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateTimeWidget />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FinanceOverview projects={projects} />
        <ProjectStatsSummary projects={projects} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingTasks tasks={tasks} />
        <ProjectsNeedingCorrection projects={projects} />
      </div>
    </div>
  );
}
