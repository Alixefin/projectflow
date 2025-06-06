'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { initialProjects } from '@/lib/data';
import { OverallFinanceSummary } from '@/components/finance/OverallFinanceSummary';
import { FinanceDetailsTable } from '@/components/finance/FinanceDetailsTable';
import { Skeleton } from '@/components/ui/skeleton';

export default function FinancePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setProjects(initialProjects);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Finance Management</h1>
      <OverallFinanceSummary projects={projects} />
      <FinanceDetailsTable projects={projects} />
    </div>
  );
}
