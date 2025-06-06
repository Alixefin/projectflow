import type { Task } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CalendarDays, AlertTriangle, CheckCircle, Zap, Package, CornerDownRight } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const statusIcons = {
  'To Do': <Package className="h-4 w-4 mr-1" />,
  'In Progress': <Zap className="h-4 w-4 mr-1" />,
  'Done': <CheckCircle className="h-4 w-4 mr-1 text-green-500" />,
};

const statusColors: Record<Task['status'], string> = {
  'To Do': 'bg-gray-500/20 text-gray-700',
  'In Progress': 'bg-blue-500/20 text-blue-700',
  'Done': 'bg-green-500/20 text-green-700',
};

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg mb-1">{task.title}</CardTitle>
           <Badge className={`${statusColors[task.status]} py-1 px-2.5 text-xs`}>
            {statusIcons[task.status]}
            {task.status}
          </Badge>
        </div>
        {task.projectName && (
            <CardDescription className="text-xs text-muted-foreground flex items-center">
              <CornerDownRight className="h-3 w-3 mr-1" /> Linked to: {task.projectName}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
        <div className="flex items-center text-sm space-x-4">
          {task.isCorrection && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" /> Correction
            </Badge>
          )}
          {task.dueDate && (
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
          <Edit className="mr-1 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
