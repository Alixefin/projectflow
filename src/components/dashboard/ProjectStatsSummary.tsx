
'use client';

import type { Project } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle, CheckCircle, Briefcase } from 'lucide-react';

interface ProjectStatsSummaryProps {
  projects: Project[];
}

export function ProjectStatsSummary({ projects }: ProjectStatsSummaryProps) {
  const totalProjects = projects.length;
  const correctionProjectsCount = projects.filter(p => p.status === 'Correction').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Briefcase className="mr-2 h-6 w-6 text-primary" />
          Project Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <StatBox
          title="Total Projects"
          value={totalProjects.toString()}
          icon={<Users className="h-5 w-5 text-blue-500" />}
          bgColor="bg-blue-500/5"
          textColor="text-blue-600"
        />
        <StatBox
          title="Needs Correction"
          value={correctionProjectsCount.toString()}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          bgColor="bg-red-500/5"
          textColor="text-red-600"
        />
        <StatBox
          title="Completed"
          value={completedProjectsCount.toString()}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          bgColor="bg-green-500/5"
          textColor="text-green-600"
        />
      </CardContent>
    </Card>
  );
}

interface StatBoxProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

function StatBox({ title, value, icon, bgColor = "bg-muted/30", textColor = "text-foreground" }: StatBoxProps) {
  return (
    <div className={`p-4 ${bgColor} rounded-lg`}>
      <div className="flex items-center mb-1">
        {icon}
        <h3 className="text-sm font-medium text-muted-foreground ml-2">{title}</h3>
      </div>
      <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
    </div>
  );
}
