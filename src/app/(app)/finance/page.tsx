
'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { OverallFinanceSummary } from '@/components/finance/OverallFinanceSummary';
import { FinanceDetailsTable } from '@/components/finance/FinanceDetailsTable';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function FinancePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!db) {
        toast({ title: "Error", description: "Database not initialized. Cannot fetch financial data.", variant: "destructive" });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const projectsCollection = collection(db, 'projects');
        const q = query(projectsCollection, orderBy('createdAt', 'desc'));
        const projectsSnapshot = await getDocs(q);
        const projectsList = projectsSnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Project[];
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects for finance page: ", error);
        toast({ title: "Error", description: "Could not fetch financial data.", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchProjects();
  }, [toast]);

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
