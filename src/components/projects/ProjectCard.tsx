import type { Project } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, Calendar, AlertCircle, CheckCircle, Zap, Hourglass } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const statusIcons = {
  'Pending': <Hourglass className="h-4 w-4 mr-1" />,
  'In Progress': <Zap className="h-4 w-4 mr-1" />,
  'Correction': <AlertCircle className="h-4 w-4 mr-1 text-destructive" />,
  'Completed': <CheckCircle className="h-4 w-4 mr-1 text-green-500" />,
};

const statusColors: Record<Project['status'], string> = {
  'Pending': 'bg-gray-500/20 text-gray-700',
  'In Progress': 'bg-blue-500/20 text-blue-700',
  'Correction': 'bg-red-500/20 text-red-700',
  'Completed': 'bg-green-500/20 text-green-700',
};


export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const balance = project.totalAmount - project.paidAmount;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg mb-1">{project.projectTopic}</CardTitle>
          <Badge className={`${statusColors[project.status]} py-1 px-2.5 text-xs`}>
            {statusIcons[project.status]}
            {project.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {project.clientName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} aria-label={`${project.progress}% complete`} className="h-2"/>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Total Amount:</p>
            <p className="font-semibold">{formatCurrency(project.totalAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Paid Amount:</p>
            <p className="font-semibold text-green-600">{formatCurrency(project.paidAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Balance:</p>
            <p className="font-semibold text-orange-600">{formatCurrency(balance)}</p>
          </div>
          {project.deadline && (
             <div>
                <p className="text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Deadline:
                </p>
                <p className="font-semibold">{formatDate(project.deadline)}</p>
              </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
          <Edit className="mr-1 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(project.id)}>
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
