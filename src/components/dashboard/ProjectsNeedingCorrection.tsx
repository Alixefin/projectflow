import type { Project } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface ProjectsNeedingCorrectionProps {
  projects: Project[];
}

export function ProjectsNeedingCorrection({ projects }: ProjectsNeedingCorrectionProps) {
  const correctionProjects = projects.filter(p => p.status === 'Correction');

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <AlertCircle className="mr-2 h-6 w-6 text-destructive" />
          Projects Needing Correction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {correctionProjects.length === 0 ? (
          <p className="text-muted-foreground">No projects currently need correction.</p>
        ) : (
          <ul className="space-y-3">
            {correctionProjects.map(project => (
              <li key={project.id} className="p-3 bg-destructive/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-destructive-foreground flex items-center">
                       <BookOpen className="h-4 w-4 mr-2 text-destructive"/> {project.projectTopic}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-2" /> {project.clientName}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects?view=${project.id}`}>View Details</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
