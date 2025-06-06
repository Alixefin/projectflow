'use client';

import { useState, useEffect } from 'react';
import type { Project, Task } from '@/lib/types';
import { initialProjects, initialTasks } from '@/lib/data'; // Mock data
import { DateTimeWidget } from '@/components/DateTimeWidget';
import { FinanceOverview } from '@/components/dashboard/FinanceOverview';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { ProjectsNeedingCorrection } from '@/components/dashboard/ProjectsNeedingCorrection';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setProjects(initialProjects);
    setTasks(initialTasks);
    setLoading(false);
  }, []);

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
